export default function Footer() {
  return (
    <>
      <footer className="footer-section bg-grey">
        <div
          className="footer-bg"
          data-background="/assets/img/bg-img/footer-bg.png"
        ></div>
        <div className="container">
          <div className="row footer-wrap pt-120 pb-120">
            <div className="col-lg-5 col-md-6">
              <div className="footer-widget">
                <div className="site-logo">
                  <a href="/">
                    <img src="/assets/img/logo/logo-dark.png" alt="logo" />
                  </a>
                </div>
                <div className="section-heading heading-2">
                  <h2 className="section-title">
                    Drive is with <span>Effective</span> Online Marketing
                  </h2>
                </div>
                <ul className="footer-links">
                  <li>
                    <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/services">Services</a>
                  </li>
                  <li>
                    <a href="/portfolio">Portfolio</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                  <li>
                    <a href="/blog">Partners</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-5 col-md-6">
              <div className="footer-widget">
                <h3 className="widget-title">Get In Touch</h3>
                <p className="desc">
                  Lorem ipsum dolor amet, consectetur sell adipis elit phase
                  nibh ellentes ipsum dolor amet
                </p>
                <div className="footer-form">
                  <form action="#" className="mt-subscribe-form">
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="E-mail Here"
                    />
                    <input type="hidden" name="action" value="mailchimpsubscribe" />
                    <button className="submit">
                      <i className="fa-sharp fa-solid fa-paper-plane" />
                    </button>
                  </form>
                </div>
                <ul className="footer-social">
                  <li>
                    <a href="#">
                      <i className="fa-brands fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-brands fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-brands fa-linkedin" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa-brands fa-pinterest-p" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget">
                <h3 className="widget-title">Services</h3>
                <ul className="footer-list">
                  <li>
                    <a href="/services">
                      <i className="fa-sharp fa-regular fa-chevron-right" />
                      Page Boost
                    </a>
                  </li>
                  <li>
                    <a href="/services">
                      <i className="fa-sharp fa-regular fa-chevron-right" />
                      Marketting
                    </a>
                  </li>
                  <li>
                    <a href="/services">
                      <i className="fa-sharp fa-regular fa-chevron-right" />
                      Grow Reach
                    </a>
                  </li>
                  <li>
                    <a href="/blog">
                      <i className="fa-sharp fa-regular fa-chevron-right" />
                      Blog And News
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className="container">
            <div className="copyright-content">
              <p>
                Copyright © Universal Design Duo 2026 <span>Optiboom</span>, All
                Rights Reserved.
              </p>
              <ul className="copy-list">
                <li>
                  <a href="/contact">Terms &amp; Condition</a>
                </li>
                <li>
                  <a href="/contact">Privacy Policy</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      {/* ./ footer-section */}

      <div id="scrollup">
        <button id="scroll-top" className="scroll-to-top">
          <i className="fa-regular fa-arrow-up-long" />
        </button>
      </div>
      {/* scrollup */}
    </>
  );
}
