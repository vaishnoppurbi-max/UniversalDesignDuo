import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase is only used server-side (API routes + server components), so we use
// the service-role key. It is never exposed to the browser (no NEXT_PUBLIC_).
export const isSupabaseConfigured = Boolean(url && serviceKey);

export const CONTENT_TABLE = "site_content";
export const CONTENT_ROW_ID = 1;
export const UPLOAD_BUCKET = "uploads";

let client = null;

export function getSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
