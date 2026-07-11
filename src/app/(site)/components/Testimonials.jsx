export default function Testimonials({ testimonials }) {
  return (
    <section className="testimonial-section pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="testi-info md-pb-40">
              <div className="section-heading heading-2">
                <h4 className="sub-heading">Our Clients</h4>
                <h2 className="section-title">
                  Grow Your Business with Strategic <span>SEO</span>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  sit amet rcus nunc. Duis egestas ac ante sed tincidunt.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=600&h=500&q=80"
                alt="testi"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="testi-items">
              {testimonials.map((t, i) => (
                <div className="testi-item" key={i}>
                  <div className="client-thumb">
                    <img src={t.avatar} alt="testi" />
                  </div>
                  <img
                    className="quote"
                    src="/assets/img/shapes/quote.png"
                    alt="quote"
                  />
                  <div className="testi-content">
                    <h3 className="name">
                      {t.name} <span>{t.role}</span>
                    </h3>
                    <ul className="review">
                      {[...Array(5)].map((_, idx) => (
                        <li key={idx}>
                          <i className="fas fa-star" />
                        </li>
                      ))}
                    </ul>
                    <p>{t.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
