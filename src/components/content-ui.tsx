import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  ClipboardList,
  Layers,
  Paintbrush,
  Ruler,
  Wrench,
} from "lucide-react";
import { ContentItem, sectionInfo, sectionPath } from "@/lib/content";
import { TrackedLink } from "./tracked-link";

const tones: Record<string, string> = {
  Painting: "paint",
  Tile: "tile",
  "Walls & Drywall": "drywall",
  Kitchen: "kitchen",
  Bathroom: "bath",
  Spring: "spring",
  Summer: "summer",
  Fall: "fall",
  Winter: "winter",
};
export function Breadcrumbs({ links }: { links: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {links.map((link, i) => (
        <span key={i}>
          {i > 0 && (
            <span aria-hidden="true" className="crumb-sep">
              /
            </span>
          )}
          {link.href ? (
            <Link href={link.href}>{link.label}</Link>
          ) : (
            <span aria-current="page">{link.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function SectionHeading({
  kicker,
  title,
  intro,
  action,
}: {
  kicker: string;
  title: string;
  intro?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {action && (
        <Link className="text-link" href={action.href}>
          {action.label}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function ContentCard({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
  return (
    <TrackedLink className={`content-card ${compact ? "compact" : ""}`} href={sectionPath(item)}>
      <div className={`card-art ${tones[item.category] ?? "neutral"}`} aria-hidden="true">
        <div className="art-grid" />
        <div className="art-shape one" />
        <div className="art-shape two" />
      </div>
      <div className="card-copy">
        <span className="card-kicker">
          {item.category} <span>·</span> {sectionInfo[item.section].label}
        </span>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <span className="card-link">
          Explore resource <ArrowUpRight size={16} />
        </span>
      </div>
    </TrackedLink>
  );
}
export const calculatorCards = [
  {
    slug: "paint",
    title: "Paint calculator",
    summary: "Estimate wall area, coats, gallons, and a price-based subtotal.",
    icon: Paintbrush,
    tag: "Painting",
  },
  {
    slug: "tile",
    title: "Tile calculator",
    summary: "Plan area, tile count, cuts, waste, and your material subtotal.",
    icon: Layers,
    tag: "Tile & flooring",
  },
  {
    slug: "drywall",
    title: "Drywall calculator",
    summary: "Measure wall and ceiling surface, openings, sheet sizes, and waste.",
    icon: Ruler,
    tag: "Walls & ceilings",
  },
];
export function CalculatorCard({ card }: { card: (typeof calculatorCards)[number] }) {
  const Icon = card.icon;
  return (
    <Link href={`/calculators/${card.slug}`} className="calculator-card">
      <div className="calculator-icon">
        <Icon size={26} />
      </div>
      <div>
        <span className="card-kicker">{card.tag}</span>
        <h3>{card.title}</h3>
        <p>{card.summary}</p>
      </div>
      <ArrowUpRight className="calculator-arrow" size={20} />
    </Link>
  );
}
export const discoveryPaths = [
  {
    title: "Calculate materials",
    body: "Get a dependable starting quantity before you shop.",
    href: "/calculators",
    icon: Calculator,
  },
  {
    title: "Follow a project",
    body: "See the work in sequence, from prep to final check.",
    href: "/projects",
    icon: Wrench,
  },
  {
    title: "Plan your budget",
    body: "Understand the pieces of a realistic project cost.",
    href: "/cost-guides",
    icon: ClipboardList,
  },
  {
    title: "Learn the essentials",
    body: "Make informed choices on methods and materials.",
    href: "/guides",
    icon: BookOpen,
  },
];
