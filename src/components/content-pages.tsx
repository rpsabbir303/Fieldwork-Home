import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ShieldAlert } from "lucide-react";
import { getCatalog, getContent } from "@/lib/catalog";
import {
  ContentItem,
  SectionKey,
  projectCategories,
  sectionInfo,
  sectionPath,
  slugify,
} from "@/lib/content";
import { Breadcrumbs, ContentCard, SectionHeading } from "./content-ui";
import { MaintenanceChecklist } from "./maintenance-checklist";
import { PrintButton } from "./print-button";
import { ArticleRichContent } from "./article-rich-content";

export async function Landing({
  section,
  activeCategory,
}: {
  section: SectionKey;
  activeCategory?: string;
}) {
  const allItems = await getCatalog(section);
  const info = sectionInfo[section];
  const categories = [...new Set(allItems.map((item) => item.category))].sort();
  const items =
    activeCategory && categories.includes(activeCategory)
      ? allItems.filter((item) => item.category === activeCategory)
      : allItems;
  return (
    <main>
      <div className="page-intro">
        <div className="container">
          <Breadcrumbs links={[{ label: "Home", href: "/" }, { label: info.label }]} />
          <p className="eyebrow">{info.label}</p>
          <h1>{info.title}</h1>
          <p className="lead">{info.intro}</p>
        </div>
      </div>
      <div className="container page-content">
        {section === "projects" && (
          <div className="category-strip">
            <strong>Browse by project</strong>
            <div>
              {projectCategories.map((category) => (
                <Link key={category} href={`/projects/category/${slugify(category)}`}>
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
        {section === "guides" && (
          <div className="category-strip">
            <strong>Browse by topic</strong>
            <div>
              <Link href="/guides">All topics</Link>
              {categories.map((category) => (
                <Link key={category} href={`/guides?category=${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}
        {section === "cost-guides" && (
          <div className="notice">
            <strong>Use your local numbers.</strong> Material prices and labor vary by location,
            product, and scope. These guides explain what to include; calculators accept your own
            prices.
          </div>
        )}
        {section === "design-ideas" && (
          <div className="notice">
            <strong>Visual collection in progress.</strong> The design directions below are
            text-first while original or licensed photography is prepared.
          </div>
        )}
        <SectionHeading
          kicker="Explore the library"
          title={section === "projects" ? "Start with a project" : "Featured resources"}
          intro={`${items.length} useful ${items.length === 1 ? "resource" : "resources"} to explore.`}
        />
        <div className="card-grid">
          {items.map((item) => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}

export async function Detail({ section, slug, previewItem }: { section: SectionKey; slug: string; previewItem?: ContentItem }) {
  const item = previewItem ?? await getContent(section, slug);
  if (!item) notFound();
  const all = await getCatalog();
  const related = (item.related ?? [])
    .map((href) => all.find((entry) => sectionPath(entry) === href))
    .filter((entry): entry is ContentItem => Boolean(entry));
  return (
    <main>
      <div className="detail-hero">
        <div className="container">
          <Breadcrumbs
            links={[
              { label: "Home", href: "/" },
              { label: sectionInfo[section].label, href: `/${section}` },
              { label: item.title },
            ]}
          />
          <p className="eyebrow">
            {item.category} · {sectionInfo[section].label}
          </p>
          <h1>{item.title}</h1>
          <p className="lead">{item.summary}</p>
          <div className="detail-meta">
            <span>{item.articleMeta?.author || "Fieldwork Home editorial"}</span>
            <span>
              {item.updatedAt
                ? `Updated ${new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(item.updatedAt))}`
                : "Starter resource · November 19, 2026"}
            </span>
          </div>
          {item.articleMeta?.tags?.length ? <div className="article-public-tags" aria-label="Article tags">{item.articleMeta.tags.map(tag => <span key={tag}>{tag}</span>)}</div> : null}
        </div>
      </div>
      <div className="container detail-layout">
        <article className="article-body">
          {item.articleMeta?.featuredImageUrl && <figure className="article-featured"><img src={item.articleMeta.featuredImageUrl} alt={item.articleMeta.featuredImageAlt} /><figcaption>{item.articleMeta.featuredImageAlt}</figcaption></figure>}
          {item.articleMeta?.introduction && <p className="article-introduction">{item.articleMeta.introduction}</p>}
          {(item.tools?.length || item.materials?.length) && (
            <div className="essentials-grid">
              {item.tools?.length ? (
                <div>
                  <h2>Tools</h2>
                  <ul>
                    {item.tools.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.materials?.length ? (
                <div>
                  <h2>Materials</h2>
                  <ul>
                    {item.materials.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
          {item.safety && (
            <aside className="safety-note">
              <ShieldAlert size={22} />
              <div>
                <strong>Safety and suitability</strong>
                <p>{item.safety}</p>
              </div>
            </aside>
          )}
          {item.richDoc && <ArticleRichContent document={item.richDoc} />}
          {item.blocks.map((block, i) => (
            <section key={i} className="article-section">
              <h2>{block.heading}</h2>
              {block.paragraphs?.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
              {block.bullets &&
                (section === "home-maintenance" && i === 0 ? (
                  <MaintenanceChecklist items={block.bullets} />
                ) : (
                  <ul>
                    {block.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ))}
            </section>
          ))}
          <div className="article-end">
            <p>
              Use this as a planning resource. Follow the instructions for the products you choose
              and check local requirements for regulated work.
            </p>
            <PrintButton />
          </div>
        </article>
        <aside className="detail-sidebar">
          <div className="sidebar-panel">
            <p className="eyebrow">Keep planning</p>
            <h3>Next useful steps</h3>
            {(item.related ?? []).map((href) => {
              const linked = all.find((entry) => sectionPath(entry) === href);
              const title =
                linked?.title ??
                (href.includes("calculators")
                  ? `${href.split("/").pop()} calculator`
                  : href.split("/").pop()?.replaceAll("-", " "));
              return (
                <Link key={href} href={href}>
                  {title}
                  <ArrowUpRight size={16} />
                </Link>
              );
            })}
          </div>
          <div className="sidebar-note">
            <Check size={20} />
            <p>Measure first. Compare product instructions. Confirm the scope before buying.</p>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <div className="container related-section">
          <SectionHeading kicker="Continue exploring" title="Related reading" />
          <div className="card-grid">
            {related.slice(0, 3).map((entry) => (
              <ContentCard key={entry.slug} item={entry} compact />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
