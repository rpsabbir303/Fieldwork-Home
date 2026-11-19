import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="footer-wordmark">
            FIELDWORK <em>HOME</em>
          </span>
          <p>
            Plan smarter. Calculate accurately. Compare confidently. Complete your home projects.
          </p>
          <small>
            Independent resources for US homeowners. Always follow product instructions and local
            requirements.
          </small>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/calculators">Calculators</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/cost-guides">Cost guides</Link>
          <Link href="/guides">Guides</Link>
        </div>
        <div>
          <h3>Discover</h3>
          <Link href="/design-ideas">Design ideas</Link>
          <Link href="/materials-tools">Materials & tools</Link>
          <Link href="/home-maintenance">Home maintenance</Link>
          <Link href="/about">About Fieldwork</Link>
        </div>
        <div>
          <h3>Information</h3>
          <Link href="/contact">Contact</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/terms">Terms of use</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Fieldwork Home. Starter editorial project.</span>
        <span>Built for practical projects, one good decision at a time.</span>
      </div>
    </footer>
  );
}
