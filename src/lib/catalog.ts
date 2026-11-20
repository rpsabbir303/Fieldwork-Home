import { db, databaseConfigured } from "./db";
import { ContentItem, SectionKey, starterContent } from "./content";
import { isArticleBody } from "./article";

export function fromRecord(record: {
  section: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  body: unknown;
  related: unknown;
  tools: unknown;
  materials: unknown;
  safety: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: Date;
}): ContentItem {
  return {
    section: record.section as SectionKey,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    category: record.category,
    blocks: Array.isArray(record.body) ? (record.body as ContentItem["blocks"]) : [],
    richDoc: isArticleBody(record.body) ? record.body.content : undefined,
    articleMeta: isArticleBody(record.body) ? record.body.meta : undefined,
    related: Array.isArray(record.related) ? (record.related as string[]) : [],
    tools: Array.isArray(record.tools) ? (record.tools as string[]) : [],
    materials: Array.isArray(record.materials) ? (record.materials as string[]) : [],
    safety: record.safety ?? undefined,
    seoTitle: record.seoTitle ?? undefined,
    seoDescription: record.seoDescription ?? undefined,
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getCatalog(section?: SectionKey): Promise<ContentItem[]> {
  const initial = starterContent.filter((item) => !section || item.section === section);
  if (!databaseConfigured) return initial;
  try {
    const records = await db.content.findMany({
      where: { status: "PUBLISHED", ...(section ? { section } : {}) },
      orderBy: { updatedAt: "desc" },
    });
    return records.map(fromRecord);
  } catch (error) {
    console.error("Could not load published CMS content", error);
    throw new Error("Published content is temporarily unavailable.");
  }
}

export async function getContent(section: SectionKey, slug: string) {
  const items = await getCatalog(section);
  return items.find((item) => item.slug === slug);
}
