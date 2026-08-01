"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "./imageUtils";
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
function MediaGrid({ items, fields, blank, onAdd, onUpdate, onRemoveMany }) {
  const inputRef = useRef(null);
  const [selected, setSelected] = useState(() => new Set());
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null);

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

  return (
    <>
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
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>
          + Upload images
        </button>
        {progress && <span className="upload-info">{progress}</span>}
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
            <MediaGrid
              items={content.projects || []}
              fields={[
                { key: "title", placeholder: "Title" },
                { key: "description", placeholder: "Description", type: "textarea" },
              ]}
              blank={{ title: "", description: "", image: "" }}
              onAdd={(item) => addListItem("projects", item)}
              onUpdate={(i, field, value) => updateListItem("projects", i, field, value)}
              onRemoveMany={(indexes) => removeListItems("projects", indexes)}
            />
          )}

          {activeTab === "gallery" && (
            <MediaGrid
              items={content.gallery || []}
              fields={[{ key: "caption", placeholder: "Caption (shown on hover)" }]}
              blank={{ image: "", caption: "" }}
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
