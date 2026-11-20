import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";

export default async function Page() {
  const admin = await requireAdmin();
  const bySection = await db.content.groupBy({ by: ["section", "status"], _count: { _all: true } });
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Editorial reporting</p><h1>Reports</h1><p>Database backed content inventory. Traffic reports require GA4.</p></div><Link className="button button-primary" href="/admin/reports/export">Export content CSV</Link></div><section className="cms-panel"><div className="cms-panel-head"><div><h2>Content by section</h2><p>Live database counts</p></div></div><div className="cms-table-scroll"><table className="cms-table"><thead><tr><th>Section</th><th>Status</th><th>Resources</th></tr></thead><tbody>{bySection.map(row => <tr key={`${row.section}-${row.status}`}><td>{row.section}</td><td>{row.status.toLowerCase()}</td><td>{row._count._all}</td></tr>)}</tbody></table></div></section><section className="cms-panel cms-setup"><h2>Audience reports</h2><p>Traffic, acquisition, device and geography reporting will use the connected GA4 property. No traffic figures are inferred from content inventory.</p><Link href="/admin/analytics">Open analytics →</Link></section></AdminShell>;
}
