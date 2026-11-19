import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ClipboardCheck, Compass, MoveRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import {
  CalculatorCard,
  ContentCard,
  SectionHeading,
  calculatorCards,
  discoveryPaths,
} from "@/components/content-ui";

export default async function Home() {
  const projects = (await getCatalog("projects")).slice(0, 3);
  const guides = (await getCatalog("guides")).slice(0, 3);
  const designs = (await getCatalog("design-ideas")).slice(0, 2);
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" /> The better way to begin
            </p>
            <h1>
              Make more of <em>home.</em>
            </h1>
            <p className="hero-lead">
              Plan smarter. Calculate accurately. Compare confidently. Complete your home projects.
            </p>
            <p className="hero-support">
              Practical tools and thoughtful guidance for the decisions between an idea and a
              finished space.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/calculators">
                Explore calculators <ArrowUpRight size={18} />
              </Link>
              <Link className="button button-quiet" href="/projects">
                Browse projects <MoveRight size={18} />
              </Link>
            </div>
            <div className="hero-foot">
              <span>01 / Discover</span>
              <span>02 / Plan</span>
              <span>03 / Make</span>
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="hero-image"
              role="img"
              aria-label="Illustrated warm living room with painted wall, wood flooring, and houseplants"
            />
            <div className="hero-visual-label">
              <span>THE HOME PROJECT NOTEBOOK</span>
              <strong>A little more considered.</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="paths-section">
        <div className="container">
          <SectionHeading
            kicker="Find your way"
            title="Where do you want to start?"
            intro="Whether you have a plan or just a possibility, there’s a clear next step."
          />
          <div className="path-grid">
            {discoveryPaths.map(({ title, body, href, icon: Icon }, i) => (
              <Link key={href} href={href} className="path-card">
                <span className="path-index">0{i + 1}</span>
                <Icon size={26} strokeWidth={1.7} />
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="path-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="feature-band">
        <div className="container band-grid">
          <div>
            <p className="eyebrow">Built for the work ahead</p>
            <h2>A better result starts with a better estimate.</h2>
            <p>
              Use transparent formulas, adjustable assumptions, and your own local prices. Each tool
              shows how the number was reached.
            </p>
            <Link className="button button-light" href="/calculators">
              See all calculators <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="band-mini">
            <span className="mini-label">PROJECT PLANNING / EXAMPLE</span>
            <div className="mini-measure">
              <span>WALL AREA</span>
              <strong>
                480 <small>sq ft</small>
              </strong>
            </div>
            <div className="mini-rule" />
            <div className="mini-row">
              <span>Paint coverage</span>
              <strong>You choose</strong>
            </div>
            <div className="mini-row">
              <span>Coats & openings</span>
              <strong>Included</strong>
            </div>
            <div className="mini-row">
              <span>Material cost</span>
              <strong>Your price</strong>
            </div>
            <div className="mini-bottom">
              Transparent by design <CheckCircle2 size={17} />
            </div>
          </div>
        </div>
      </section>
      <section className="section-block">
        <div className="container">
          <SectionHeading
            kicker="Useful tools"
            title="Calculate before you commit"
            intro="A few minutes of measuring can make your shopping list much more useful."
            action={{ label: "All calculators", href: "/calculators" }}
          />
          <div className="calculator-grid">
            {calculatorCards.map((card) => (
              <CalculatorCard key={card.slug} card={card} />
            ))}
          </div>
        </div>
      </section>
      <section className="section-block alt-section">
        <div className="container">
          <SectionHeading
            kicker="From start to finish"
            title="Projects with a clear path"
            intro="Understand the preparation, tools, steps, and common mistakes before work starts."
            action={{ label: "Browse projects", href: "/projects" }}
          />
          <div className="card-grid">
            {projects.map((item) => (
              <ContentCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="split-feature">
        <div className="container split-grid">
          <div
            className="split-art"
            role="img"
            aria-label="Abstract illustration of material samples and a room plan"
          >
            <div className="sample a" />
            <div className="sample b" />
            <div className="sample c" />
            <span>
              Materials
              <br />
              matter.
            </span>
          </div>
          <div className="split-copy">
            <p className="eyebrow">Choose with intention</p>
            <h2>The right material changes everything.</h2>
            <p>
              Look beyond the color and finish. Compare how a material installs, wears, cleans, and
              fits the room it will live in.
            </p>
            <div className="split-links">
              <Link href="/materials-tools">
                Explore material comparisons <ArrowUpRight size={18} />
              </Link>
              <Link href="/cost-guides">
                Plan the complete cost <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section-block">
        <div className="container">
          <SectionHeading
            kicker="Good things to know"
            title="Read before you renovate"
            intro="Small decisions about surfaces, prep, and layout can make a big difference."
            action={{ label: "All guides", href: "/guides" }}
          />
          <div className="card-grid">
            {guides.map((item) => (
              <ContentCard key={item.slug} item={item} compact />
            ))}
          </div>
        </div>
      </section>
      <section className="bottom-discovery">
        <div className="container">
          <div className="discovery-panel">
            <div>
              <Compass size={30} />
              <p className="eyebrow">Find your direction</p>
              <h2>From a good idea to a doable plan.</h2>
              <p>
                Discover palettes and materials, then connect them to the projects and calculations
                that make them possible.
              </p>
              <Link className="button button-primary" href="/design-ideas">
                Explore design ideas <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="discovery-links">
              {designs.map((item) => (
                <Link key={item.slug} href={`/design-ideas/${item.slug}`}>
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
              <Link href="/home-maintenance">
                <span>After the project</span>
                <strong>Keep your home in good shape</strong>
                <ClipboardCheck size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="container">
          <strong>Useful information, clearly explained.</strong>
          <p>
            We show calculator assumptions, avoid invented prices and ratings, and encourage you to
            verify product instructions and local requirements.
          </p>
          <Link href="/editorial-policy">
            How we work <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
export const dynamic = "force-dynamic";
