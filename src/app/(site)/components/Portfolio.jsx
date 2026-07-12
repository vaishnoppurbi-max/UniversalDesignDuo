export default function Portfolio({ projects, heading = true }) {
  return (
    <section className="section">
      <div className="container">
        {heading && (
          <div className="section-head">
            <div className="eyebrow">Our Work</div>
            <h2 className="section-title">Projects We&apos;re Proud Of</h2>
            <p>
              A selection of campaigns and brands we&apos;ve helped grow with
              data-driven digital marketing.
            </p>
          </div>
        )}
        <div className="portfolio-grid">
          {projects.map((p, i) => (
            <div className="pf-card" key={i}>
              <div className="pf-thumb">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="pf-body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
