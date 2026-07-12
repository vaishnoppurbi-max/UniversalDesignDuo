"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "./imageUtils";
import "./admin.css";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const TABS = [
  { key: "hero", label: "Hero" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Portfolio" },
  { key: "testimonials", label: "Testimonials" },
  { key: "gallery", label: "Gallery" },
  { key: "blog", label: "Blog" },
  { key: "contact", label: "Contact" },
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
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        const saved = file.size - compressed.size;
        setInfo(
          saved > 0
            ? `Optimized ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`
            : `Uploaded ${formatBytes(compressed.size)}`
        );
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
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
      res.ok
        ? { type: "ok", text: "Saved" }
        : { type: "error", text: "Failed to save" }
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

  if (!content) {
    return (
      <div className="admin">
        <div style={{ padding: 40 }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-topbar">
        <div className="brand">
          <img src="/assets/img/logo/logo-dark.png" alt="Universal Design Duo" />
          Admin Dashboard
        </div>
        <div className="actions">
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost">
            View site ↗
          </a>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-body">
        <nav className="admin-nav">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-content">
          {activeTab === "hero" && (
            <>
              <h1>Hero Section</h1>
              <p className="subtitle">The main banner shown at the top of the homepage.</p>
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
            </>
          )}

          {activeTab === "services" && (
            <>
              <h1>Services</h1>
              <p className="subtitle">The three service cards on the homepage.</p>
              {content.services.map((service, i) => (
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
                onClick={() => addListItem("services", { title: "New Service", description: "" })}
              >
                + Add service
              </button>
            </>
          )}

          {activeTab === "projects" && (
            <>
              <h1>Portfolio</h1>
              <p className="subtitle">Portfolio items shown in the portfolio grid.</p>
              {content.projects.map((project, i) => (
                <div className="item-card" key={i}>
                  {content.projects.length > 1 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeListItem("projects", i)}
                    >
                      Remove
                    </button>
                  )}
                  <div className="field">
                    <label>Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateListItem("projects", i, "title", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        updateListItem("projects", i, "description", e.target.value)
                      }
                    />
                  </div>
                  <ImageField
                    label="Portfolio image"
                    value={project.image}
                    onChange={(url) => updateListItem("projects", i, "image", url)}
                  />
                </div>
              ))}
              <button
                className="add-item-btn"
                onClick={() =>
                  addListItem("projects", { title: "New Portfolio Item", description: "", image: "" })
                }
              >
                + Add portfolio item
              </button>
            </>
          )}

          {activeTab === "testimonials" && (
            <>
              <h1>Testimonials</h1>
              <p className="subtitle">Client quotes shown on the homepage.</p>
              {content.testimonials.map((t, i) => (
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
                  addListItem("testimonials", { name: "New Client", role: "", quote: "", avatar: "" })
                }
              >
                + Add testimonial
              </button>
            </>
          )}

          {activeTab === "gallery" && (
            <>
              <h1>Gallery</h1>
              <p className="subtitle">
                Photos shown on the Gallery page. Upload images (auto-optimized
                to WebP) and add an optional caption.
              </p>
              {(content.gallery || []).map((g, i) => (
                <div className="item-card" key={i}>
                  <button
                    className="remove-btn"
                    onClick={() => removeListItem("gallery", i)}
                  >
                    Remove
                  </button>
                  <ImageField
                    label="Image"
                    value={g.image}
                    onChange={(url) => updateListItem("gallery", i, "image", url)}
                  />
                  <div className="field">
                    <label>Caption</label>
                    <input
                      type="text"
                      value={g.caption || ""}
                      placeholder="Shown on hover (optional)"
                      onChange={(e) =>
                        updateListItem("gallery", i, "caption", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <button
                className="add-item-btn"
                onClick={() => addListItem("gallery", { image: "", caption: "" })}
              >
                + Add gallery image
              </button>
            </>
          )}

          {activeTab === "blog" && (
            <>
              <h1>Blog Posts</h1>
              <p className="subtitle">
                Manage blog posts shown on the homepage and the Blog page. Upload a
                featured image for each post — images are auto-optimized to WebP.
              </p>
              {content.blog.map((post, i) => (
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
            <>
              <h1>Contact Info</h1>
              <p className="subtitle">Shown in the mobile menu and used across the site.</p>
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
            </>
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
        </div>
      </div>
    </div>
  );
}
