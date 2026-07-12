import { Rocket, Search, ThumbsUp, Pencil, Mail, Chart, ArrowRight } from "./icons";

const ICONS = [Rocket, Search, ThumbsUp, Pencil, Mail, Chart];

export default function Services({ services, heading = true }) {
  return (
    <section id="services" className="section">
      <div className="container">
        {heading && (
          <div className="section-head">
            <div className="eyebrow">Our Services</div>
            <h2 className="section-title">Complete Digital Marketing Solutions</h2>
            <p>
              We offer a full range of digital marketing services to help your
              business grow online.
            </p>
          </div>
        )}
        <div className="cards-grid">
          {services.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div className="service-card" key={i}>
                <div className="svc-ic">
                  <Icon />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <a href="/services" className="learn">
                  Learn More <ArrowRight size={15} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
