import Link from "next/link";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { isArticleBody } from "@/lib/article";
import { AdminShell } from "@/components/admin-shell";
import { AdminDelete } from "@/components/admin-delete";
import { duplicateArticleAction } from "../actions";
import { ArticleStatus } from "@/components/article-status";

const tabs = [["All articles", ""], ["Published", "PUBLISHED"], ["Drafts", "DRAFT"]] as const;
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; category?: string; sort?: string; page?: string; updated?: string; deleted?: string; error?: string }> }) {
  const admin = await requireAdmin(); const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const status = ["PUBLISHED", "DRAFT"].includes(params.status ?? "") ? params.status! : "";
  const category = typeof params.category === "string" ? params.category.trim().slice(0, 80) : "";
  const sort = ["updated", "published", "title"].includes(params.sort ?? "") ? params.sort! : "updated";
  const page = Math.max(1, Math.min(10000, Number(params.page) || 1));
  const where: Prisma.ContentWhereInput = { section: "guides", ...(status ? { status } : {}), ...(category ? { category } : {}), ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] } : {}) };
  const [items, count, published, drafts, categories] = await Promise.all([
    db.content.findMany({ where, orderBy: sort === "title" ? { title: "asc" } : sort === "published" ? { publishedAt: "desc" } : { updatedAt: "desc" }, skip: (page - 1) * 20, take: 20 }),
    db.content.count({ where }), db.content.count({ where: { section: "guides", status: "PUBLISHED" } }), db.content.count({ where: { section: "guides", status: "DRAFT" } }), db.content.findMany({ where: { section: "guides" }, distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } }),
  ]);
  const url = (nextStatus = status, nextPage = 1) => `/admin/articles?${new URLSearchParams({ q, status: nextStatus, category, sort, page: String(nextPage) })}`;
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Editorial workspace</p><h1>Articles</h1><p>{published} published Â· {drafts} drafts</p></div><Link href="/admin/articles/new" className="button button-primary">Write article</Link></div>
    {(params.updated || params.deleted) && <p role="status" className="admin-success">Article {params.deleted ? "deleted" : "status updated"}.</p>}
    {params.error && <p role="alert" className="admin-error">The article action could not be completed. Review the article fields and try again.</p>}
    <nav className="article-tabs" aria-label="Article status">{tabs.map(([label,value]) => <Link key={value} href={url(value)} className={status === value ? "active" : ""}>{label}</Link>)}</nav>
    <form className="cms-filters" action="/admin/articles"><input type="hidden" name="status" value={status}/><label>Search<input name="q" defaultValue={q} placeholder="Title or slug" /></label><label>Category<select name="category" defaultValue={category}><option value="">All categories</option>{categories.map(item => <option key={item.category} value={item.category}>{item.category}</option>)}</select></label><label>Sort<select name="sort" defaultValue={sort}><option value="updated">Recently updated</option><option value="published">Publish date</option><option value="title">Title A–Z</option></select></label><button className="button" type="submit">Apply</button></form>
    <div className="cms-panel cms-table-scroll"><table className="cms-table article-list"><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Published</th><th>Updated</th><th>SEO</th><th>Actions</th></tr></thead><tbody>{items.map(item => { const image = isArticleBody(item.body) ? item.body.meta.featuredImageUrl : ""; return <tr key={item.id}><td><div className="article-list-title">{image ? <img src={image} alt=""/> : <span className="article-no-image">No image</span>}<span><strong>{item.title}</strong><small>/guides/{item.slug}</small></span></div></td><td>{item.category}</td><td><span className={`cms-pill ${item.status === "PUBLISHED" ? "live" : ""}`}>{item.status.toLowerCase()}</span></td><td>{item.publishedAt?.toLocaleDateString("en-US") ?? "â€”"}</td><td>{item.updatedAt.toLocaleDateString("en-US")}</td><td>{item.seoTitle && item.seoDescription ? "Configured" : "Uses fallback"}</td><td><div className="article-row-actions"><Link href={`/admin/articles/edit/${item.id}`}>Edit</Link><Link href={`/admin/preview/${item.id}`}>Preview</Link><form action={duplicateArticleAction}><input type="hidden" name="id" value={item.id}/><button type="submit" className="admin-link">Duplicate</button></form><ArticleStatus id={item.id} title={item.title} published={item.status === "PUBLISHED"}/><AdminDelete id={item.id} title={item.title}/></div></td></tr>; })}</tbody></table>{!items.length && <p className="cms-empty">No articles match these filters.</p>}</div>
    <div className="cms-pagination"><span>{count} articles Â· Page {page} of {Math.max(1, Math.ceil(count / 20))}</span>{page > 1 && <Link href={url(status, page - 1)}>Previous</Link>}{page * 20 < count && <Link href={url(status, page + 1)}>Next</Link>}</div>
  </AdminShell>;
}

