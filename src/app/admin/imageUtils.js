// Client-side image compression to WebP, mirroring the CreativeMind admin
// approach (Canvas API, capped dimensions, quality ~0.7). Keeps uploads small
// and fast without any server-side processing.

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;
const QUALITY = 0.72;

export async function compressImage(file) {
  // GIFs (possibly animated) and SVGs are passed through untouched.
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY)
  );

  // If compression didn't help (or failed), fall back to the original file.
  if (!blob || blob.size >= file.size) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
