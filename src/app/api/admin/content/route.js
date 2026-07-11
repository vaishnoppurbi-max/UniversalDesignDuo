import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(request) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const content = await request.json();
  await saveContent(content);
  return NextResponse.json({ ok: true });
}
