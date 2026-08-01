"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "./icons";

const ALL = "All Work";

export default function WorkShowcase({ projects }) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(() => {
    const seen = [];
    for (const p of projects) {
      const c = (p.category || "").trim();
      if (c && !seen.includes(c)) seen.push(c);
    }
    return seen;
  }, [projects]);

  const visible =
    active === ALL
      ? projects
      : projects.filter((p) => (p.category || "").trim() === active);

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Our Work</div>
          <h2 className="section-title">
            Designs That Speak. Products That Perform.
          </h2>
        </div>

        {categories.length > 0 && (
          <div className="gallery-filters">
            {[ALL, ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill${active === cat ? " active" : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="work-grid">
          {visible.map((p, i) => (
            <article className="work-card" key={`${p.title}-${i}`}>
              <div className="work-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} />
              </div>
              <h3>{p.title}</h3>
              {p.category && <span className="work-cat">{p.category}</span>}
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="gallery-empty">Nothing in this category yet.</p>
        )}

        <div className="work-more">
          <a href="/portfolio" className="btn btn-outline">
            View More Projects <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
