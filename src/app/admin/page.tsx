import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string; updated?: string }> }) {
  const admin = await requireAdmin();
  const notice = await searchParams;
  const [total, published, drafts, categories, recent] = await Promise.all([
    db.content.count(), db.content.count({ where: { status: "PUBLISHED" } }),
    db.content.count({ where: { status: "DRAFT" } }), db.category.count(),
    db.content.findMany({ orderBy: { updatedAt: "desc" }, take: 6, select: { id: true, title: true, section: true, status: true, updatedAt: true } }),
  ]);
  return <AdminShell email={admin.email}>
    <div className="cms-heading"><div><p className="eyebrow">Fieldwork Home / Admin console</p><h1>Overview</h1><p>Your editorial workspace and connected data at a glance.</p></div><Link className="button button-primary" href="/admin/new">Create content</Link></div>
    {(notice.saved || notice.deleted || notice.updated) && <p role="status" className="admin-success">Content {notice.saved ? "saved" : notice.deleted ? "deleted" : "updated"} successfully.</p>}
    <div className="cms-stats"><div><span>Total resources</span><strong>{total}</strong><small>Database records</small></div><div><span>Published</span><strong>{published}</strong><small>Visible on the public site</small></div><div><span>Drafts</span><strong>{drafts}</strong><small>Private to editors</small></div><div><span>Categories</span><strong>{categories}</strong><small>Across editorial sections</small></div></div>
    <div className="cms-two"><section className="cms-panel"><div className="cms-panel-head"><div><h2>Recently edited</h2><p>Latest changes in the content library</p></div><Link href="/admin/content">View all →</Link></div><div className="cms-recent">{recent.map(item => <Link href={`/admin/edit/${item.id}`} key={item.id}><span><strong>{item.title}</strong><small>{item.section} · {item.status.toLowerCase()}</small></span><time>{item.updatedAt.toLocaleDateString("en-US")}</time></Link>)}</div></section><section className="cms-panel"><div className="cms-panel-head"><div><h2>Data connections</h2><p>Only verified sources appear as live</p></div></div><div className="cms-connection"><span>Google Analytics 4</span><b>{process.env.GA4_PROPERTY_ID && process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY ? "Configured · verification pending" : "Setup required"}</b></div><div className="cms-connection"><span>PageSpeed Insights</span><b>{process.env.PAGESPEED_API_KEY ? "Configured · test on demand" : "Setup required"}</b></div><div className="cms-connection"><span>Search Console</span><b>Setup required</b></div><Link href="/admin/settings" className="cms-text-link">Manage integrations →</Link></section></div>
  </AdminShell>;
}
