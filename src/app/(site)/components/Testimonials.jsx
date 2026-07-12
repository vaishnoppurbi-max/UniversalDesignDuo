export default function Testimonials({ testimonials, heading = true }) {
  return (
    <section className="section">
      <div className="container">
        {heading && (
          <div className="section-head">
            <div className="eyebrow">Testimonials</div>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
        )}
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="quote-mark">&ldquo;</div>
              <p>{t.quote}</p>
              <div className="testi-person">
                <img src={t.avatar} alt={t.name} />
                <div>
                  <div className="nm">{t.name}</div>
                  <div className="rl">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
