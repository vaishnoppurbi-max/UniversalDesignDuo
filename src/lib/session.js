const SESSION_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Set by logout, cleared on an explicit sign-in. Suppresses the localhost
// auto-login so signing out actually keeps you signed out.
const NO_AUTO_LOGIN_COOKIE = "admin_no_auto_login";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Add it to .env.local.");
  }
  return secret;
}

async function getKey() {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    str.length + ((4 - (str.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function textToBase64Url(str) {
  return bytesToBase64Url(new TextEncoder().encode(str));
}

function base64UrlToText(str) {
  return new TextDecoder().decode(base64UrlToBytes(str));
}

/**
 * Session token = base64url(JSON payload) + "." + base64url(HMAC signature).
 * Payload: { exp, email, name, picture, method }
 *   - method: "password" | "google"
 *   - fields other than exp are optional (password login carries no identity)
 * Backward compat: old "<expires>.<sig>" tokens (numeric first segment)
 * still verify.
 */
export async function createSessionToken(user = {}) {
  const payload = {
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
    email: user.email || null,
    name: user.name || null,
    picture: user.picture || null,
    method: user.method || "password",
    role: user.role || null,
  };
  const payloadB64 = textToBase64Url(JSON.stringify(payload));
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  const sig = bytesToBase64Url(new Uint8Array(sigBuf));
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(token) {
  const parsed = await readSessionToken(token);
  return !!parsed;
}

export async function readSessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [head, sig] = token.split(".");
  if (!head || !sig) return null;

  try {
    const key = await getKey();

    // Legacy format: "<millis>.<sig>" where signature was over the raw
    // millis string. Verify then return an empty user record.
    if (/^\d+$/.test(head)) {
      const expires = Number(head);
      if (!expires || Date.now() > expires) return null;
      const ok = await crypto.subtle.verify(
        "HMAC",
        key,
        base64UrlToBytes(sig),
        new TextEncoder().encode(head)
      );
      return ok
        ? { exp: expires, email: null, name: null, picture: null, method: "password" }
        : null;
    }

    // New format: signature is over the base64url payload segment.
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(sig),
      new TextEncoder().encode(head)
    );
    if (!ok) return null;
    const payload = JSON.parse(base64UrlToText(head));
    if (!payload || typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, MAX_AGE_SECONDS, NO_AUTO_LOGIN_COOKIE };
