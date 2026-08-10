import { NextResponse } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/session";
import {
  listUsers,
  addUser,
  updateUser,
  removeUser,
  getSuperAdmin,
  ROLES,
} from "@/lib/users";

// Every mutation here is Super-Admin-only. Reads are allowed for any signed-in
// admin so the panel can show the team roster.
async function getSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return readSessionToken(token);
}

function isSuper(session) {
  const email = (session?.email || "").toLowerCase();
  return !!email && email === getSuperAdmin();
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function forbidden() {
  return NextResponse.json(
    { error: "Only the Super Admin can manage users" },
    { status: 403 }
  );
}

export async function GET(request) {
  const session = await getSession(request);
  if (!session) return unauthorized();

  return NextResponse.json({
    users: await listUsers(),
    roles: ROLES,
    superAdmin: getSuperAdmin(),
    canManage: isSuper(session),
  });
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  if (!isSuper(session)) return forbidden();

  const { email, role } = await request.json().catch(() => ({}));
  try {
    const users = await addUser(email, role || "editor", session.email);
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  if (!isSuper(session)) return forbidden();

  const { email, role, disabled } = await request.json().catch(() => ({}));
  try {
    const patch = {};
    if (role !== undefined) patch.role = role;
    if (disabled !== undefined) patch.disabled = disabled;
    const users = await updateUser(email, patch);
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  if (!isSuper(session)) return forbidden();

  const { email } = await request.json().catch(() => ({}));
  try {
    const users = await removeUser(email);
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
