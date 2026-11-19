import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import { projectCategories, slugify } from "@/lib/content";
import { Breadcrumbs, ContentCard, SectionHeading } from "@/components/content-ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = projectCategories.find((name) => slugify(name) === slug);
  return {
    title: category ? `${category} projects` : "Project category",
    description: category ? `Explore practical ${category.toLowerCase()} projects.` : undefined,
  };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = projectCategories.find((name) => slugify(name) === slug);
  if (!category) notFound();
  const items = (await getCatalog("projects")).filter((item) => item.category === category);
  return (
    <main>
      <div className="page-intro">
        <div className="container">
          <Breadcrumbs
            links={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: category },
            ]}
          />
          <p className="eyebrow">Project category</p>
          <h1>{category}</h1>
          <p className="lead">
            Practical projects and planning resources for {category.toLowerCase()}.
          </p>
        </div>
      </div>
      <div className="container page-content">
        {items.length ? (
          <>
            <SectionHeading kicker="Available now" title="Project guides" />
            <div className="card-grid">
              {items.map((item) => (
                <ContentCard key={item.slug} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>More projects are being prepared</h2>
            <p>Explore the related guides and calculators while this category grows.</p>
            <Link className="button button-primary" href="/guides">
              Browse guides
            </Link>
          </div>
        )}
        <div className="category-strip">
          <strong>Other project areas</strong>
          <div>
            {projectCategories
              .filter((name) => name !== category)
              .map((name) => (
                <Link key={name} href={`/projects/category/${slugify(name)}`}>
                  {name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
