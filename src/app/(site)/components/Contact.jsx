export default function Contact({ contact }) {
  return (
    <section id="contact" className="request-section bg-grey pt-120">
      <div className="bg-color"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="request-content">
              <div className="shape">
                <img src="/assets/img/shapes/request-shape.png" alt="shape" />
              </div>
              <div className="section-heading heading-2">
                <h4 className="sub-heading">Contact Us</h4>
                <h2 className="section-title">
                  Stand Out in the <span>Digital</span> Crowd Presence
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  sit amet rcus nunc. Duis egestas ac ante sed tincidunt.
                </p>
              </div>
              {contact && (
                <ul className="about-list mb-4">
                  <li>
                    <i className="fa-regular fa-location-dot" /> {contact.address}
                  </li>
                  <li>
                    <i className="fa-regular fa-phone" />{" "}
                    <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                      {contact.phone}
                    </a>
                  </li>
                  <li>
                    <i className="fa-regular fa-envelope" />{" "}
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                </ul>
              )}
              <div className="request-form">
                <form
                  action="/assets/mail.php"
                  method="post"
                  id="ajax_contact"
                  className="form-horizontal"
                >
                  <div className="form-group row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        className="form-control"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="col-md-6">
                      <select
                        className="select-control form-control country"
                        name="plan"
                        defaultValue=""
                      >
                        <option value="">Sort by popular</option>
                        <option value="vdt">Plan One</option>
                        <option value="can">Plan Two</option>
                        <option value="uk">Plan Three</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <textarea
                        id="message"
                        name="message"
                        cols="30"
                        rows="5"
                        className="form-control address"
                        placeholder="Message"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="submit-btn text-center">
                    <button id="submit" className="pb-primary-btn" type="submit">
                      Send a messege
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="request-img text-center">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&h=700&q=80"
                alt="img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
