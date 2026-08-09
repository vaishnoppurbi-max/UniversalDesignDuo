"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ArrowRight } from "./icons";

const ALL = "All";

export default function GalleryFilter({ items, heading = true, layout = "sidebar" }) {
  const [active, setActive] = useState(ALL);
  const [lightbox, setLightbox] = useState(null); // index into `visible`

  const categories = useMemo(() => {
    const seen = [];
    for (const item of items) {
      const c = (item.category || "").trim();
      if (c && !seen.includes(c)) seen.push(c);
    }
    return seen;
  }, [items]);

  const visible = useMemo(
    () =>
      active === ALL
        ? items
        : items.filter((i) => (i.category || "").trim() === active),
    [items, active]
  );

  const countOf = (cat) =>
    cat === ALL
      ? items.length
      : items.filter((i) => (i.category || "").trim() === cat).length;

  const step = useCallback(
    (delta) =>
      setLightbox((cur) =>
        cur === null ? cur : (cur + delta + visible.length) % visible.length
      ),
    [visible.length]
  );

  // Keyboard control for the lightbox, and lock scroll while it is open.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, step]);

  const shot = lightbox === null ? null : visible[lightbox];

  return (
    <section className="section">
      <div className="container">
        {heading && (
          <div className="section-head">
            <div className="eyebrow">{layout === "pills" ? "Our Work" : "Our Gallery"}</div>
            <h2 className="section-title">
              {layout === "pills"
                ? "Designs That Speak. Products That Perform."
                : "Moments From Our Work"}
            </h2>
            <p>
              {layout === "pills"
                ? "Browse our complete body of work — filter by category to explore projects, branding, and more."
                : "A look inside our studio — the people, process, and projects behind the results."}
            </p>
          </div>
        )}

        {layout === "pills" ? (
          <>
            {categories.length > 0 && (
              <div className="gallery-filters">
                {[ALL, ...categories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill${active === cat ? " active" : ""}`}
                    onClick={() => {
                      setActive(cat);
                      setLightbox(null);
                    }}
                  >
                    {cat} <em className="count">{countOf(cat)}</em>
                  </button>
                ))}
              </div>
            )}

            <div className="gal-masonry">
              {visible.map((g, i) => (
                <button
                  type="button"
                  className="gal-item"
                  key={`${g.image}-${i}`}
                  onClick={() => setLightbox(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.image} alt={g.caption || `Gallery image ${i + 1}`} />
                  <span className="gal-overlay">
                    {g.caption && <strong>{g.caption}</strong>}
                    {g.category && <em>{g.category}</em>}
                  </span>
                </button>
              ))}
            </div>

            {visible.length === 0 && (
              <p className="gallery-empty">Nothing in this category yet.</p>
            )}
          </>
        ) : (
          <div className="gal-layout">
            <aside className="gal-side">
              <h4>Categories</h4>
              <ul>
                {[ALL, ...categories].map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      className={active === cat ? "active" : ""}
                      onClick={() => {
                        setActive(cat);
                        setLightbox(null);
                      }}
                    >
                      <span>{cat}</span>
                      <em>{countOf(cat)}</em>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="gal-main">
              <div className="gal-masonry">
                {visible.map((g, i) => (
                  <button
                    type="button"
                    className="gal-item"
                    key={`${g.image}-${i}`}
                    onClick={() => setLightbox(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.image} alt={g.caption || `Gallery image ${i + 1}`} />
                    <span className="gal-overlay">
                      {g.caption && <strong>{g.caption}</strong>}
                      {g.category && <em>{g.category}</em>}
                    </span>
                  </button>
                ))}
              </div>

              {visible.length === 0 && (
                <p className="gallery-empty">Nothing in this category yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {shot && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" aria-label="Close">
            <X size={22} />
          </button>
          <button
            className="lb-nav prev"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            <ArrowRight size={20} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.image} alt={shot.caption || ""} />
            {(shot.caption || shot.category) && (
              <figcaption>
                {shot.caption}
                {shot.category && <span>{shot.category}</span>}
              </figcaption>
            )}
            <span className="lb-count">
              {lightbox + 1} / {visible.length}
            </span>
          </figure>
          <button
            className="lb-nav next"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
