export default function Hero({ hero }) {
  return (
    <section
      className="hero-section"
      data-background="/assets/img/bg-img/hero-bg.png"
    >
      <div className="hero-shapes">
        <div className="shape top-shape"></div>
        <div className="shape bottom-shape"></div>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content md-pb-20">
              <h1 className="title tracking-in-expand">
                <span className="shape-text">
                  {hero.titleLine1}{" "}
                  <img
                    className="shape"
                    src="/assets/img/shapes/hero-text-shape.png"
                    alt="shape"
                  />
                </span>{" "}
                {hero.titleLine2} <span className="gradient-text">{hero.titleHighlight}</span>
              </h1>
              <p>{hero.subtitle}</p>
              <a href="/about" className="pb-primary-btn primary-2">
                Learn More
              </a>
              <div className="shapes">
                <div className="round-shape">
                  <img src="/assets/img/shapes/hero-round.png" alt="shape" />
                </div>
                <div className="star">
                  <img src="/assets/img/shapes/hero-star.png" alt="shape" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-thumb text-center">
              <div className="shapes">
                <div className="shape hero-shape-1">
                  <img src="/assets/img/shapes/hero-shape-1.png" alt="shape" />
                </div>
                <div className="shape hero-shape-2">
                  <img src="/assets/img/shapes/hero-img-shape-1.png" alt="shape" />
                </div>
                <div className="shape hero-shape-3">
                  <img src="/assets/img/shapes/hero-img-shape-2.png" alt="shape" />
                </div>
              </div>
              <div className="hero-counter">
                <img src="/assets/img/icon/hero-user.png" alt="icon" />
                <div className="counter-content">
                  <h3 className="title">
                    <span className="odometer" data-count="5000">
                      0
                    </span>
                    +
                  </h3>
                  <p>Satisfied Clients</p>
                </div>
              </div>
              <img src={hero.bannerImage} alt="hero" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
