import { NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";
import { listUsers, getSuperAdmin, isOpenAccess, ROLES } from "@/lib/users";

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const superAdmin = getSuperAdmin();
  const email = (session.email || "").toLowerCase();
  const isSuper = !!email && email === superAdmin;

  const users = await listUsers();
  const me = users.find((u) => u.email === email);
  const role = isSuper ? "super_admin" : me?.role || session.role || "admin";

  return NextResponse.json({
    email: session.email,
    name: session.name,
    picture: session.picture,
    method: session.method,
    role,
    roleLabel: ROLES[role]?.label || "Admin",
    isSuper,
    superAdmin,
    admins: users.map((u) => u.email),
    users,
    openAccess: isOpenAccess(),
  });
}
