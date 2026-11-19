import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { sectionInfo, sectionPath } from "@/lib/content";
import { Breadcrumbs } from "@/components/content-ui";
import { SearchForm } from "@/components/search-form";
import { SearchEmptyEvent } from "@/components/search-empty-event";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search home improvement guides, projects, calculators, cost planning, and materials.",
  robots: { index: false, follow: true },
};
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100).toLowerCase();
  const catalog = await getCatalog();
  const calculators = [
    {
      title: "Paint calculator",
      summary: "Estimate room paint quantity and material subtotal.",
      href: "/calculators/paint",
      category: "Calculator",
    },
    {
      title: "Tile calculator",
      summary: "Estimate tile count, waste, and material subtotal.",
      href: "/calculators/tile",
      category: "Calculator",
    },
    {
      title: "Drywall calculator",
      summary: "Estimate drywall surface area and sheet count.",
      href: "/calculators/drywall",
      category: "Calculator",
    },
  ];
  const entries = [
    ...catalog.map((item) => ({
      title: item.title,
      summary: item.summary,
      href: sectionPath(item),
      category: sectionInfo[item.section].label,
    })),
    ...calculators,
  ];
  const results = query
    ? entries.filter((item) =>
        `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(query),
      )
    : [];
  return (
    <main>
      <div className="page-intro">
        <div className="container">
          <Breadcrumbs links={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <p className="eyebrow">Find your next step</p>
          <h1>Search Fieldwork Home</h1>
          <p className="lead">Find a project, calculator, cost guide, or practical answer.</p>
          <SearchForm query={q} />
        </div>
      </div>
      <div className="container page-content">
        <h2 className="results-title">
          {query
            ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${q.trim()}”`
            : "What are you planning?"}
        </h2>
        {query ? (
          results.length ? (
            <div className="search-results">
              {results.map((item) => (
                <Link href={item.href} key={item.href} className="search-result">
                  <span className="eyebrow">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <SearchEmptyEvent query={query} />
              <h2>No matching resources yet</h2>
              <p>Try a broader term, such as paint, tile, drywall, or budget.</p>
              <Link className="button button-primary" href="/projects">
                Browse projects
              </Link>
            </div>
          )
        ) : (
          <div className="topic-row">
            {["Paint", "Tile", "Drywall", "Budget", "Maintenance"].map((term) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
