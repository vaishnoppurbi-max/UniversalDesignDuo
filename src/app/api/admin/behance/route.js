import { requireAuth } from "@/lib/requireAuth";

const TIMEOUT_MS = 15000;

// Streaming Behance image scraper. Returns remote CDN image URLs (no disk
// download) so they can be imported directly into Portfolio / Gallery like the
// web-scraper Extract flow. Emits NDJSON log lines for a live progress panel.
export async function POST(request) {
  const unauthorized = await requireAuth(request);
  if (unauthorized) return unauthorized;

  const { username: rawInput, apiKey } = await request.json().catch(() => ({}));

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const log = async (msg) =>
    writer.write(encoder.encode(JSON.stringify({ type: "log", msg }) + "\n"));
  const done = async (payload) => {
    await writer.write(encoder.encode(JSON.stringify({ type: "done", ...payload }) + "\n"));
    await writer.close();
  };
  const fail = async (error) => {
    await writer.write(encoder.encode(JSON.stringify({ type: "error", error }) + "\n"));
    await writer.close();
  };

  (async () => {
    try {
      if (!rawInput) {
        await fail("Behance URL or username is required");
        return;
      }

      await log(`Starting Behance extraction for: ${rawInput}`);

      let rawImages = [];
      let label = rawInput;

      if (/behance\.net\/portfolio\/editor/i.test(rawInput)) {
        await log("⚠️  Editor URL detected — this page requires Behance login.");
        await log("Trying to access the public gallery version instead...");
      }

      const projectId = extractProjectId(rawInput);

      if (projectId) {
        label = `project-${projectId}`;
        await log(`Detected project ID: ${projectId}`);
        if (apiKey) {
          await log("Using Behance API (with key)...");
          rawImages = await fetchProjectViaAPI(projectId, apiKey, log);
        } else {
          await log("No API key — trying public gallery page...");
          rawImages = await scrapeProjectPage(projectId, log);
          if (rawImages.length === 0) {
            await log("Gallery page returned nothing — trying embed endpoint...");
            rawImages = await scrapeProjectEmbed(projectId, log);
          }
        }
      } else {
        const galleryMatch = rawInput.match(/behance\.net\/gallery\/(\d+)/i);
        if (galleryMatch) {
          const gid = galleryMatch[1];
          label = `gallery-${gid}`;
          await log(`Detected gallery URL, ID: ${gid}`);
          rawImages = await scrapeProjectPage(gid, log);
        } else {
          const username = rawInput
            .replace(/https?:\/\/(www\.)?behance\.net\//i, "")
            .split("/")[0]
            .trim();
          label = username;
          await log(`Detected profile: @${username}`);
          if (apiKey) {
            await log("Using Behance API (with key)...");
            rawImages = await fetchProfileViaAPI(username, apiKey, log);
          } else {
            await log("No API key — scraping public profile page...");
            rawImages = await scrapePublicProfile(username, log);
          }
        }
      }

      await log(`Found ${rawImages.length} image URL(s)`);

      if (rawImages.length === 0) {
        const isEditorUrl = /behance\.net\/portfolio\/editor/i.test(rawInput);
        if (isEditorUrl) {
          await fail(
            "No images found.\n\n⚠️ You used an EDITOR URL which requires Behance login.\n\n" +
              "Open your Behance project and copy the PUBLIC URL from the browser.\n" +
              "It looks like: https://www.behance.net/gallery/217395233/Your-Project-Title"
          );
        } else {
          await fail(
            `No images found. ${
              projectId
                ? `Project ${projectId} may be private, require login, or Behance blocked the request.`
                : "Try adding a Behance API key or use a direct gallery URL."
            }\n\nTIP: Public gallery URLs work best: behance.net/gallery/ID/title`
          );
        }
        return;
      }

      // Return remote URLs directly (deduped, capped) — no disk download.
      const images = rawImages.slice(0, 80).map((img) => ({
        url: img.url,
        title: img.title || label,
      }));

      await log(`Done! ${images.length} image(s) ready to import`);
      await done({ total: images.length, images, label });
    } catch (err) {
      await fail(err.message || "Failed to fetch Behance images");
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// ── Project ID extraction ─────────────────────────────────────────────────────
function extractProjectId(input) {
  const qsMatch = input.match(/[?&]project_id=(\d+)/i);
  if (qsMatch) return qsMatch[1];
  const galleryMatch = input.match(/\/gallery\/(\d+)/i);
  if (galleryMatch) return galleryMatch[1];
  if (/^\d{6,}$/.test(input.trim())) return input.trim();
  return null;
}

// ── Behance API: single project ───────────────────────────────────────────────
async function fetchProjectViaAPI(projectId, apiKey, log) {
  const images = [];
  await log(`Calling Behance API: /v2/projects/${projectId}`);
  const data = await fetchJSON(
    `https://api.behance.net/v2/projects/${projectId}?api_key=${apiKey}`
  );
  if (!data?.project) {
    await log("API returned no project data");
    return images;
  }
  const project = data.project;
  const title = project.name || `project-${projectId}`;
  await log(`Project: "${title}" — ${(project.modules || []).length} module(s)`);

  const covers = project.covers || {};
  const cover = covers["1400"] || covers["808"] || covers["404"];
  if (cover) images.push({ url: cover, title });

  for (const mod of project.modules || []) {
    if (mod.type === "image" && mod.sizes?.original) images.push({ url: mod.sizes.original, title });
    if (mod.type === "media_collection") {
      for (const comp of mod.components || []) {
        const url = comp.sizes?.original || comp.url;
        if (url) images.push({ url, title });
      }
    }
  }
  await log(`Extracted ${images.length} image URL(s) from API`);
  return dedup(images);
}

// ── Scrape project page ───────────────────────────────────────────────────────
async function scrapeProjectPage(projectId, log) {
  const urls = [
    `https://www.behance.net/gallery/${projectId}/a`,
    `https://www.behance.net/gallery/${projectId}`,
  ];
  for (const pageUrl of urls) {
    await log(`Fetching: ${pageUrl}`);
    const html = await fetchHtml(pageUrl);
    if (!html) {
      await log("  ✗ No response");
      continue;
    }
    await log(`  Page fetched (${Math.round(html.length / 1024)} KB) — parsing...`);
    const images = extractImagesFromHtml(html, `project-${projectId}`);
    if (images.length > 0) {
      await log(`  ✓ Found ${images.length} image(s)`);
      return images;
    }
    await log("  No images found on this URL, trying next...");
  }
  return [];
}

// ── Embed / JSON fallback ─────────────────────────────────────────────────────
async function scrapeProjectEmbed(projectId, log) {
  const endpoints = [
    `https://www.behance.net/gallery/${projectId}/`,
    `https://www.behance.net/v2/projects/${projectId}`,
  ];
  for (const url of endpoints) {
    await log(`Trying endpoint: ${url}`);
    const html = await fetchHtml(url);
    if (!html) continue;
    const found = [];
    let m;
    const cdnRe = /https:\/\/mir-s3-cdn-cf\.behance\.net\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp)/gi;
    while ((m = cdnRe.exec(html)) !== null) {
      found.push({ url: m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"), title: `project-${projectId}` });
    }
    const cdn2Re = /https:\/\/mir-cdn\.behance\.net\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp)/gi;
    while ((m = cdn2Re.exec(html)) !== null) {
      found.push({ url: m[0], title: `project-${projectId}` });
    }
    if (found.length > 0) {
      await log(`  ✓ Found ${found.length} CDN URL(s) via embed`);
      return dedup(found);
    }
  }
  await log("  Embed endpoints returned no images — project may require login");
  return [];
}

// ── Behance API: profile ──────────────────────────────────────────────────────
async function fetchProfileViaAPI(username, apiKey, log) {
  const images = [];
  await log(`Calling Behance API: /v2/users/${username}/projects`);
  const res = await fetchJSON(
    `https://api.behance.net/v2/users/${encodeURIComponent(username)}/projects?api_key=${apiKey}&per_page=24`
  );
  if (!res?.projects?.length) {
    await log("No projects returned by API");
    return images;
  }
  await log(`Found ${res.projects.length} project(s)`);
  for (const project of res.projects) {
    const title = project.name || `project-${project.id}`;
    const covers = project.covers || {};
    const cover = covers["1400"] || covers["808"] || covers["404"] || covers["202"];
    if (cover) images.push({ url: cover, title });
    if (images.length < 40) {
      const detail = await fetchJSON(
        `https://api.behance.net/v2/projects/${project.id}?api_key=${apiKey}`
      );
      for (const mod of detail?.project?.modules || []) {
        if (mod.type === "image" && mod.sizes?.original) images.push({ url: mod.sizes.original, title });
        if (mod.type === "media_collection") {
          for (const comp of mod.components || []) {
            if (comp.sizes?.original) images.push({ url: comp.sizes.original, title });
          }
        }
      }
    }
  }
  return dedup(images);
}

// ── Scrape public profile ─────────────────────────────────────────────────────
async function scrapePublicProfile(username, log) {
  const pageUrl = `https://www.behance.net/${username}`;
  await log(`Fetching: ${pageUrl}`);
  const html = await fetchHtml(pageUrl);
  if (!html) {
    await log("Failed to fetch profile page");
    return [];
  }
  await log(`Page fetched (${Math.round(html.length / 1024)} KB) — parsing images...`);
  const images = extractImagesFromHtml(html, "behance-project");
  await log(`Found ${images.length} image(s) in page HTML`);
  return images;
}

// ── HTML image extractor ──────────────────────────────────────────────────────
function extractImagesFromHtml(html, defaultTitle) {
  const images = [];
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let sm;
  while ((sm = scriptRe.exec(html)) !== null) {
    const block = sm[1];
    if (!block.includes("mir-s3") && !block.includes("mir-cdn") && !block.includes("behance")) continue;
    const urlRe = /https:\/\/(?:mir-s3-cdn-cf|mir-cdn|mir\.s3)\.behance\.net[^"'\s\\)>]+\.(?:jpg|jpeg|png|webp)/gi;
    let m;
    while ((m = urlRe.exec(block)) !== null) {
      images.push({ url: m[0].split("\\u")[0].split("\\")[0], title: defaultTitle });
    }
    const cdn2Re = /https:\/\/[^"'\s]+behance[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi;
    while ((m = cdn2Re.exec(block)) !== null) {
      const clean = m[0].split("\\u")[0].split("\\")[0];
      if (!clean.includes("avatar") && !clean.includes("/profile/")) images.push({ url: clean, title: defaultTitle });
    }
  }
  const ogRe = /<meta[^>]+(?:property=["']og:image["']|name=["']twitter:image["'])[^>]+content=["']([^"']+)["']/gi;
  let m;
  while ((m = ogRe.exec(html)) !== null) images.push({ url: m[1].split("?")[0], title: defaultTitle });
  const dataSrcRe = /data-src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = dataSrcRe.exec(html)) !== null) images.push({ url: m[1].split("?")[0], title: defaultTitle });
  const imgRe = /<img[^>]+src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
  while ((m = imgRe.exec(html)) !== null) {
    if (!m[1].includes("avatar") && !m[1].includes("/profile/")) images.push({ url: m[1].split("?")[0], title: defaultTitle });
  }
  return dedup(images);
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function dedup(images) {
  const seen = new Set();
  return images.filter((img) => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  });
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
    });
    clearTimeout(timer);
    return res.ok ? res.text() : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function fetchJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; UniversalDesignDuo/1.0)" },
    });
    clearTimeout(timer);
    return res.ok ? res.json() : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}
