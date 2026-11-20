import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const groups = [
  { label: "Workspace", links: [["Overview", "/admin"], ["Articles", "/admin/articles"], ["All content", "/admin/content"], ["New content", "/admin/new"]] },
  { label: "Insights", links: [["Analytics", "/admin/analytics"], ["Page analytics", "/admin/analytics/pages"], ["Performance", "/admin/performance"], ["SEO audit", "/admin/seo"]] },
  { label: "Manage", links: [["Categories", "/admin/categories"], ["Reports", "/admin/reports"], ["Settings", "/admin/settings"]] },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  return <div className="cms-shell">
    <aside className="cms-sidebar">
      <Link href="/admin" className="cms-brand"><span>F</span><span>FIELDWORK <b>HOME</b><small>ADMIN CONSOLE</small></span></Link>
      <nav aria-label="Admin navigation">{groups.map(group => <div key={group.label} className="cms-nav-group"><p>{group.label}</p>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}</nav>
      <div className="cms-sidebar-foot"><span>{email}</span><form action={logoutAction}><button type="submit">Sign out</button></form></div>
    </aside>
    <div className="cms-content"><header className="cms-mobile-bar"><Link href="/admin">Fieldwork Home Admin</Link><details><summary>Menu</summary><nav>{groups.flatMap(group => group.links).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></details></header><div className="cms-main">{children}</div></div>
  </div>;
}
