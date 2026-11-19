import type { Content } from "@prisma/client";
import Link from "next/link";
import { saveContentAction } from "@/app/admin/actions";
import { SectionKey, sectionPath } from "@/lib/content";

const sections: { value: SectionKey; label: string }[] = [
  { value: "guides", label: "Guide / article" },
  { value: "projects", label: "Project guide" },
  { value: "cost-guides", label: "Cost guide" },
  { value: "materials-tools", label: "Material comparison" },
  { value: "home-maintenance", label: "Maintenance" },
  { value: "design-ideas", label: "Design idea" },
];
function lines(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").join("\n")
    : "";
}
function bodyText(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const b = block as { heading?: string; paragraphs?: string[]; bullets?: string[] };
      return [
        `## ${b.heading || "Details"}`,
        ...(b.paragraphs ?? []),
        ...(b.bullets ?? []).map((item) => `- ${item}`),
      ].join("\n");
    })
    .join("\n\n");
}
export function AdminEditor({ item, error }: { item?: Content | null; error?: string }) {
  return (
    <div className="admin-editor">
      <div className="admin-editor-top">
        <div>
          <p className="eyebrow">Editorial workspace</p>
          <h1>{item ? "Edit resource" : "New resource"}</h1>
          <p>
            Write clear, practical information. Published entries appear in search and their
            section.
          </p>
        </div>
        <Link className="text-link" href="/admin">
          Back to dashboard
        </Link>
      </div>
      {error && (
        <div className="admin-error" role="alert">
          {error === "validation"
            ? "Check required fields, the slug, and body text."
            : "Could not save. The slug may already be in use for this section."}
        </div>
      )}
      <form action={saveContentAction} className="editor-form">
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <div className="editor-grid">
          <div className="editor-main">
            <div className="editor-panel">
              <h2>Core content</h2>
              <div className="editor-fields">
                <label>
                  Title
                  <input
                    name="title"
                    required
                    minLength={3}
                    maxLength={160}
                    defaultValue={item?.title ?? ""}
                  />
                </label>
                <label>
                  URL slug
                  <input
                    name="slug"
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    defaultValue={item?.slug ?? ""}
                    placeholder="example-project-guide"
                  />
                  <small>Lowercase letters, numbers, and hyphens.</small>
                </label>
                <label>
                  Summary
                  <textarea
                    name="summary"
                    required
                    minLength={20}
                    maxLength={500}
                    rows={3}
                    defaultValue={item?.summary ?? ""}
                  />
                </label>
                <label>
                  Body
                  <textarea
                    name="body"
                    required
                    minLength={30}
                    rows={18}
                    defaultValue={bodyText(item?.body)}
                    placeholder={
                      "## Before you start\nExplain the project...\n- First step\n- Second step\n\n## Finish\nDescribe the final check..."
                    }
                  />
                  <small>
                    Use “## Heading” for sections and “- ” for list items. Each remaining line
                    becomes a paragraph.
                  </small>
                </label>
              </div>
            </div>
            <div className="editor-panel">
              <h2>Project details</h2>
              <div className="editor-fields">
                <label>
                  Tools, one per line
                  <textarea name="tools" rows={5} defaultValue={lines(item?.tools)} />
                </label>
                <label>
                  Materials, one per line
                  <textarea name="materials" rows={5} defaultValue={lines(item?.materials)} />
                </label>
                <label>
                  Safety note
                  <textarea name="safety" rows={4} defaultValue={item?.safety ?? ""} />
                </label>
                <label>
                  Related internal paths, one per line
                  <textarea
                    name="related"
                    rows={5}
                    defaultValue={lines(item?.related)}
                    placeholder="/calculators/paint"
                  />
                </label>
              </div>
            </div>
          </div>
          <aside className="editor-side">
            <div className="editor-panel">
              <h2>Organization</h2>
              <div className="editor-fields">
                <label>
                  Content type
                  <select name="section" defaultValue={item?.section ?? "guides"}>
                    {sections.map((section) => (
                      <option key={section.value} value={section.value}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Category
                  <input
                    name="category"
                    required
                    defaultValue={item?.category ?? ""}
                    placeholder="Painting"
                  />
                </label>
                <label>
                  Publishing status
                  <select name="status" defaultValue={item?.status ?? "DRAFT"}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="editor-panel">
              <h2>Search appearance</h2>
              <div className="editor-fields">
                <label>
                  SEO title
                  <input
                    name="seoTitle"
                    maxLength={160}
                    defaultValue={item?.seoTitle ?? ""}
                    placeholder="Optional override"
                  />
                </label>
                <label>
                  SEO description
                  <textarea
                    name="seoDescription"
                    rows={4}
                    maxLength={300}
                    defaultValue={item?.seoDescription ?? ""}
                    placeholder="Optional override"
                  />
                </label>
              </div>
            </div>
            <button className="button button-primary editor-save" type="submit">
              Save resource
            </button>
            {item?.status === "PUBLISHED" && (
              <Link
                className="text-link"
                href={sectionPath({ section: item.section as SectionKey, slug: item.slug })}
              >
                View published page
              </Link>
            )}
          </aside>
        </div>
      </form>
    </div>
  );
}
