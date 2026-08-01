"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "./imageUtils";
import {
  loadDims,
  isSocialShape,
  shapeLabel,
  quickDuplicateGroups,
  visualDuplicateGroups,
  extrasOf,
} from "./scan";
import "./admin.css";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function uploadFile(file) {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append("file", compressed);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }
  const data = await res.json();
  return data.url;
}

const UPLOAD_CATEGORIES = [
  "General",
  "Website Design",
  "Web Design",
  "UI/UX",
  "Branding",
  "Mobile App",
  "Logo",
  "Social Media",
  "Photography",
  "Graphic Design",
  "Product Design",
  "Packaging",
];

// Free WordPress mshots snapshot — captures a live site's home page.
function shotUrl(url, w = 1200) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}`;
}

function ytThumb(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : "";
}

function UploadPortfolioPanel({ onAdd }) {
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [videoUrl, setVideoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [images, setImages] = useState([]); // [{file, preview}]
  const [videos, setVideos] = useState([]); // {file}
  const [dragImg, setDragImg] = useState(false);
  const [dragVid, setDragVid] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, msg: "" });
  const [results, setResults] = useState([]);

  // YouTube upload is not wired up in this project — keep the same UI shape
  // as the reference design; the button is a hint only.
  const ytConnected = false;

  function addImages(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [
      ...prev,
      ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
    ]);
    setResults([]);
  }

  function addVideos(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("video/"));
    setVideos((prev) => [...prev, ...files.map((f) => ({ file: f }))]);
    setResults([]);
  }

  function removeImage(i) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function removeVideo(i) {
    setVideos((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleUploadImages() {
    if (images.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: images.length, msg: "" });
    const next = [];
    for (let i = 0; i < images.length; i++) {
      const { file } = images[i];
      setProgress({ done: i, total: images.length, msg: `Uploading image ${i + 1}/${images.length}...` });
      try {
        const url = await uploadFile(file);
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
        onAdd({
          title: title.trim() || baseName,
          description: "",
          image: url,
          category,
          videoUrl: videoUrl.trim() || "",
          websiteUrl: websiteUrl.trim() || "",
        });
        next.push({ type: "image", name: file.name, status: "ok" });
      } catch (err) {
        next.push({ type: "image", name: file.name, status: "err", message: err.message });
      }
      setProgress((p) => ({ ...p, done: i + 1 }));
    }
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setResults(next);
    setUploading(false);
  }

  async function handleUploadVideos() {
    // No YouTube backend — support the Video URL flow only (thumbnail-only entry).
    const url = videoUrl.trim();
    if (!url) {
      alert("Enter a YouTube / Vimeo URL in the Video URL field. Direct video file uploads are not configured on this site.");
      return;
    }
    setUploading(true);
    setProgress({ done: 0, total: 1, msg: "Saving video entry..." });
    const thumb = ytThumb(url);
    try {
      onAdd({
        title: title.trim() || "Video",
        description: "",
        image: thumb,
        category,
        videoUrl: url,
        websiteUrl: "",
      });
      setResults([{ type: "video", name: url, status: "ok", videoUrl: url }]);
      setVideoUrl("");
      setVideos([]);
    } catch (err) {
      setResults([{ type: "video", name: url, status: "err", message: err.message }]);
    }
    setProgress({ done: 1, total: 1, msg: "" });
    setUploading(false);
  }

  function handleAddWebsite() {
    const url = websiteUrl.trim();
    if (!url) return;
    let host = url;
    try {
      host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace(/^www\./, "");
    } catch { /* keep raw */ }
    onAdd({
      title: title.trim() || host,
      description: "",
      image: shotUrl(url),
      category: "Website Design",
      websiteUrl: url,
      videoUrl: "",
    });
    setResults([{ type: "website", name: host, status: "ok", websiteUrl: url }]);
    setWebsiteUrl("");
  }

  const canImages  = images.length > 0 && !uploading;
  const canVideos  = (videos.length > 0 || videoUrl.trim().length > 0) && !uploading;
  const canWebsite = websiteUrl.trim().length > 0 && !uploading;
  const okCount    = results.filter((r) => r.status === "ok").length;
  const errCount   = results.filter((r) => r.status === "err").length;

  return (
    <div className="upload-panel">
      <div className="panel-head">
        <h2>Upload Portfolio</h2>
        <p>Images auto-compressed to WebP · Videos stored directly</p>
      </div>

      <div className="up-fields">
        <div className="up-field">
          <label>Title <span className="opt">(optional)</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Leave blank to use filename"
          />
        </div>
        <div className="up-field">
          <label>📂 Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {UPLOAD_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="up-field">
          <label>🎬 Video URL <span className="opt">(YouTube / Vimeo link)</span></label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={videoUrl ? "violet-text" : ""}
          />
        </div>
      </div>

      <div className="up-website-row">
        <div className="up-field">
          <label>🌐 Website URL <span className="opt">(live site — its home page is captured automatically)</span></label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
            className={websiteUrl ? "green-text" : ""}
          />
        </div>
        <button
          className="up-website-btn"
          onClick={handleAddWebsite}
          disabled={!canWebsite}
        >
          🌐 Add Website
        </button>
      </div>

      {websiteUrl.trim() && (
        <div className="up-site-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shotUrl(websiteUrl.trim())} alt="Home page preview" />
          <span>
            Home page preview — saved to the <strong>Website Design</strong> category and opens in a new tab on the site.
          </span>
        </div>
      )}

      <div className="up-divider" />

      <div className="up-zones">
        {/* Images */}
        <div className="up-zone-col">
          <div
            className={`up-drop${dragImg ? " dragging" : ""}`}
            onClick={() => imgInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragImg(true); }}
            onDragLeave={() => setDragImg(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragImg(false);
              addImages(e.dataTransfer.files);
            }}
          >
            <div className="icon">🖼️</div>
            <p className="title">Drop Images Here</p>
            <p className="sub">JPG · PNG · WebP</p>
            <input
              ref={imgInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => { addImages(e.target.files); e.target.value = ""; }}
              hidden
            />
          </div>
          {images.length > 0 && (
            <div className="up-preview-grid">
              {images.map((img, i) => (
                <div key={i} className="up-preview-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" />
                  <button className="x" onClick={() => removeImage(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
          {images.length > 0 && (
            <p className="up-count">🖼️ {images.length} image{images.length !== 1 ? "s" : ""} selected</p>
          )}
        </div>

        {/* Videos */}
        <div className="up-zone-col">
          <div className="yt-row">
            {ytConnected ? (
              <span className="yt-ok">✅ YouTube Connected</span>
            ) : (
              <>
                <span className="yt-warn">⚠️ YouTube not connected</span>
                <button
                  className="yt-btn"
                  onClick={() =>
                    alert("Direct video uploads are not configured on this site.\n\nUse the Video URL field to add a YouTube / Vimeo link instead.")
                  }
                >
                  🔗 Connect YouTube
                </button>
              </>
            )}
          </div>
          <div
            className={`up-drop${dragVid ? " dragging" : ""}${ytConnected ? "" : " disabled"}`}
            onClick={() => {
              if (!ytConnected) {
                alert("Direct video uploads are not configured on this site.\n\nUse the Video URL field to add a YouTube / Vimeo link instead.");
                return;
              }
              videoInputRef.current?.click();
            }}
            onDragOver={(e) => { e.preventDefault(); setDragVid(true); }}
            onDragLeave={() => setDragVid(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragVid(false);
              if (ytConnected) addVideos(e.dataTransfer.files);
            }}
          >
            <div className="icon">🎬</div>
            <p className="title">Drop Videos Here</p>
            <p className="sub">MP4 · MOV · WEBM</p>
            <input
              ref={videoInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => { addVideos(e.target.files); e.target.value = ""; }}
              hidden
            />
          </div>
          {videos.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {videos.map((v, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "var(--panel-2)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: "8px 12px",
                  }}
                >
                  <span style={{ fontSize: 18 }}>🎬</span>
                  <span style={{ flex: 1, color: "#a8b8f5", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {v.file.name}
                  </span>
                  <span style={{ color: "#5c68a0", fontSize: 12 }}>{(v.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button className="x" onClick={() => removeVideo(i)} style={{ position: "static" }}>✕</button>
                </div>
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <p className="up-count" style={{ color: "#c4b5fd" }}>
              🎬 {videos.length} video{videos.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>

      <div className="up-actions">
        <button className="up-btn images" onClick={handleUploadImages} disabled={!canImages}>
          {uploading && progress.msg?.includes("image")
            ? `⏳ ${progress.done}/${progress.total}`
            : `🖼️ Upload Images${images.length > 0 ? ` (${images.length})` : ""}`}
        </button>
        <button className="up-btn videos" onClick={handleUploadVideos} disabled={!canVideos}>
          {uploading && progress.msg?.includes("video")
            ? `⏳ ${progress.done}/${progress.total}`
            : `🎬 Upload Videos${videos.length > 0 ? ` (${videos.length})` : ""}`}
        </button>
      </div>

      {uploading && (
        <div className="up-progress">
          <div className="bar">
            <div className="fill" style={{ width: `${(progress.done / (progress.total || 1)) * 100}%` }} />
          </div>
          <p className="msg">{progress.msg}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="up-results">
          {okCount > 0 && <p className="ok">✅ {okCount} added successfully</p>}
          {errCount > 0 && <p className="err">❌ {errCount} failed</p>}
          {results.map((r, i) =>
            r.status === "ok" ? (
              <p key={i}>
                {r.type === "image" ? "🖼️" : r.type === "video" ? "🎬" : "🌐"} {r.name}
                {" · "}
                <span style={{ color: "#a8b8f5" }}>{r.type === "website" ? "Website Design" : category}</span>
              </p>
            ) : (
              <p key={i} style={{ color: "#f87171" }}>
                ✗ {r.name}: {r.message}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: "Main Menu",
    tabs: [
      { key: "hero", label: "Hero", icon: "▦" },
      { key: "projects", label: "Portfolio", icon: "🖼" },
      { key: "gallery", label: "Gallery", icon: "📷" },
    ],
  },
  {
    label: "Management",
    tabs: [
      { key: "services", label: "Services", icon: "✦" },
      { key: "testimonials", label: "Testimonials", icon: "❝" },
      { key: "blog", label: "Blog Posts", icon: "✎" },
    ],
  },
  {
    label: "System",
    tabs: [{ key: "contact", label: "Contact Info", icon: "✉" }],
  },
];

function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [info, setInfo] = useState(null);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setInfo(null);
    try {
      const before = file.size;
      const url = await uploadFile(file);
      onChange(url);
      setInfo(`Uploaded (${formatBytes(before)})`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="image-field">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="image-preview" src={value} alt="" />
        ) : (
          <div className="image-preview" />
        )}
        <div className="image-controls">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload below"
          />
          <div className="upload-row">
            <label className="upload-btn">
              {uploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                hidden
              />
            </label>
            {info && <span className="upload-info">{info}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bulk image library — grid of tiles with multi-file upload, drag & drop,
 * search, select-all and bulk delete. Used for Portfolio and Gallery.
 */
function MediaGrid({
  items,
  fields,
  blank,
  onAdd,
  onUpdate,
  onRemoveMany,
  categoryKey,
}) {
  const inputRef = useRef(null);
  const [selected, setSelected] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState(null); // label of the running tool
  const [review, setReview] = useState(null); // { kind, groups } | { kind, hits }
  const [extract, setExtract] = useState(null); // { url, images, picked }

  const searchable = (item) =>
    fields
      .map((f) => item[f.key] || "")
      .join(" ")
      .toLowerCase();

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !query || searchable(item).includes(query.toLowerCase()));

  function toggle(index) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const allVisibleSelected =
    visible.length > 0 && visible.every(({ index }) => selected.has(index));

  function toggleAll() {
    setSelected(allVisibleSelected ? new Set() : new Set(visible.map((v) => v.index)));
  }

  function deleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Remove ${selected.size} item${selected.size > 1 ? "s" : ""}?`)) return;
    onRemoveMany([...selected]);
    setSelected(new Set());
  }

  async function handleFiles(fileList) {
    const files = [...fileList].filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    const failures = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1} of ${files.length}...`);
      try {
        const url = await uploadFile(files[i]);
        onAdd({ ...blank, image: url });
      } catch {
        failures.push(files[i].name);
      }
    }
    setProgress(null);
    if (failures.length) alert(`Failed to upload: ${failures.join(", ")}`);
  }

  // ── Auto-detect Social: classify by image shape, review before applying ──
  async function handleAutoSocial() {
    if (!categoryKey) return;
    setBusy("social");
    const hits = [];
    for (let i = 0; i < items.length; i++) {
      setProgress(`Measuring ${i + 1} of ${items.length}...`);
      if (!items[i].image) continue;
      try {
        const dims = await loadDims(items[i].image);
        if (isSocialShape(dims) && items[i][categoryKey] !== "Social Media") {
          hits.push({ index: i, shape: shapeLabel(dims), dims });
        }
      } catch {
        /* unreadable image — skip */
      }
    }
    setProgress(null);
    setBusy(null);
    if (hits.length === 0) return alert("No new social-shaped images found.");
    setReview({ kind: "social", hits });
  }

  function applySocial() {
    review.hits.forEach((h) => onUpdate(h.index, categoryKey, "Social Media"));
    setReview(null);
  }

  // ── Quick Scan: filename/URL duplicates, instant ──
  function handleQuickScan() {
    const groups = quickDuplicateGroups(items);
    if (groups.length === 0) return alert("No duplicate filenames found.");
    setReview({ kind: "dupes", label: "Quick Scan", groups });
  }

  // ── Smart Scan: perceptual hash, catches re-encoded/resized copies ──
  async function handleSmartScan(autoDelete = false) {
    setBusy("smart");
    const { groups, failed } = await visualDuplicateGroups(items, (done, total) =>
      setProgress(`Analysing ${done} of ${total}...`)
    );
    setProgress(null);
    setBusy(null);

    const note = failed.length
      ? `\n\n${failed.length} image(s) could not be analysed (blocked by CORS).`
      : "";

    if (groups.length === 0) return alert(`No visual duplicates found.${note}`);

    if (autoDelete) {
      const extras = extrasOf(groups);
      if (
        confirm(
          `Found ${groups.length} duplicate group(s). Delete ${extras.length} extra image(s), keeping the first of each?${note}`
        )
      ) {
        onRemoveMany(extras);
        setSelected(new Set());
      }
      return;
    }
    setReview({ kind: "dupes", label: "Smart Scan", groups, note });
  }

  function deleteDuplicates() {
    const extras = extrasOf(review.groups);
    onRemoveMany(extras);
    setSelected(new Set());
    setReview(null);
  }

  // ── Extract Images: scrape a public page, pick which to import ──
  async function runExtract(url) {
    setBusy("extract");
    try {
      const res = await fetch("/api/admin/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");
      if (!data.images.length) {
        alert("No images found on that page.");
        return;
      }
      setExtract({ url, images: data.images, picked: new Set(data.images) });
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  }

  function importExtracted() {
    [...extract.picked].forEach((url) => onAdd({ ...blank, image: url }));
    setExtract(null);
  }

  const anyBusy = busy !== null;

  return (
    <>
      <div className="tool-bar">
        {categoryKey && (
          <button
            className="tool tool-green"
            onClick={handleAutoSocial}
            disabled={anyBusy}
            title="Detect square / portrait / story graphics and tag them as Social Media"
          >
            {busy === "social" ? `📱 ${progress || "Scanning…"}` : "📱 Auto-detect Social"}
          </button>
        )}
        <button
          className="tool tool-amber"
          onClick={handleQuickScan}
          disabled={anyBusy}
          title="Fast duplicate scan by filename"
        >
          ⚡ Quick Scan
        </button>
        <button
          className="tool tool-violet"
          onClick={() => handleSmartScan(false)}
          disabled={anyBusy}
          title="Visual scan — preview duplicates before deleting"
        >
          {busy === "smart" ? `🧠 ${progress || "Working…"}` : "🧠 Smart Scan"}
        </button>
        <button
          className="tool tool-red"
          onClick={() => handleSmartScan(true)}
          disabled={anyBusy}
          title="Scan and delete all duplicates in one click"
        >
          🤖 Auto Delete Duplicates
        </button>
        <button
          className="tool"
          onClick={() => {
            const url = prompt("Page URL to extract images from:");
            if (url) runExtract(url);
          }}
          disabled={anyBusy}
          title="Pull images off a public web page"
        >
          {busy === "extract" ? "🔍 Fetching…" : "🔍 Extract Images"}
        </button>
        <button
          className="tool tool-upload"
          onClick={() => inputRef.current?.click()}
          disabled={anyBusy}
        >
          + Upload
        </button>
      </div>

      <div className="media-toolbar">
        <label className="select-all">
          <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} />
          Select all ({visible.length})
        </label>
        {selected.size > 0 && (
          <button className="btn btn-danger" onClick={deleteSelected}>
            Delete selected ({selected.size})
          </button>
        )}
        {progress && !anyBusy && <span className="upload-info">{progress}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="media-grid">
        <div
          className={`dropzone${dragging ? " dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <span className="big">＋</span>
          Drop images here
          <small>or click to browse — multiple files supported</small>
        </div>

        {visible.map(({ item, index }) => (
          <div
            className={`media-tile${selected.has(index) ? " selected" : ""}`}
            key={index}
          >
            <input
              className="tick"
              type="checkbox"
              checked={selected.has(index)}
              onChange={() => toggle(index)}
            />
            <button
              className="tile-del"
              title="Remove"
              onClick={() => onRemoveMany([index])}
            >
              ✕
            </button>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="thumb" src={item.image} alt={item.title || ""} />
            ) : (
              <div className="thumb empty">No image</div>
            )}
            <div className="tile-body">
              {fields.map((f) =>
                f.type === "textarea" ? (
                  <textarea
                    key={f.key}
                    value={item[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => onUpdate(index, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    key={f.key}
                    type="text"
                    value={item[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => onUpdate(index, f.key, e.target.value)}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="empty-note">Nothing here yet — upload your first images above.</p>
      )}

      {/* Auto-detect Social — review before applying */}
      {review?.kind === "social" && (
        <div className="modal-bg" onClick={() => setReview(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Auto-detected Social Media posts</h3>
            <p className="modal-sub">
              {review.hits.length} image(s) look like social creatives. Applying
              will set their category to <strong>Social Media</strong>.
            </p>
            <div className="review-grid">
              {review.hits.map((h) => (
                <div className="review-tile" key={h.index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={items[h.index].image} alt="" />
                  <span className="review-tag">{h.shape}</span>
                  <span className="review-dim">
                    {h.dims.w}×{h.dims.h}
                  </span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setReview(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={applySocial}>
                Tag {review.hits.length} as Social Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick / Smart Scan — duplicate groups */}
      {review?.kind === "dupes" && (
        <div className="modal-bg" onClick={() => setReview(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{review.label}: {review.groups.length} duplicate group(s)</h3>
            <p className="modal-sub">
              The first image in each row is kept; the rest are removed.
              {review.note}
            </p>
            <div className="dupe-list">
              {review.groups.map((group, gi) => (
                <div className="dupe-row" key={gi}>
                  {group.map((idx, k) => (
                    <div className={`review-tile${k === 0 ? " keep" : ""}`} key={idx}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={items[idx].image} alt="" />
                      <span className="review-tag">{k === 0 ? "Keep" : "Remove"}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setReview(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={deleteDuplicates}>
                Delete {extrasOf(review.groups).length} duplicate(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extract Images — pick which scraped images to import */}
      {extract && (
        <div className="modal-bg" onClick={() => setExtract(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Found {extract.images.length} image(s)</h3>
            <p className="modal-sub">{extract.url}</p>
            <div className="review-grid">
              {extract.images.map((url) => (
                <label
                  className={`review-tile pick${
                    extract.picked.has(url) ? " on" : ""
                  }`}
                  key={url}
                >
                  <input
                    type="checkbox"
                    checked={extract.picked.has(url)}
                    onChange={() =>
                      setExtract((e) => {
                        const picked = new Set(e.picked);
                        if (picked.has(url)) picked.delete(url);
                        else picked.add(url);
                        return { ...e, picked };
                      })
                    }
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setExtract(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={importExtracted}
                disabled={extract.picked.size === 0}
              >
                Import {extract.picked.size} image(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load content");
        return res.json();
      })
      .then(setContent)
      .catch(() => setStatus({ type: "error", text: "Failed to load content" }));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setStatus(
      res.ok ? { type: "ok", text: "Saved" } : { type: "error", text: "Failed to save" }
    );
  }

  function updateHero(field, value) {
    setContent((c) => ({ ...c, hero: { ...c.hero, [field]: value } }));
  }

  function updateContact(field, value) {
    setContent((c) => ({ ...c, contact: { ...c.contact, [field]: value } }));
  }

  function updateListItem(listKey, index, field, value) {
    setContent((c) => {
      const list = [...(c[listKey] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...c, [listKey]: list };
    });
  }

  function addListItem(listKey, blank) {
    setContent((c) => ({ ...c, [listKey]: [...(c[listKey] || []), blank] }));
  }

  function removeListItem(listKey, index) {
    setContent((c) => ({
      ...c,
      [listKey]: (c[listKey] || []).filter((_, i) => i !== index),
    }));
  }

  function removeListItems(listKey, indexes) {
    const drop = new Set(indexes);
    setContent((c) => ({
      ...c,
      [listKey]: (c[listKey] || []).filter((_, i) => !drop.has(i)),
    }));
  }

  if (!content) {
    return (
      <div className="admin">
        <div style={{ padding: 40 }}>Loading dashboard...</div>
      </div>
    );
  }

  const counts = {
    projects: (content.projects || []).length,
    gallery: (content.gallery || []).length,
    services: (content.services || []).length,
    testimonials: (content.testimonials || []).length,
    blog: (content.blog || []).length,
  };

  const HEADINGS = {
    hero: ["Hero", "The main banner shown at the top of the homepage."],
    projects: ["Portfolio", `${counts.projects} images total`],
    gallery: ["Gallery", `${counts.gallery} images total`],
    services: ["Services", "The service cards shown on the homepage."],
    testimonials: ["Testimonials", "Client quotes shown on the homepage."],
    blog: ["Blog Posts", "Posts shown on the homepage and the Blog page."],
    contact: ["Contact Info", "Shown in the mobile menu and used across the site."],
  };

  const [heading, subtitle] = HEADINGS[activeTab];

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <span className="logo-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo/logo-dark.png" alt="" />
            </span>
            <span>
              <span className="name">Universal Design Duo</span>
              <span className="role">Admin Panel</span>
            </span>
          </div>

          <div className="sidebar-user">
            <span className="avatar">UD</span>
            <span className="who">
              <strong>Administrator</strong>
              <span>Signed in</span>
            </span>
          </div>

          <nav className="admin-nav">
            {NAV_GROUPS.map((group) => (
              <div className="nav-group" key={group.label}>
                <div className="group-label">{group.label}</div>
                {group.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={activeTab === tab.key ? "active" : ""}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <span className="ico">{tab.icon}</span>
                    {tab.label}
                    {counts[tab.key] > 0 && (
                      <span className="nav-pill">{counts[tab.key]}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="sidebar-foot">
            <a href="/" target="_blank" rel="noreferrer">
              🌐 View Website
            </a>
            <button className="logout" onClick={handleLogout}>
              ⏻ Logout
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="page-head">
            <div>
              <h1>{heading}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
            <div className="head-actions">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              {status && (
                <span className={`save-status ${status.type === "error" ? "error" : ""}`}>
                  {status.text}
                </span>
              )}
            </div>
          </div>

          {activeTab === "hero" && (
            <div className="card">
              <h2>Headline</h2>
              <div className="field">
                <label>Title line 1</label>
                <input
                  type="text"
                  value={content.hero.titleLine1}
                  onChange={(e) => updateHero("titleLine1", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Title line 2</label>
                <input
                  type="text"
                  value={content.hero.titleLine2}
                  onChange={(e) => updateHero("titleLine2", e.target.value)}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Highlighted word (orange)</label>
                  <input
                    type="text"
                    value={content.hero.titleHighlight}
                    onChange={(e) => updateHero("titleHighlight", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Highlighted word 2 (violet)</label>
                  <input
                    type="text"
                    value={content.hero.titleHighlight2 || ""}
                    onChange={(e) => updateHero("titleHighlight2", e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Subtitle</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                />
              </div>
              <ImageField
                label="Hero side image"
                value={content.hero.bannerImage}
                onChange={(url) => updateHero("bannerImage", url)}
              />
              <ImageField
                label="Hero background banner"
                value={content.hero.backgroundImage}
                onChange={(url) => updateHero("backgroundImage", url)}
              />
            </div>
          )}

          {activeTab === "projects" && (
            <>
              <UploadPortfolioPanel onAdd={(item) => addListItem("projects", item)} />
              <MediaGrid
                items={content.projects || []}
                fields={[
                  { key: "title", placeholder: "Title" },
                  { key: "category", placeholder: "Category (used by the filter)" },
                  { key: "description", placeholder: "Description", type: "textarea" },
                ]}
                blank={{ title: "", category: "", description: "", image: "" }}
                categoryKey="category"
                onAdd={(item) => addListItem("projects", item)}
                onUpdate={(i, field, value) => updateListItem("projects", i, field, value)}
                onRemoveMany={(indexes) => removeListItems("projects", indexes)}
              />
            </>
          )}

          {activeTab === "gallery" && (
            <MediaGrid
              items={content.gallery || []}
              fields={[
                { key: "caption", placeholder: "Caption (shown on hover)" },
                { key: "category", placeholder: "Category (used by the filter)" },
              ]}
              blank={{ image: "", caption: "", category: "" }}
              categoryKey="category"
              onAdd={(item) => addListItem("gallery", item)}
              onUpdate={(i, field, value) => updateListItem("gallery", i, field, value)}
              onRemoveMany={(indexes) => removeListItems("gallery", indexes)}
            />
          )}

          {activeTab === "services" && (
            <>
              {(content.services || []).map((service, i) => (
                <div className="item-card" key={i}>
                  {content.services.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeListItem("services", i)}
                    >
                      Remove
                    </button>
                  )}
                  <div className="field">
                    <label>Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateListItem("services", i, "title", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea
                      value={service.description}
                      onChange={(e) =>
                        updateListItem("services", i, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                className="add-item-btn"
                onClick={() =>
                  addListItem("services", { title: "New Service", description: "" })
                }
              >
                + Add service
              </button>
            </>
          )}

          {activeTab === "testimonials" && (
            <>
              {(content.testimonials || []).map((t, i) => (
                <div className="item-card" key={i}>
                  {content.testimonials.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeListItem("testimonials", i)}
                    >
                      Remove
                    </button>
                  )}
                  <div className="field">
                    <label>Name</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => updateListItem("testimonials", i, "name", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Role</label>
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => updateListItem("testimonials", i, "role", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Quote</label>
                    <textarea
                      value={t.quote}
                      onChange={(e) => updateListItem("testimonials", i, "quote", e.target.value)}
                    />
                  </div>
                  <ImageField
                    label="Avatar"
                    value={t.avatar}
                    onChange={(url) => updateListItem("testimonials", i, "avatar", url)}
                  />
                </div>
              ))}
              <button
                className="add-item-btn"
                onClick={() =>
                  addListItem("testimonials", {
                    name: "New Client",
                    role: "",
                    quote: "",
                    avatar: "",
                  })
                }
              >
                + Add testimonial
              </button>
            </>
          )}

          {activeTab === "blog" && (
            <>
              {(content.blog || []).map((post, i) => (
                <div className="item-card" key={i}>
                  {content.blog.length > 1 && (
                    <button className="remove-btn" onClick={() => removeListItem("blog", i)}>
                      Remove
                    </button>
                  )}
                  <ImageField
                    label="Featured image"
                    value={post.image}
                    onChange={(url) => updateListItem("blog", i, "image", url)}
                  />
                  <div className="field">
                    <label>Title</label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => updateListItem("blog", i, "title", e.target.value)}
                    />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label>Author</label>
                      <input
                        type="text"
                        value={post.author || ""}
                        onChange={(e) => updateListItem("blog", i, "author", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Date</label>
                      <input
                        type="text"
                        value={post.date || ""}
                        placeholder="October 19, 2023"
                        onChange={(e) => updateListItem("blog", i, "date", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label>Category</label>
                      <input
                        type="text"
                        value={post.category || ""}
                        onChange={(e) => updateListItem("blog", i, "category", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Excerpt</label>
                    <textarea
                      value={post.excerpt || ""}
                      placeholder="Short summary shown on the blog card"
                      onChange={(e) => updateListItem("blog", i, "excerpt", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Full content</label>
                    <textarea
                      className="tall"
                      value={post.content || ""}
                      placeholder="The full body of the blog post"
                      onChange={(e) => updateListItem("blog", i, "content", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button
                className="add-item-btn"
                onClick={() =>
                  addListItem("blog", {
                    title: "New Post",
                    image: "",
                    author: "admin",
                    date: "",
                    category: "",
                    excerpt: "",
                    content: "",
                  })
                }
              >
                + Add post
              </button>
            </>
          )}

          {activeTab === "contact" && (
            <div className="card">
              <div className="field">
                <label>Address</label>
                <input
                  type="text"
                  value={content.contact.address}
                  onChange={(e) => updateContact("address", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) => updateContact("phone", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="text"
                  value={content.contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="save-row">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            {status && (
              <span className={`save-status ${status.type === "error" ? "error" : ""}`}>
                {status.text}
              </span>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
