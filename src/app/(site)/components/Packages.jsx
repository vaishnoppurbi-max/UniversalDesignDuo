import { Check } from "./icons";

const PLANS = [
  {
    name: "Starter",
    blurb: "Perfect for startups & individuals who are getting started.",
    price: "₹14,999",
    unit: "/project",
    features: ["Logo & Brand Identity", "Business Card Design", "2 Revisions"],
  },
  {
    name: "Standard",
    blurb: "Great for growing businesses needing strong design support.",
    price: "₹29,999",
    unit: "/project",
    popular: true,
    features: [
      "Brand Identity System",
      "Packaging Design",
      "3D Mockup",
      "Unlimited Revisions",
    ],
  },
  {
    name: "Premium",
    blurb: "For brands looking for complete design & product solutions.",
    price: "₹59,999",
    unit: "/project",
    features: [
      "Product Design",
      "Packaging + Branding",
      "3D Rendering",
      "Unlimited Revisions",
    ],
  },
];

export default function Packages() {
  return (
    <section id="packages" className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Our Packages</div>
          <h2 className="section-title">
            <span className="text-gold">Flexible</span> Plans for Every Stage of
            Your Journey
          </h2>
        </div>

        <div className="pkg-grid">
          {PLANS.map((p) => (
            <div className={`pkg-card${p.popular ? " popular" : ""}`} key={p.name}>
              {p.popular && <span className="pkg-badge">Most Popular</span>}
              <h3>{p.name}</h3>
              <p className="pkg-blurb">{p.blurb}</p>
              <div className="pkg-price">
                {p.price}
                <span>{p.unit}</span>
              </div>
              <ul className="pkg-features">
                {p.features.map((f) => (
                  <li key={f}>
                    <Check size={15} /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className={`btn ${p.popular ? "btn-primary" : "btn-outline"}`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
