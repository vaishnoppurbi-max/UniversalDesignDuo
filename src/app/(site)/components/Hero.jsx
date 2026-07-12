import { ArrowRight, Play } from "./icons";

const STATS = [
  { num: "5000+", lbl: "Happy Clients" },
  { num: "10+", lbl: "Years Experience" },
  { num: "300+", lbl: "Projects Completed" },
  { num: "20+", lbl: "Team Members" },
];

export default function Hero({ hero }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="dot" /> WE GROW BRANDS ONLINE
          </span>
          <h1>
            {hero.titleLine1}
            <br />
            {hero.titleLine2}{" "}
            <span className="text-orange">{hero.titleHighlight}</span>{" "}
            {hero.titleHighlight2 && (
              <span className="text-violet">{hero.titleHighlight2}</span>
            )}
          </h1>
          <p className="lead">{hero.subtitle}</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-primary">
              Get Started <ArrowRight size={16} />
            </a>
            <a href="/portfolio" className="btn btn-outline">
              <Play size={14} /> View Our Work
            </a>
          </div>
          <div className="hero-stats">
            {STATS.map((s) => (
              <div key={s.lbl}>
                <div className="num">
                  {s.num.replace("+", "")}
                  <span>+</span>
                </div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <img src={hero.bannerImage} alt="Digital marketing dashboard" />
          <div className="hero-chip up one">
            <div>
              <div className="cap">Traffic Growth</div>
              <div className="val">+156%</div>
            </div>
          </div>
          <div className="hero-chip up two">
            <div>
              <div className="cap">Conversion Rate</div>
              <div className="val">+89%</div>
            </div>
          </div>
          <div className="hero-chip up three">
            <div>
              <div className="cap">ROI Increase</div>
              <div className="val">+240%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
