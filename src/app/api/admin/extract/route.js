import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

// Pulls image URLs out of a public web page so they can be reviewed and
// imported into the media library. Server-side so it is not blocked by CORS.
export async function POST(request) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  let target;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "That is not a valid URL" }, { status: 400 });
  }
  if (!/^https?:$/.test(target.protocol)) {
    return NextResponse.json(
      { error: "Only http and https URLs are supported" },
      { status: 400 }
    );
  }

  let html;
  try {
    const res = await fetch(target.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `The page returned ${res.status}` },
        { status: 502 }
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Could not reach that page" }, { status: 502 });
  }

  const found = new Set();
  const push = (raw) => {
    if (!raw) return;
    const cleaned = raw.trim().replace(/&amp;/g, "&");
    if (!cleaned || cleaned.startsWith("data:")) return;
    try {
      const abs = new URL(cleaned, target.href).href;
      if (/\.(png|jpe?g|webp|gif|avif)(\?|#|$)/i.test(abs)) found.add(abs);
    } catch {
      /* skip unparseable */
    }
  };

  // <img src>, lazy-load attributes, srcset candidates and og:image tags.
  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    push(tag.match(/\ssrc=["']([^"']+)["']/i)?.[1]);
    push(tag.match(/\sdata-src=["']([^"']+)["']/i)?.[1]);
    push(tag.match(/\sdata-lazy-src=["']([^"']+)["']/i)?.[1]);
    const srcset = tag.match(/\ssrcset=["']([^"']+)["']/i)?.[1];
    if (srcset) srcset.split(",").forEach((p) => push(p.trim().split(/\s+/)[0]));
  }
  for (const m of html.matchAll(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi
  )) {
    push(m[1]);
  }

  return NextResponse.json({ images: [...found].slice(0, 200) });
}
