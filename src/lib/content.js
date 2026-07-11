import fs from "node:fs/promises";
import path from "node:path";
import {
  getSupabase,
  isSupabaseConfigured,
  CONTENT_TABLE,
  CONTENT_ROW_ID,
} from "./supabase";

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

// The bundled JSON is the seed / default content. It is used directly when
// Supabase is not configured (local dev), and to seed the DB on first read.
async function readSeed() {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function getContent() {
  if (!isSupabaseConfigured) {
    return readSeed();
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select("data")
    .eq("id", CONTENT_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("Supabase getContent error:", error.message);
    return readSeed();
  }

  // No row yet — seed the DB from the bundled JSON so the admin has something
  // to edit, then return it.
  if (!data) {
    const seed = await readSeed();
    await supabase
      .from(CONTENT_TABLE)
      .upsert({ id: CONTENT_ROW_ID, data: seed });
    return seed;
  }

  return data.data;
}

export async function saveContent(content) {
  if (!isSupabaseConfigured) {
    await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .upsert({ id: CONTENT_ROW_ID, data: content, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`Failed to save content: ${error.message}`);
  }
}
