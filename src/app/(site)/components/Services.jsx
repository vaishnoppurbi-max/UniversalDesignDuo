export default function Services({ services }) {
  return (
    <section id="services" className="service-section pt-120">
      <div className="container">
        <div className="row justify-content-center gy-lg-0 gy-4">
          {services.map((service, i) => (
            <div className="col-lg-4 col-md-6" key={i}>
              <div className="service-item text-center">
                <div className="service-icon">
                  <img src={`/assets/img/icon/service-icon-${(i % 3) + 1}.png`} alt="service" />
                </div>
                <div className="service-content">
                  <h3 className="title">
                    <a href="/services">{service.title}</a>
                  </h3>
                  <p>{service.description}</p>
                </div>
                <div className="service-btn">
                  <a href="/services">
                    <i className="fa-solid fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
