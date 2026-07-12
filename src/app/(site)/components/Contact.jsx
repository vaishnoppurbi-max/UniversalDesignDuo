"use client";

import { MapPin, Phone, Mail, ArrowRight } from "./icons";

export default function Contact({ contact }) {
  return (
    <section className="section">
      <div className="container contact-grid">
        <div>
          <div className="eyebrow">Get In Touch</div>
          <h2 className="section-title">Let&apos;s Grow Your Business</h2>
          <p style={{ color: "var(--muted)", margin: "14px 0 26px" }}>
            Tell us about your project and we&apos;ll get back to you within one
            business day.
          </p>

          <div className="info-card">
            <span className="ic"><MapPin size={20} /></span>
            <div>
              <h4>Our Office</h4>
              <p>{contact.address}</p>
            </div>
          </div>
          <div className="info-card">
            <span className="ic"><Phone size={20} /></span>
            <div>
              <h4>Phone</h4>
              <p>
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
              </p>
            </div>
          </div>
          <div className="info-card">
            <span className="ic"><Mail size={20} /></span>
            <div>
              <h4>Email</h4>
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="form-card">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="field-c">
                <label>Name</label>
                <input type="text" placeholder="Your name" />
              </div>
              <div className="field-c">
                <label>Email</label>
                <input type="email" placeholder="you@company.com" />
              </div>
            </div>
            <div className="field-c">
              <label>Subject</label>
              <input type="text" placeholder="How can we help?" />
            </div>
            <div className="field-c">
              <label>Message</label>
              <textarea placeholder="Tell us about your project..." />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
