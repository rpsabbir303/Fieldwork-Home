"use client";

import Link from "next/link";
import { useState } from "react";
import { Hammer, Menu, Search, X } from "lucide-react";

const links = [
  ["Home", "/"],
  ["Calculators", "/calculators"],
  ["Projects", "/projects"],
  ["Cost Guides", "/cost-guides"],
  ["Design Ideas", "/design-ideas"],
  ["Materials & Tools", "/materials-tools"],
  ["Home Maintenance", "/home-maintenance"],
  ["Guides", "/guides"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="top-note">
        <div className="container">
          A clearer way to plan, make, and maintain your home{" "}
          <span>Independent homeowner resources</span>
        </div>
      </div>
      <div className="container header-main">
        <Link
          href="/"
          className="brand"
          onClick={() => setOpen(false)}
          aria-label="Fieldwork Home, home page"
        >
          <span className="brand-mark">
            <Hammer size={23} strokeWidth={2.2} />
          </span>
          <span>
            <strong>FIELDWORK</strong>
            <small>HOME</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="icon-button search-button" href="/search" aria-label="Search site">
            <Search size={20} />
          </Link>
          <button
            className="icon-button mobile-toggle"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link onClick={() => setOpen(false)} key={href} href={href}>
              {label}
            </Link>
          ))}
          <Link onClick={() => setOpen(false)} href="/search">
            Search the site
          </Link>
        </nav>
      )}
    </header>
  );
}
