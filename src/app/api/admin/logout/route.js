import { NextResponse } from "next/server";
import { SESSION_COOKIE, NO_AUTO_LOGIN_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Overwrite with an already-expired cookie on the same path it was set with,
  // then delete — belt and braces across browsers.
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.delete(SESSION_COOKIE);

  response.cookies.set(NO_AUTO_LOGIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
