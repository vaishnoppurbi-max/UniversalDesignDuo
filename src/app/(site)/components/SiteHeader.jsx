"use client";

import { useState } from "react";
import { Globe, Menu, X, ArrowRight } from "./icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ active = "/" }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container inner">
        <a href="/" className="brand">
          <img src="/assets/img/logo/logo-dark.png" alt="Universal Design Duo" />
        </a>

        <nav>
          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className={active === n.href ? "active" : ""}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-right">
          <span className="globe">
            <Globe size={20} />
          </span>
          <a href="/contact" className="btn btn-primary">
            Get Started <ArrowRight size={16} />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <Menu size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav${open ? " open" : ""}`}>
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className={active === n.href ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {n.label}
          </a>
        ))}
        <a href="/contact" className="btn btn-primary">
          Get Started <ArrowRight size={16} />
        </a>
      </div>
    </header>
  );
}
