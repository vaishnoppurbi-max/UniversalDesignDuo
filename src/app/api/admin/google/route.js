import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  MAX_AGE_SECONDS,
  NO_AUTO_LOGIN_COOKIE,
} from "@/lib/session";
import { resolveUser, recordLogin, isOpenAccess } from "@/lib/users";

// Verifies a Google Identity Services ID token server-side, resolves the
// account against the user store (env admins + managed users + open access),
// then issues the same admin session cookie as the password login.
export async function POST(request) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Google sign-in is not configured" },
      { status: 501 }
    );
  }

  const { credential } = await request.json();
  if (!credential) {
    return NextResponse.json({ error: "Missing credential" }, { status: 400 });
  }

  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );
  if (!res.ok) {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }
  const info = await res.json();

  const validAudience = info.aud === clientId;
  const validIssuer =
    info.iss === "https://accounts.google.com" || info.iss === "accounts.google.com";
  const notExpired = Number(info.exp) * 1000 > Date.now();
  const emailVerified = info.email_verified === "true" || info.email_verified === true;

  if (!validAudience || !validIssuer || !notExpired || !emailVerified) {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }

  const email = (info.email || "").toLowerCase();
  const user = await resolveUser(email);

  if (!user) {
    return NextResponse.json(
      {
        error: isOpenAccess()
          ? `${info.email} has been disabled by an administrator`
          : `${info.email} is not an authorized admin`,
      },
      { status: 403 }
    );
  }

  await recordLogin(email, info.name, info.picture);

  const token = await createSessionToken({
    method: "google",
    email,
    name: info.name || null,
    picture: info.picture || null,
    role: user.role,
  });

  const response = NextResponse.json({ ok: true, role: user.role });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  // An explicit sign-in clears the sign-out marker.
  response.cookies.delete(NO_AUTO_LOGIN_COOKIE);
  return response;
}
