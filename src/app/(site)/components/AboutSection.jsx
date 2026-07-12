import { Check, Play, ArrowRight } from "./icons";

const POINTS = [
  "Data-driven strategies that deliver results",
  "Transparent reporting and clear communication",
  "Dedicated team of marketing experts",
  "Customized solutions for your business",
];

export default function AboutSection() {
  return (
    <section id="about" className="section soft">
      <div className="container about-grid">
        <div className="about-media">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=760&h=560&q=80"
            alt="Our team at work"
          />
          <button className="play-btn" aria-label="Play video">
            <Play size={22} />
          </button>
          <div className="exp-badge">
            <div className="n">10+</div>
            <div className="t">Years of Experience</div>
          </div>
        </div>

        <div className="about-copy">
          <div className="eyebrow">About Us</div>
          <h2 className="section-title">
            We Help Brands Dominate The <span className="text-violet">Digital</span>{" "}
            Landscape
          </h2>
          <p style={{ color: "var(--muted)", marginTop: 16 }}>
            We are a team of digital marketing experts passionate about helping
            businesses grow online. Our strategies are data-driven,
            results-focused, and tailored to your unique goals.
          </p>
          <ul className="check-list">
            {POINTS.map((p) => (
              <li key={p}>
                <span className="ck">
                  <Check size={14} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <a href="/about" className="btn btn-primary">
            Learn More About Us <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
