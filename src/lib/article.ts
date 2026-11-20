import { z } from "zod";

export type RichNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: RichNode[];
};
export type ArticleMeta = {
  introduction: string;
  author: string;
  tags: string[];
  featuredImageUrl: string;
  featuredImageAlt: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noindex: boolean;
};
export type ArticleBody = { version: 2; content: RichNode; meta: ArticleMeta };

export const emptyArticleMeta: ArticleMeta = {
  introduction: "", author: "Fieldwork Home editorial", tags: [], featuredImageUrl: "",
  featuredImageAlt: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", noindex: false,
};
export const emptyRichDoc: RichNode = { type: "doc", content: [{ type: "paragraph" }] };

export function isArticleBody(value: unknown): value is ArticleBody {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && (value as { version?: unknown }).version === 2 && (value as { content?: { type?: string } }).content?.type === "doc");
}

export function legacyToRich(value: unknown): RichNode {
  if (isArticleBody(value)) return value.content;
  const blocks: RichNode[] = [];
  if (Array.isArray(value)) for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as { heading?: unknown; paragraphs?: unknown; bullets?: unknown };
    if (typeof block.heading === "string") blocks.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: block.heading }] });
    if (Array.isArray(block.paragraphs)) for (const text of block.paragraphs) if (typeof text === "string") blocks.push({ type: "paragraph", content: [{ type: "text", text }] });
    if (Array.isArray(block.bullets) && block.bullets.length) blocks.push({ type: "bulletList", content: block.bullets.filter((v: unknown) => typeof v === "string").map((text: string) => ({ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text }] }] })) });
  }
  return { type: "doc", content: blocks.length ? blocks : [{ type: "paragraph" }] };
}

export function safeContentUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try { const url = new URL(value); return url.protocol === "https:"; } catch { return false; }
}

const allowedNodes = new Set(["doc", "text", "paragraph", "heading", "bulletList", "orderedList", "listItem", "blockquote", "codeBlock", "horizontalRule", "hardBreak", "table", "tableRow", "tableCell", "tableHeader", "image", "callout", "faq", "cta", "checklist"]);
const allowedMarks = new Set(["bold", "italic", "underline", "strike", "code", "link"]);
export function validateRichDoc(value: unknown): { ok: true; text: string } | { ok: false; error: string } {
  if (!value || typeof value !== "object" || (value as RichNode).type !== "doc") return { ok: false, error: "Article document is invalid." };
  let count = 0, text = "";
  function walk(node: RichNode, depth: number): string | null {
    if (!node || typeof node !== "object" || typeof node.type !== "string") return "Article structure is invalid.";
    if (++count > 2000 || depth > 25) return "Article is too complex.";
    if (!allowedNodes.has(node.type)) return `Unsupported content block: ${node.type}.`;
    if (node.text !== undefined) { if (typeof node.text !== "string" || node.text.length > 10000) return "Article text is invalid."; text += node.text + " "; }
    if (node.marks) {
      if (!Array.isArray(node.marks)) return "Article formatting is invalid.";
      for (const mark of node.marks) {
        if (!allowedMarks.has(mark.type)) return "Unsupported article formatting.";
        if (mark.type === "link" && !safeContentUrl(String(mark.attrs?.href ?? ""))) return "Article contains an unsafe link.";
      }
    }
    if (["image"].includes(node.type)) {
      if (!safeContentUrl(String(node.attrs?.src ?? ""))) return "Image URL must be HTTPS or a local path.";
      if (!String(node.attrs?.alt ?? "").trim()) return "Every article image needs alt text.";
    }
    if (node.type === "cta" && !safeContentUrl(String(node.attrs?.href ?? ""))) return "CTA link must be HTTPS or an internal path.";
    if (node.content) { if (!Array.isArray(node.content)) return "Article structure is invalid."; for (const child of node.content) { const error = walk(child, depth + 1); if (error) return error; } }
    return null;
  }
  const error = walk(value as RichNode, 0);
  return error ? { ok: false, error } : { ok: true, text: text.trim() };
}

export const articleInput = z.object({
  id: z.string().optional(),
  expectedUpdatedAt: z.string().datetime().optional(),
  intent: z.enum(["draft", "publish", "unpublish"]),
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  summary: z.string().trim().max(500),
  category: z.string().trim().min(2).max(80),
  richDoc: z.unknown(),
  introduction: z.string().trim().max(2000),
  author: z.string().trim().min(2).max(120),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  featuredImageUrl: z.string().trim().max(2000),
  featuredImageAlt: z.string().trim().max(300),
  related: z.array(z.string().max(400)).max(20),
  seoTitle: z.string().trim().max(160),
  seoDescription: z.string().trim().max(300),
  canonicalUrl: z.string().trim().max(2000),
  ogTitle: z.string().trim().max(160),
  ogDescription: z.string().trim().max(300),
  ogImage: z.string().trim().max(2000),
  noindex: z.boolean(),
});
