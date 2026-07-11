export default function About() {
  return (
    <section id="about" className="about-section pb-120">
      <div className="container">
        <div className="row align-items-center gy-lg-0 gy-4">
          <div className="col-lg-6">
            <div className="about-img">
              <div
                className="shape"
                data-background="/assets/img/shapes/about-shape.png"
              ></div>
              <img
                className="img"
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=700&h=700&q=80"
                alt="about"
              />
              <div className="about-counter">
                <div className="counter-icon">
                  <div className="icon">
                    <img src="/assets/img/icon/about-icon.png" alt="icon" />
                  </div>
                  <h3 className="title">
                    <span className="odometer" data-count="10">
                      0
                    </span>
                    +
                  </h3>
                </div>
                <p>Years Of Experiences</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content">
              <div className="shape">
                <img src="/assets/img/shapes/about-shape-2.png" alt="shape" />
              </div>
              <div className="section-heading heading-2">
                <h4 className="sub-heading">About Us</h4>
                <h2 className="section-title">
                  Dominate the <span>Digital</span> Landscape
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  sit amet rcus nunc. Duis egestas ac ante sed tincidunt.
                </p>
              </div>
              <ul className="about-list">
                <li>
                  <i className="fa-regular fa-chevrons-right" />
                  International Development Authority
                </li>
                <li>
                  <i className="fa-regular fa-chevrons-right" />
                  Real Authority Method
                </li>
                <li>
                  <i className="fa-regular fa-chevrons-right" />
                  Live Project Done With Practical
                </li>
              </ul>
              <a href="/services" className="pb-primary-btn">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
