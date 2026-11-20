import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

function csv(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
export async function GET() {
  if (!await getAdmin()) return new Response("Unauthorized", { status: 401 });
  const items = await db.content.findMany({ orderBy: { updatedAt: "desc" }, select: { title: true, section: true, slug: true, category: true, status: true, seoTitle: true, seoDescription: true, publishedAt: true, updatedAt: true } });
  const lines = [["title", "section", "slug", "category", "status", "seo_title", "seo_description", "published_at", "updated_at"].map(csv).join(","), ...items.map(item => [item.title, item.section, item.slug, item.category, item.status, item.seoTitle, item.seoDescription, item.publishedAt?.toISOString(), item.updatedAt.toISOString()].map(csv).join(","))];
  return new Response(`\uFEFF${lines.join("\r\n")}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=fieldwork-content.csv", "cache-control": "private, no-store" } });
}
