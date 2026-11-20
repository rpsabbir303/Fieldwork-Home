import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
import { ga4Configured } from "@/lib/ga4";

export default async function Page() {
  const admin = await requireAdmin();
  const checks = [
    ["Database", Boolean(process.env.DATABASE_URL), "Neon PostgreSQL connection for published content and CMS edits."],
    ["Session signing", Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32), "A private 32+ character secret for admin sessions."],
    ["GA4 Data API", ga4Configured, "GA4_PROPERTY_ID, GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY. Grant the service account read access."],
    ["PageSpeed Insights", Boolean(process.env.PAGESPEED_API_KEY), "PAGESPEED_API_KEY plus public HTTPS NEXT_PUBLIC_SITE_URL."],
    ["Search Console", false, "Search Console API integration is planned but not connected."],
    ["Media uploads", false, "A persistent object storage provider is required."],
  ] as const;
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Administration</p><h1>Settings & integrations</h1><p>Configuration status only. Secrets are never displayed.</p></div></div><section className="cms-panel"><div className="cms-panel-head"><div><h2>Connections</h2><p>Configured means variables exist; live verification happens when the provider is queried.</p></div></div>{checks.map(([name, ready, detail]) => <div className="cms-setting" key={name}><span><strong>{name}</strong><small>{detail}</small></span><b className={`cms-pill ${ready ? "live" : ""}`}>{ready ? "Configured" : "Setup required"}</b></div>)}</section><section className="cms-panel cms-setup"><h2>Admin profile</h2><p>{admin.email}</p><p>Accounts are provisioned through the private one-time administrator command. There is no public registration.</p></section></AdminShell>;
}
