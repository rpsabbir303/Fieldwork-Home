import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";
import { ArticleEditor } from "@/components/article-editor";

export default async function Page() {
  const admin = await requireAdmin();
  const [categories, media] = await Promise.all([db.category.findMany({ where: { section: "guides" }, orderBy: { name: "asc" }, select: { name: true } }), db.mediaReference.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, url: true, alt: true } })]);
  return <AdminShell email={admin.email}><ArticleEditor categories={categories.map(c => c.name)} media={media} /></AdminShell>;
}
