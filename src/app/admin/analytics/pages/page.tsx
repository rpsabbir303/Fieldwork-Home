import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
import { ga4Configured, runGa4Report, analyticsDates, type GaRow } from "@/lib/ga4";

export default async function Page({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const admin = await requireAdmin(); const { period = "30d" } = await searchParams; const dates = analyticsDates(period);
  let rows: GaRow[] = []; let error = ""; let timezone = "GA4 property timezone";
  if (ga4Configured) try { const result = await runGa4Report(["pagePath", "pageTitle"], ["screenPageViews", "totalUsers", "sessions", "engagementRate"], dates.startDate, dates.endDate, 250); rows = result.rows ?? []; timezone = result.metadata?.timeZone ?? timezone; } catch (cause) { error = cause instanceof Error ? cause.message : "Could not load page analytics."; }
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Audience insights</p><h1>Page analytics</h1><p>Real page activity from GA4 · {dates.startDate} to {dates.endDate} · {timezone}</p></div><form action="/admin/analytics/pages"><label className="cms-period">Period<select name="period" defaultValue={period}>{[["7d","Last 7 days"],["14d","Last 14 days"],["30d","Last 30 days"],["90d","Last 90 days"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label><button type="submit" className="button">Apply</button></form></div>
  {!ga4Configured ? <div className="cms-panel cms-setup"><h2>GA4 connection required</h2><p>Configure a GA4 property and service account to view page traffic.</p><Link href="/admin/settings">Setup details →</Link></div> : error ? <div role="alert" className="admin-error">{error}</div> : <div className="cms-panel cms-table-scroll"><table className="cms-table"><thead><tr><th>Page</th><th>Views</th><th>Users</th><th>Sessions</th><th>Engagement</th></tr></thead><tbody>{rows.map((row, i) => <tr key={i}><td><strong>{row.dimensionValues?.[1]?.value || "Untitled"}</strong><small>{row.dimensionValues?.[0]?.value || "—"}</small></td><td>{Number(row.metricValues?.[0]?.value ?? 0).toLocaleString("en-US")}</td><td>{Number(row.metricValues?.[1]?.value ?? 0).toLocaleString("en-US")}</td><td>{Number(row.metricValues?.[2]?.value ?? 0).toLocaleString("en-US")}</td><td>{(Number(row.metricValues?.[3]?.value ?? 0)*100).toFixed(1)}%</td></tr>)}</tbody></table>{!rows.length && <p className="cms-empty">No page activity was returned for this period.</p>}</div>}
  </AdminShell>;
}
