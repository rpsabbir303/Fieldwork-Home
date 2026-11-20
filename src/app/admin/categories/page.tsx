import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";
import { saveCategoryAction, deleteCategoryAction } from "../actions";
import { sectionInfo, type SectionKey } from "@/lib/content";

const sections: SectionKey[] = ["guides", "projects", "cost-guides", "materials-tools", "design-ideas", "home-maintenance"];
export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; deleted?: string }> }) {
  const admin = await requireAdmin();
  const message = await searchParams;
  const categories = await db.category.findMany({ include: { _count: { select: { contents: true } } }, orderBy: [{ section: "asc" }, { name: "asc" }] });
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Taxonomy</p><h1>Categories</h1><p>Organize content while preserving existing assignments.</p></div></div>
  {message.error && <p className="admin-error" role="alert">{({ validation: "Enter a valid category name and section.", duplicate: "That category already exists.", missing: "Category was not found.", section: "Move content before changing its category section.", "in-use": "This category still has content assigned to it." } as Record<string,string>)[message.error] ?? "Could not complete the request."}</p>}
  {(message.saved || message.deleted) && <p className="admin-success" role="status">Category {message.saved ? "saved" : "deleted"}.</p>}
  <section className="cms-panel cms-form-panel"><h2>Add category</h2><form action={saveCategoryAction} className="cms-filters"><label>Name<input name="name" required minLength={2} maxLength={80} /></label><label>Section<select name="section">{sections.map(s => <option key={s} value={s}>{sectionInfo[s].label}</option>)}</select></label><button className="button button-primary" type="submit">Add category</button></form></section>
  <div className="cms-panel cms-table-scroll"><table className="cms-table"><thead><tr><th>Name / slug</th><th>Section</th><th>Content</th><th>Actions</th></tr></thead><tbody>{categories.map(c => <tr key={c.id}><td><strong>{c.name}</strong><small>{c.slug}</small></td><td>{sectionInfo[c.section as SectionKey]?.label ?? c.section}</td><td>{c._count.contents}</td><td><details><summary>Edit</summary><form action={saveCategoryAction} className="cms-inline-form"><input type="hidden" name="id" value={c.id}/><input name="name" aria-label={`Name for ${c.name}`} defaultValue={c.name} required/><select name="section" aria-label={`Section for ${c.name}`} defaultValue={c.section}>{sections.map(s => <option key={s} value={s}>{sectionInfo[s].label}</option>)}</select><button type="submit">Save</button></form></details>{c._count.contents === 0 && <form action={deleteCategoryAction}><input type="hidden" name="id" value={c.id}/><button className="admin-link danger" type="submit">Delete empty category</button></form>}</td></tr>)}</tbody></table></div>
  </AdminShell>;
}
