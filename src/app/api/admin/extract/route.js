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
  const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i;

  const push = (raw) => {
    if (!raw) return;
    const cleaned = raw.trim().replace(/&amp;/g, "&");
    if (!cleaned || cleaned.startsWith("data:")) return;
    try {
      const abs = new URL(cleaned, target.href).href;
      if (IMAGE_EXT.test(abs)) found.add(abs);
    } catch {
      /* skip unparseable */
    }
  };

  // 1. <img src>, lazy-load variants, srcset candidates
  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    push(tag.match(/\ssrc=["']([^"']+)["']/i)?.[1]);
    push(tag.match(/\sdata-src=["']([^"']+)["']/i)?.[1]);
    push(tag.match(/\sdata-lazy-src=["']([^"']+)["']/i)?.[1]);
    push(tag.match(/\sdata-original=["']([^"']+)["']/i)?.[1]);
    push(tag.match(/\sdata-lazy=["']([^"']+)["']/i)?.[1]);
    const srcset = tag.match(/\ssrcset=["']([^"']+)["']/i)?.[1];
    if (srcset) srcset.split(",").forEach((p) => push(p.trim().split(/\s+/)[0]));
  }

  // 2. og:image, twitter:image meta tags
  for (const m of html.matchAll(/<meta[^>]+>/gi)) {
    const tag = m[0];
    const prop = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1] || "";
    if (/og:image|twitter:image/i.test(prop)) {
      push(tag.match(/content=["']([^"']+)["']/i)?.[1]);
    }
  }

  // 3. CSS background-image: url(...)
  for (const m of html.matchAll(/background(?:-image)?\s*:\s*url\(['"]?([^'")]+)['"]?\)/gi)) {
    push(m[1]);
  }

  // 4. <source srcset> inside <picture> elements
  for (const m of html.matchAll(/<source[^>]+>/gi)) {
    const tag = m[0];
    const srcset = tag.match(/\ssrcset=["']([^"']+)["']/i)?.[1];
    if (srcset) srcset.split(",").forEach((p) => push(p.trim().split(/\s+/)[0]));
    push(tag.match(/\ssrc=["']([^"']+)["']/i)?.[1]);
  }

  // 5. JSON-LD / next/image blurDataURL and _next/image src
  for (const m of html.matchAll(/["'](https?:\/\/[^"'\s]+\.(?:png|jpe?g|webp|gif|avif))["']/gi)) {
    push(m[1]);
  }

  // 6. <link rel="image_src"> and apple-touch-icon
  for (const m of html.matchAll(/<link[^>]+>/gi)) {
    const tag = m[0];
    const rel = tag.match(/\srel=["']([^"']+)["']/i)?.[1] || "";
    if (/image_src|apple-touch-icon|og:image/i.test(rel)) {
      push(tag.match(/\shref=["']([^"']+)["']/i)?.[1]);
    }
  }

  const images = [...found].slice(0, 300);
  return NextResponse.json({ images, total: images.length });
}
