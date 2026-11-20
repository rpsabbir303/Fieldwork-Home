import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sectionInfo, sectionPath, type SectionKey } from "@/lib/content";
import { AdminShell } from "@/components/admin-shell";

const types = ["guides", "projects", "cost-guides", "materials-tools", "design-ideas", "home-maintenance"];
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; status?: string; page?: string }> }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const type = types.includes(params.type ?? "") ? params.type : "";
  const status = ["DRAFT", "PUBLISHED"].includes(params.status ?? "") ? params.status : "";
  const page = Math.max(1, Math.min(10000, Number(params.page) || 1));
  const where = { ...(type ? { section: type } : {}), ...(status ? { status } : {}), ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q, mode: "insensitive" as const } }] } : {}) };
  const [items, count] = await Promise.all([db.content.findMany({ where, orderBy: { updatedAt: "desc" }, skip: (page - 1) * 25, take: 25 }), db.content.count({ where })]);
  const query = (next: number) => `/admin/content?${new URLSearchParams({ q, type: type ?? "", status: status ?? "", page: String(next) })}`;
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Editorial library</p><h1>All content</h1><p>Manage every published and draft resource from one place.</p></div><Link className="button button-primary" href="/admin/new">Create content</Link></div>
    <form className="cms-filters" action="/admin/content"><label>Search<input name="q" defaultValue={q} placeholder="Title or URL slug" /></label><label>Type<select name="type" defaultValue={type}><option value="">All types</option>{types.map(t => <option value={t} key={t}>{sectionInfo[t as SectionKey].label}</option>)}</select></label><label>Status<select name="status" defaultValue={status}><option value="">All statuses</option><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select></label><button className="button" type="submit">Apply filters</button></form>
    <div className="cms-panel cms-table-scroll"><table className="cms-table"><thead><tr><th>Content</th><th>Type</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td><strong>{item.title}</strong><small>/{item.section}/{item.slug}</small></td><td>{sectionInfo[item.section as SectionKey]?.label ?? item.section}</td><td>{item.category}</td><td><span className={`cms-pill ${item.status === "PUBLISHED" ? "live" : ""}`}>{item.status.toLowerCase()}</span></td><td>{item.updatedAt.toLocaleDateString("en-US")}</td><td><Link href={`/admin/edit/${item.id}`}>Edit</Link>{item.status === "PUBLISHED" && <Link href={sectionPath({ section: item.section as SectionKey, slug: item.slug })}>View</Link>}</td></tr>)}</tbody></table>{!items.length && <p className="cms-empty">No content matches these filters.</p>}</div><div className="cms-pagination"><span>{count} resources · Page {page} of {Math.max(1, Math.ceil(count / 25))}</span>{page > 1 && <Link href={query(page - 1)}>Previous</Link>}{page * 25 < count && <Link href={query(page + 1)}>Next</Link>}</div>
  </AdminShell>;
}
