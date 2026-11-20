import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin-shell";
import { ArticleEditor } from "@/components/article-editor";
import { isArticleBody, legacyToRich, emptyArticleMeta } from "@/lib/article";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(); const { id } = await params;
  const [record, categories, media] = await Promise.all([
    db.content.findUnique({ where: { id } }),
    db.category.findMany({ where: { section: "guides" }, orderBy: { name: "asc" }, select: { name: true } }),
    db.mediaReference.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, url: true, alt: true } }),
  ]);
  if (!record || record.section !== "guides") notFound();
  const body = isArticleBody(record.body) ? record.body : null;
  return <AdminShell email={admin.email}><ArticleEditor categories={categories.map(c => c.name)} media={media} initial={{
    id: record.id, title: record.title, slug: record.slug, summary: record.summary, category: record.category,
    status: record.status, updatedAt: record.updatedAt.toISOString(), publishedAt: record.publishedAt?.toISOString() ?? null,
    seoTitle: record.seoTitle ?? "", seoDescription: record.seoDescription ?? "",
    richDoc: legacyToRich(record.body), meta: { ...emptyArticleMeta, ...(body?.meta ?? {}) },
    related: Array.isArray(record.related) ? record.related.filter((x): x is string => typeof x === "string") : [],
  }} /></AdminShell>;
}
