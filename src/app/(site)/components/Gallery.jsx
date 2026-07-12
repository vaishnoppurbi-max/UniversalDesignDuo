export default function Gallery({ items, heading = true }) {
  return (
    <section className="section">
      <div className="container">
        {heading && (
          <div className="section-head">
            <div className="eyebrow">Our Gallery</div>
            <h2 className="section-title">Moments From Our Work</h2>
            <p>
              A look inside our studio — the people, process, and projects
              behind the results.
            </p>
          </div>
        )}
        <div className="gallery-grid">
          {items.map((g, i) => (
            <figure className="gallery-card" key={i}>
              <img src={g.image} alt={g.caption || `Gallery image ${i + 1}`} />
              {g.caption && <figcaption>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
