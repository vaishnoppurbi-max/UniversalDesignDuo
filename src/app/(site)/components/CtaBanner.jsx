import { ArrowRight, Play } from "./icons";

export default function CtaBanner() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-banner">
          <div>
            <h2>Ready to Grow Your Business?</h2>
            <p>
              Let&apos;s create a digital marketing strategy that drives real
              results for your business.
            </p>
          </div>
          <div className="cta-actions">
            <a href="/contact" className="btn btn-white">
              Get Free Consultation
            </a>
            <a href="/portfolio" className="btn btn-ghost-white">
              <Play size={14} /> View Our Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
