import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
import { ga4Configured, runGa4Report, analyticsDates } from "@/lib/ga4";

const metrics = ["totalUsers", "newUsers", "sessions", "screenPageViews", "engagementRate", "averageSessionDuration"];
const labels = ["Users", "New users", "Sessions", "Page views", "Engagement rate", "Avg. session duration"];
export default async function Page({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const admin = await requireAdmin();
  const { period = "30d" } = await searchParams;
  const dates = analyticsDates(period);
  let rows: string[] | null = null; let error = ""; let timezone = "GA4 property timezone";
  if (ga4Configured) try {
    const report = await runGa4Report([], metrics, dates.startDate, dates.endDate, 1);
    rows = report.rows?.[0]?.metricValues?.map(v => v.value) ?? null;
    timezone = report.metadata?.timeZone ?? timezone;
  } catch (cause) { error = cause instanceof Error ? cause.message : "GA4 data could not be loaded."; }
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Audience insights</p><h1>Analytics overview</h1><p>Google Analytics 4 · {dates.startDate} to {dates.endDate} · {timezone}</p></div><form action="/admin/analytics"><label className="cms-period">Period<select name="period" defaultValue={period}>{[["today","Today"],["7d","Last 7 days"],["14d","Last 14 days"],["30d","Last 30 days"],["90d","Last 90 days"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label><button className="button" type="submit">Apply</button></form></div>
  {!ga4Configured ? <div className="cms-panel cms-setup"><h2>Connect Google Analytics 4</h2><p>Set the GA4 property ID and service account credentials on the admin deployment. Grant the service account read access to the property. No visitor metrics are available yet.</p><Link href="/admin/settings">View setup requirements →</Link></div> : error ? <div className="admin-error" role="alert">{error}</div> : rows ? <><div className="cms-stats cms-stats-six">{rows.map((value, i) => <div key={metrics[i]}><span>{labels[i]}</span><strong>{i === 4 ? `${(Number(value)*100).toFixed(1)}%` : i === 5 ? `${Math.round(Number(value))}s` : Number(value).toLocaleString("en-US")}</strong><small>Source: GA4 · refreshed within 15 min</small></div>)}</div><div className="cms-panel cms-setup"><h2>Explore more</h2><p>Inspect traffic for individual pages and content.</p><Link href="/admin/analytics/pages">Open page analytics →</Link></div></> : <div className="cms-panel cms-setup"><h2>No analytics data for this period</h2><p>The connected property returned no rows.</p></div>}
  </AdminShell>;
}
