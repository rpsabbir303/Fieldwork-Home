import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";

export default async function Page() {
  const admin = await requireAdmin();
  const items = await db.content.findMany({ where: { status: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, section: true, slug: true, seoTitle: true, seoDescription: true } });
  const missingTitle = items.filter(i => !i.seoTitle).length, missingDescription = items.filter(i => !i.seoDescription).length;
  const duplicateTitles = items.filter((i, index) => i.seoTitle && items.findIndex(other => other.seoTitle === i.seoTitle) !== index).length;
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Search visibility</p><h1>SEO audit</h1><p>Database metadata checks for published content. Search Console data is not connected.</p></div></div>
  <div className="cms-stats"><div><span>Published pages</span><strong>{items.length}</strong></div><div><span>Missing SEO title override</span><strong>{missingTitle}</strong><small>Public pages use the content title as fallback</small></div><div><span>Missing meta description override</span><strong>{missingDescription}</strong><small>Public pages use the summary as fallback</small></div><div><span>Duplicate SEO titles</span><strong>{duplicateTitles}</strong></div></div>
  <div className="cms-panel cms-table-scroll"><table className="cms-table"><thead><tr><th>Page</th><th>SEO title</th><th>Meta description</th><th>Audit</th></tr></thead><tbody>{items.map(i => <tr key={i.id}><td><strong>{i.title}</strong><small>/{i.section}/{i.slug}</small></td><td>{i.seoTitle || <em>Uses page title</em>}</td><td>{i.seoDescription || <em>Uses summary</em>}</td><td><Link href={`/admin/edit/${i.id}`}>Edit SEO</Link></td></tr>)}</tbody></table></div>
  </AdminShell>;
}
