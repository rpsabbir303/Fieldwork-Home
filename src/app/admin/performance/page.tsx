import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sectionPath, type SectionKey } from "@/lib/content";
import { AdminShell } from "@/components/admin-shell";

type Audit = { lighthouseResult?: { categories?: { performance?: { score?: number } }; audits?: Record<string, { numericValue?: number; displayValue?: string }> }; loadingExperience?: { metrics?: Record<string, { percentile?: number }> } };
function metric(audit: Audit, key: string) { return audit.lighthouseResult?.audits?.[key]?.displayValue ?? "Unavailable"; }
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string; device?: string; run?: string }> }) {
  const admin = await requireAdmin(); const params = await searchParams;
  const items = await db.content.findMany({ where: { status: "PUBLISHED" }, orderBy: { title: "asc" }, select: { id: true, title: true, section: true, slug: true } });
  const selected = items.find(i => i.id === params.id); const device = params.device === "desktop" ? "desktop" : "mobile";
  const origin = process.env.NEXT_PUBLIC_SITE_URL; let audit: Audit | null = null; let error = ""; let testedAt = "";
  if (params.run === "1" && selected) {
    if (!process.env.PAGESPEED_API_KEY || !origin || !origin.startsWith("https://")) error = "Configure PAGESPEED_API_KEY and a public HTTPS NEXT_PUBLIC_SITE_URL before testing.";
    else try {
      const pageUrl = new URL(sectionPath({ section: selected.section as SectionKey, slug: selected.slug }), origin).toString();
      const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
      api.searchParams.set("url", pageUrl); api.searchParams.set("strategy", device); api.searchParams.set("category", "PERFORMANCE"); api.searchParams.set("key", process.env.PAGESPEED_API_KEY);
      const response = await fetch(api, { next: { revalidate: 3600 } });
      if (!response.ok) throw new Error(`PageSpeed Insights returned ${response.status}.`);
      audit = await response.json() as Audit; testedAt = new Date().toISOString();
    } catch (cause) { error = cause instanceof Error ? cause.message : "PageSpeed test failed."; }
  }
  return <AdminShell email={admin.email}><div className="cms-heading"><div><p className="eyebrow">Site quality</p><h1>Performance & speed</h1><p>Run a real Google PageSpeed Insights test on a published page.</p></div></div>
    <div className="cms-panel cms-form-panel"><h2>Run performance test</h2><form action="/admin/performance" className="cms-filters"><input type="hidden" name="run" value="1"/><label>Published page<select name="id" required defaultValue={selected?.id ?? ""}><option value="">Select a page</option>{items.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}</select></label><label>Device<select name="device" defaultValue={device}><option value="mobile">Mobile</option><option value="desktop">Desktop</option></select></label><button className="button button-primary" type="submit" disabled={!items.length}>Run performance test</button></form><p className="cms-muted">Results are cached for one hour. Historical storage and batch testing are not configured.</p></div>
    {!process.env.PAGESPEED_API_KEY && <div className="cms-panel cms-setup"><h2>PageSpeed API key required</h2><p>Set PAGESPEED_API_KEY only on the admin deployment. Tests use the configured public site origin and published CMS pages.</p></div>}
    {error && <div className="admin-error" role="alert">{error}</div>}
    {audit && <section className="cms-panel cms-audit"><div><span>Performance score</span><strong>{audit.lighthouseResult?.categories?.performance?.score === undefined ? "Unavailable" : Math.round(audit.lighthouseResult.categories.performance.score * 100)}</strong><small>{device} · tested {testedAt} · Lighthouse lab data</small></div><dl><div><dt>Largest Contentful Paint</dt><dd>{metric(audit, "largest-contentful-paint")}</dd></div><div><dt>First Contentful Paint</dt><dd>{metric(audit, "first-contentful-paint")}</dd></div><div><dt>Cumulative Layout Shift</dt><dd>{metric(audit, "cumulative-layout-shift")}</dd></div><div><dt>Total Blocking Time</dt><dd>{metric(audit, "total-blocking-time")}</dd></div><div><dt>Interaction to Next Paint</dt><dd>{audit.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile ? `${audit.loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile} ms (field)` : "Field data unavailable"}</dd></div></dl></section>}
  </AdminShell>;
}
