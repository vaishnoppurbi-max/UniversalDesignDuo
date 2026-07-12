import { Target, Shield, Eye, Headset } from "./icons";

const FEATURES = [
  {
    Icon: Target,
    title: "ROI Focused",
    text: "Every strategy is designed to maximize your return on investment.",
  },
  {
    Icon: Shield,
    title: "Proven Strategies",
    text: "Our methods are tested, proven, and continuously optimized.",
  },
  {
    Icon: Eye,
    title: "Transparent Process",
    text: "Clear communication and regular reporting keep you in the loop.",
  },
  {
    Icon: Headset,
    title: "Dedicated Support",
    text: "Our team is always here to support your success.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container why-grid">
        <div>
          <div className="eyebrow">Why Choose Us</div>
          <h2 className="section-title">
            Results That <span className="text-violet">Matter</span>
          </h2>
          <p style={{ color: "var(--muted)", marginTop: 14 }}>
            We focus on delivering measurable results that impact your bottom line.
          </p>
        </div>
        {FEATURES.map((f) => (
          <div className="feature" key={f.title}>
            <div className="fic">
              <f.Icon size={24} />
            </div>
            <h4>{f.title}</h4>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
