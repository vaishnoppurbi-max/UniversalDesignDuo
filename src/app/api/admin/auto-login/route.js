import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  MAX_AGE_SECONDS,
  NO_AUTO_LOGIN_COOKIE,
} from "@/lib/session";

// Development-only convenience: issue a session cookie without a password
// so the admin panel opens instantly on localhost. Blocked in production.
export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  // Respect an explicit sign-out — otherwise logout would bounce right back in.
  if (request.cookies.get(NO_AUTO_LOGIN_COOKIE)?.value) {
    return NextResponse.json({ error: "Signed out" }, { status: 403 });
  }

  const superAdmin = (process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  const firstAdmin = ((process.env.ADMIN_EMAILS || "").split(",")[0] || "").trim().toLowerCase();

  const token = await createSessionToken({
    method: "password",
    email: superAdmin || firstAdmin || null,
    name: superAdmin || firstAdmin ? "Auto-login (dev)" : null,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}
