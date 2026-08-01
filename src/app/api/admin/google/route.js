import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, MAX_AGE_SECONDS } from "@/lib/session";

// Verifies a Google Identity Services ID token server-side, checks the email
// against the ADMIN_EMAILS allowlist, then issues the same admin session
// cookie as the password login.
export async function POST(request) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!clientId || allowlist.length === 0) {
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
  const allowed = allowlist.includes((info.email || "").toLowerCase());

  if (!validAudience || !validIssuer || !notExpired || !emailVerified) {
    return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
  }
  if (!allowed) {
    return NextResponse.json(
      { error: `${info.email} is not an authorized admin` },
      { status: 403 }
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}
