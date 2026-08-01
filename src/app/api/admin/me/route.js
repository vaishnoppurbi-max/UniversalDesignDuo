import { NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";

function getAdminList() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function getSuperAdmin() {
  const explicit = (process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  if (explicit) return explicit;
  return getAdminList()[0] || null;
}

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const superAdmin = getSuperAdmin();
  const admins = getAdminList();
  const email = (session.email || "").toLowerCase();
  const isSuper = !!email && email === superAdmin;

  return NextResponse.json({
    email: session.email,
    name: session.name,
    picture: session.picture,
    method: session.method,
    role: isSuper ? "super_admin" : session.email ? "admin" : "admin_password",
    isSuper,
    superAdmin,
    admins,
  });
}
