import fs from "node:fs/promises";
import path from "node:path";
import { getSupabase, isSupabaseConfigured, CONTENT_TABLE } from "./supabase";

// Admin users live apart from site content so they are never part of the
// payload public pages read. File mode writes data/admin-users.json; Supabase
// mode reuses the site_content table under a separate row id.
const USERS_PATH = path.join(process.cwd(), "data", "admin-users.json");
const USERS_ROW_ID = 2;

export const ROLES = {
  super_admin: {
    label: "Super Admin",
    rank: 3,
    perms: "Full access — manage users, settings, and all content.",
  },
  admin: {
    label: "Admin",
    rank: 2,
    perms: "Edit all site content. Cannot manage users or settings.",
  },
  editor: {
    label: "Editor",
    rank: 1,
    perms: "Edit portfolio, gallery, and blog only.",
  },
  viewer: {
    label: "Viewer",
    rank: 0,
    perms: "Read-only — can view the dashboard but not save changes.",
  },
};

export function isValidRole(role) {
  return Object.prototype.hasOwnProperty.call(ROLES, role);
}

function normalise(email) {
  return (email || "").trim().toLowerCase();
}

export function getEnvAdmins() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(normalise)
    .filter(Boolean);
}

export function getSuperAdmin() {
  const explicit = normalise(process.env.SUPER_ADMIN_EMAIL);
  if (explicit) return explicit;
  return getEnvAdmins()[0] || null;
}

export function isOpenAccess() {
  return (
    /^(1|true|yes)$/i.test(process.env.ALLOW_ANY_GOOGLE_USER || "") ||
    getEnvAdmins().length === 0
  );
}

// ── Store ───────────────────────────────────────────────────────────────────

async function readStore() {
  if (!isSupabaseConfigured) {
    try {
      const raw = await fs.readFile(USERS_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.users) ? parsed.users : [];
    } catch {
      return []; // no file yet
    }
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select("data")
    .eq("id", USERS_ROW_ID)
    .maybeSingle();

  if (error || !data) return [];
  return Array.isArray(data.data?.users) ? data.data.users : [];
}

async function writeStore(users) {
  if (!isSupabaseConfigured) {
    await fs.mkdir(path.dirname(USERS_PATH), { recursive: true });
    await fs.writeFile(USERS_PATH, JSON.stringify({ users }, null, 2), "utf-8");
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from(CONTENT_TABLE).upsert({
    id: USERS_ROW_ID,
    data: { users },
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Failed to save users: ${error.message}`);
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Full user list: env-configured admins merged with stored users.
 * Env entries are marked `source: "env"` and cannot be deleted from the UI.
 */
export async function listUsers() {
  const stored = await readStore();
  const superAdmin = getSuperAdmin();
  const byEmail = new Map();

  for (const email of getEnvAdmins()) {
    byEmail.set(email, {
      email,
      role: email === superAdmin ? "super_admin" : "admin",
      source: "env",
      addedAt: null,
      lastLogin: null,
    });
  }

  for (const user of stored) {
    const email = normalise(user.email);
    if (!email) continue;
    const existing = byEmail.get(email);
    byEmail.set(email, {
      email,
      role: email === superAdmin ? "super_admin" : user.role || "admin",
      source: existing?.source === "env" ? "env" : "store",
      addedAt: user.addedAt || null,
      addedBy: user.addedBy || null,
      lastLogin: user.lastLogin || existing?.lastLogin || null,
      disabled: !!user.disabled,
    });
  }

  return [...byEmail.values()].sort((a, b) => {
    const rank = (ROLES[b.role]?.rank ?? 0) - (ROLES[a.role]?.rank ?? 0);
    return rank !== 0 ? rank : a.email.localeCompare(b.email);
  });
}

/** Resolve one account's effective role, or null if not permitted to sign in. */
export async function resolveUser(email) {
  const target = normalise(email);
  if (!target) return null;

  const superAdmin = getSuperAdmin();
  if (target === superAdmin) {
    return { email: target, role: "super_admin", source: "env" };
  }

  const users = await listUsers();
  const found = users.find((u) => u.email === target);

  if (found) {
    if (found.disabled) return null;
    return found;
  }

  // Not on any list — allowed only while open access is on, as a guest.
  if (isOpenAccess()) {
    return { email: target, role: "editor", source: "guest" };
  }
  return null;
}

export async function addUser(email, role, addedBy) {
  const target = normalise(email);
  if (!target || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(target)) {
    throw new Error("Enter a valid email address");
  }
  if (!isValidRole(role) || role === "super_admin") {
    throw new Error("Pick a valid role");
  }
  if (getEnvAdmins().includes(target)) {
    throw new Error(`${target} is already configured in .env.local`);
  }

  const users = await readStore();
  if (users.some((u) => normalise(u.email) === target)) {
    throw new Error(`${target} has already been added`);
  }

  users.push({
    email: target,
    role,
    addedAt: new Date().toISOString(),
    addedBy: normalise(addedBy) || null,
    lastLogin: null,
    disabled: false,
  });
  await writeStore(users);
  return listUsers();
}

export async function updateUser(email, patch) {
  const target = normalise(email);
  if (target === getSuperAdmin()) {
    throw new Error("The Super Admin cannot be modified here");
  }
  if (getEnvAdmins().includes(target)) {
    throw new Error("This user is configured in .env.local — edit it there");
  }

  const users = await readStore();
  const user = users.find((u) => normalise(u.email) === target);
  if (!user) throw new Error("User not found");

  if (patch.role !== undefined) {
    if (!isValidRole(patch.role) || patch.role === "super_admin") {
      throw new Error("Pick a valid role");
    }
    user.role = patch.role;
  }
  if (patch.disabled !== undefined) user.disabled = !!patch.disabled;

  await writeStore(users);
  return listUsers();
}

export async function removeUser(email) {
  const target = normalise(email);
  if (target === getSuperAdmin()) {
    throw new Error("The Super Admin cannot be removed");
  }
  if (getEnvAdmins().includes(target)) {
    throw new Error("This user is configured in .env.local — remove it there");
  }

  const users = await readStore();
  const next = users.filter((u) => normalise(u.email) !== target);
  if (next.length === users.length) throw new Error("User not found");

  await writeStore(next);
  return listUsers();
}

/** Record a successful sign-in. Auto-enrols guests so they appear in the UI. */
export async function recordLogin(email, name, picture) {
  const target = normalise(email);
  if (!target || target === getSuperAdmin() || getEnvAdmins().includes(target)) {
    return;
  }

  const users = await readStore();
  const existing = users.find((u) => normalise(u.email) === target);
  const now = new Date().toISOString();

  if (existing) {
    existing.lastLogin = now;
    if (name) existing.name = name;
    if (picture) existing.picture = picture;
  } else {
    users.push({
      email: target,
      role: "editor",
      name: name || null,
      picture: picture || null,
      addedAt: now,
      addedBy: "open-access",
      lastLogin: now,
      disabled: false,
    });
  }

  try {
    await writeStore(users);
  } catch {
    // Login should not fail because the audit write failed.
  }
}
