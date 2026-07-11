import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

export async function requireAuth(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
