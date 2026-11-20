import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { articleInput, safeContentUrl, validateRichDoc, type ArticleBody } from "@/lib/article";
import { slugify } from "@/lib/content";

function issue(message: string, status: number) { return Response.json({ error: message }, { status, headers: { "cache-control": "no-store" } }); }
export async function POST(request: Request) {
  if (!await getAdmin()) return issue("Unauthorized", 401);
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try { if (!origin || !host || new URL(origin).host !== host) return issue("Request origin was not accepted.", 403); }
  catch { return issue("Request origin was not accepted.", 403); }
  if (Number(request.headers.get("content-length") ?? 0) > 120_000) return issue("Article exceeds the size limit.", 413);
  let raw: unknown;
  try { const body = await request.text(); if (body.length > 120_000) return issue("Article exceeds the size limit.", 413); raw = JSON.parse(body); } catch { return issue("Invalid article payload.", 400); }
  const parsed = articleInput.safeParse(raw);
  if (!parsed.success) return issue("Check the article fields, slug, and image information.", 422);
  const data = parsed.data;
  const document = validateRichDoc(data.richDoc);
  if (!document.ok) return issue(document.error, 422);
  if (data.intent === "publish" && (data.title.length < 3 || data.summary.length < 20 || document.text.length < 30)) return issue("Publishing requires a title, an excerpt of at least 20 characters, and at least 30 characters of article text.", 422);
  if (data.featuredImageUrl && (!safeContentUrl(data.featuredImageUrl) || !data.featuredImageAlt)) return issue("Featured images need a safe URL and alt text.", 422);
  if (data.ogImage && !safeContentUrl(data.ogImage)) return issue("Open Graph image URL is invalid.", 422);
  if (data.canonicalUrl) {
    if (!safeContentUrl(data.canonicalUrl)) return issue("Canonical URL is invalid.", 422);
    if (!data.canonicalUrl.startsWith("/")) {
      const site = process.env.NEXT_PUBLIC_SITE_URL;
      if (!site || new URL(data.canonicalUrl).origin !== new URL(site).origin) return issue("Canonical URL must point to this public site.", 422);
    }
  }
  const related = data.related.filter(path => path.startsWith("/") && safeContentUrl(path));
  const categorySlug = `guides-${slugify(data.category)}`;
  const status = data.intent === "publish" ? "PUBLISHED" : "DRAFT";
  const body: ArticleBody = {
    version: 2,
    content: data.richDoc as ArticleBody["content"],
    meta: {
      introduction: data.introduction, author: data.author, tags: [...new Set(data.tags)],
      featuredImageUrl: data.featuredImageUrl, featuredImageAlt: data.featuredImageAlt,
      canonicalUrl: data.canonicalUrl, ogTitle: data.ogTitle, ogDescription: data.ogDescription,
      ogImage: data.ogImage, noindex: data.noindex,
    },
  };
  try {
    const result = await db.$transaction(async tx => {
      const duplicate = await tx.content.findFirst({ where: { section: "guides", slug: data.slug, ...(data.id ? { id: { not: data.id } } : {}) }, select: { id: true } });
      if (duplicate) return { error: "This slug is already used by another article.", status: 409 } as const;
      const old = data.id ? await tx.content.findUnique({ where: { id: data.id }, select: { id: true, section: true, slug: true, status: true, publishedAt: true, updatedAt: true } }) : null;
      if (data.id && (!old || old.section !== "guides")) return { error: "Article was not found.", status: 404 } as const;
      if (old && (!data.expectedUpdatedAt || old.updatedAt.toISOString() !== data.expectedUpdatedAt)) return { error: "This article changed in another tab. Reload before saving to avoid overwriting newer changes.", status: 409 } as const;
      const category = await tx.category.upsert({ where: { slug: categorySlug }, update: {}, create: { slug: categorySlug, name: data.category, section: "guides" } });
      const payload = {
        section: "guides", slug: data.slug, title: data.title, summary: data.summary,
        category: category.name, categoryId: category.id, body: body as unknown as Prisma.InputJsonValue,
        related: related as Prisma.InputJsonValue, seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null, status,
        publishedAt: status === "PUBLISHED" ? (old?.publishedAt ?? new Date()) : null,
      };
      let saved;
      if (old) {
        const updatedAt = new Date(Math.max(Date.now(), old.updatedAt.getTime() + 1));
        const updated = await tx.content.updateMany({ where: { id: old.id, updatedAt: old.updatedAt }, data: { ...payload, updatedAt } });
        if (!updated.count) return { error: "This article changed in another tab. Reload before saving.", status: 409 } as const;
        saved = await tx.content.findUniqueOrThrow({ where: { id: old.id } });
      } else saved = await tx.content.create({ data: { ...payload, tools: [], materials: [], safety: null } });
      return { saved, old };
    });
    if ("error" in result && result.error) return issue(result.error, result.status ?? 409);
    revalidatePath("/guides"); revalidatePath(`/guides/${result.saved.slug}`);
    if (result.old?.slug && result.old.slug !== result.saved.slug) revalidatePath(`/guides/${result.old.slug}`);
    revalidatePath("/search"); revalidatePath("/admin/articles"); revalidatePath("/admin/content"); revalidatePath("/admin");
    return Response.json({ id: result.saved.id, status: result.saved.status, updatedAt: result.saved.updatedAt.toISOString(), publishedAt: result.saved.publishedAt?.toISOString() ?? null }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return issue("This slug is already used by another article.", 409);
    console.error("Article save failed", error);
    return issue("The article could not be saved. Please try again.", 500);
  }
}
