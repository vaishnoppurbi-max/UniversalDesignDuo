const SESSION_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

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

export async function createSessionToken() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const key = await getKey();
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(String(expires)));
  const sig = bytesToBase64Url(new Uint8Array(signature));
  return `${expires}.${sig}`;
}

export async function verifySessionToken(token) {
  if (!token || !token.includes(".")) return false;
  const [expiresStr, sig] = token.split(".");
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;

  try {
    const key = await getKey();
    const encoder = new TextEncoder();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(sig),
      encoder.encode(expiresStr)
    );
    return valid;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE, MAX_AGE_SECONDS };
