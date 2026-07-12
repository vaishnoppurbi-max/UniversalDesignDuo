import { ArrowRight, Rocket } from "./icons";

const BARS = [40, 55, 45, 70, 60, 85, 75, 95];

export default function CaseStudy() {
  return (
    <section className="section soft">
      <div className="container case-grid">
        {/* charts card */}
        <div className="chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div className="cap">Total Revenue</div>
              <div className="rev">$245,680</div>
            </div>
            <div style={{ color: "#16a34a", fontWeight: 700, fontSize: 13 }}>+235.6%</div>
          </div>
          <svg viewBox="0 0 300 90" style={{ width: "100%", marginTop: 8 }}>
            <polyline
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2.5"
              points="0,75 45,60 90,66 135,42 180,48 225,26 270,18 300,8"
            />
            <polyline
              fill="url(#g)"
              stroke="none"
              points="0,75 45,60 90,66 135,42 180,48 225,26 270,18 300,8 300,90 0,90"
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7c3aed" stopOpacity="0.25" />
                <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="cap" style={{ marginTop: 14, marginBottom: 8 }}>
            Campaign Performance
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 60 }}>
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: 4,
                  background:
                    i % 2 === 0
                      ? "linear-gradient(180deg,#8b5cf6,#7c3aed)"
                      : "linear-gradient(180deg,#fb923c,#f97316)",
                }}
              />
            ))}
          </div>
        </div>

        {/* copy */}
        <div>
          <div className="eyebrow">Case Study</div>
          <h2 className="section-title">From Clicks to Customers</h2>
          <p style={{ color: "var(--muted)", margin: "14px 0 6px" }}>
            See how we helped a local business increase their online sales by
            300% in just 6 months.
          </p>
          <div className="case-stats">
            <div>
              <div className="num">300%</div>
              <div className="lbl">Increase in Sales</div>
            </div>
            <div>
              <div className="num">150%</div>
              <div className="lbl">More Website Traffic</div>
            </div>
            <div>
              <div className="num">250%</div>
              <div className="lbl">ROI Improvement</div>
            </div>
          </div>
          <a href="/portfolio" className="btn btn-primary">
            View Case Study <ArrowRight size={16} />
          </a>
        </div>

        {/* rocket accent */}
        <div style={{ textAlign: "center", color: "var(--violet)" }}>
          <div
            style={{
              width: 120,
              height: 120,
              margin: "0 auto",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#f4f0ff,#efe7ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Rocket size={56} />
          </div>
        </div>
      </div>
    </section>
  );
}
