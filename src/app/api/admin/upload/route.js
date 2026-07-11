import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { requireAuth } from "@/lib/requireAuth";
import { getSupabase, isSupabaseConfigured, UPLOAD_BUCKET } from "@/lib/supabase";

const ALLOWED_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(request) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  // Production (Vercel): store in Supabase Storage — the filesystem is read-only.
  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .upload(filename, bytes, { contentType: file.type, upsert: false });

    if (error) {
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  }

  // Local dev: write to public/uploads.
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), bytes);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
