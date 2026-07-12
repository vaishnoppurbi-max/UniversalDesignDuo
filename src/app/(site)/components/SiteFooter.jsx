"use client";

import { Facebook, Twitter, Linkedin, Instagram, Send } from "./icons";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SERVICES = [
  "Digital Advertising",
  "SEO Services",
  "Social Media Marketing",
  "Content Marketing",
  "Email Marketing",
  "Analytics & Reporting",
];

const COMPANY = [
  "About Us",
  "Our Team",
  "Careers",
  "Privacy Policy",
  "Terms of Service",
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="/" className="brand">
              <img src="/assets/img/logo/logo-dark.png" alt="Universal Design Duo" />
            </a>
            <p className="about">
              We are a full-service digital marketing agency helping businesses
              grow online with data-driven strategies.
            </p>
            <div className="foot-social">
              <a href="#" aria-label="Facebook"><Facebook size={17} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            </div>
          </div>

          <div className="foot-col">
            <h5>Quick Links</h5>
            <ul>
              {QUICK.map((q) => (
                <li key={q.label}>
                  <a href={q.href}>{q.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Services</h5>
            <ul>
              {SERVICES.map((s) => (
                <li key={s}>
                  <a href="/services">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Newsletter</h5>
            <p style={{ fontSize: 14, color: "#a49fb8", margin: 0 }}>
              Stay updated with our latest news and marketing tips.
            </p>
            <form className="news-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" aria-label="Email" />
              <button type="submit" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
            <div style={{ marginTop: 22 }} className="foot-col">
              <ul>
                {COMPANY.slice(0, 3).map((c) => (
                  <li key={c}>
                    <a href="#">{c}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Universal Design Duo. All rights reserved.
      </div>
    </footer>
  );
}
