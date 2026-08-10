import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  MAX_AGE_SECONDS,
  NO_AUTO_LOGIN_COOKIE,
} from "@/lib/session";

export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSessionToken({ method: "password" });
  const response = NextResponse.json({ ok: true });
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
