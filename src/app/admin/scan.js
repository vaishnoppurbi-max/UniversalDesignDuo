// Client-side image analysis helpers for the admin media tools:
// social-shape detection, fast duplicate grouping, and perceptual hashing.

export const SOCIAL_MIN_RATIO = 0.5; // 9:16 story = 0.5625, allow slack
export const SOCIAL_MAX_RATIO = 1.05; // square, slack for 1000x1000-ish crops

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${url}`));
    img.src = url;
  });
}

export async function loadDims(url) {
  const img = await loadImage(url);
  return { w: img.naturalWidth, h: img.naturalHeight };
}

export function isSocialShape({ w, h }) {
  if (!w || !h) return false;
  const ratio = w / h;
  return ratio >= SOCIAL_MIN_RATIO && ratio <= SOCIAL_MAX_RATIO;
}

export function shapeLabel({ w, h }) {
  const ratio = w / h;
  if (ratio > 0.95 && ratio <= 1.05) return "Square (1:1)";
  if (ratio > 0.7) return "Portrait (4:5)";
  return "Story (9:16)";
}

/** Filename portion of a URL, ignoring query strings. */
export function fileNameOf(url) {
  try {
    const path = url.split("?")[0].split("#")[0];
    return path.substring(path.lastIndexOf("/") + 1).toLowerCase();
  } catch {
    return url;
  }
}

/**
 * Quick Scan — groups by exact URL, then by filename. No network needed,
 * so this is instant even on large libraries.
 */
export function quickDuplicateGroups(items) {
  const byKey = new Map();
  items.forEach((item, index) => {
    if (!item.image) return;
    const key = fileNameOf(item.image) || item.image;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(index);
  });
  return [...byKey.values()].filter((g) => g.length > 1);
}

/**
 * Average hash: downscale to 8x8 greyscale, then one bit per pixel for
 * "brighter than the mean". Visually identical images hash identically even
 * at different resolutions or compression levels.
 */
export async function averageHash(url) {
  const img = await loadImage(url);
  const size = 8;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);

  // Reading pixels from a cross-origin image without CORS headers throws.
  const { data } = ctx.getImageData(0, 0, size, size);
  const grey = [];
  for (let i = 0; i < data.length; i += 4) {
    grey.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  const mean = grey.reduce((a, b) => a + b, 0) / grey.length;
  return grey.map((v) => (v > mean ? 1 : 0)).join("");
}

export function hammingDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

/**
 * Smart Scan — hashes every image, then clusters ones within `threshold`
 * bits of each other. Returns { groups, failed }.
 */
export async function visualDuplicateGroups(items, onProgress, threshold = 5) {
  const hashes = [];
  const failed = [];

  for (let i = 0; i < items.length; i++) {
    onProgress?.(i + 1, items.length);
    if (!items[i].image) continue;
    try {
      hashes.push({ index: i, hash: await averageHash(items[i].image) });
    } catch {
      failed.push(i);
    }
  }

  const groups = [];
  const claimed = new Set();
  for (let a = 0; a < hashes.length; a++) {
    if (claimed.has(hashes[a].index)) continue;
    const group = [hashes[a].index];
    for (let b = a + 1; b < hashes.length; b++) {
      if (claimed.has(hashes[b].index)) continue;
      if (hammingDistance(hashes[a].hash, hashes[b].hash) <= threshold) {
        group.push(hashes[b].index);
        claimed.add(hashes[b].index);
      }
    }
    if (group.length > 1) {
      claimed.add(hashes[a].index);
      groups.push(group);
    }
  }

  return { groups, failed };
}

/** Everything except the first index of each group — the ones safe to drop. */
export function extrasOf(groups) {
  return groups.flatMap((g) => g.slice(1));
}
