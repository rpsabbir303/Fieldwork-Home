import test from "node:test";
import assert from "node:assert/strict";
import { articleInput, isArticleBody, legacyToRich, validateRichDoc } from "../src/lib/article";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticleRichContent } from "../src/components/article-rich-content";

test("legacy seeded article blocks convert to a rich document without losing text", () => {
  const rich = legacyToRich([{ heading: "Prepare", paragraphs: ["Measure the wall."], bullets: ["Check the surface", "Gather supplies"] }]);
  assert.equal(rich.type, "doc");
  assert.deepEqual(rich.content?.map(block => block.type), ["heading", "paragraph", "bulletList"]);
  const validation = validateRichDoc(rich);
  assert.equal(validation.ok, true);
  if (validation.ok) assert.match(validation.text, /Measure the wall/);
});

test("unsafe rich links and images are rejected before saving", () => {
  const unsafeLink = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Click", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] };
  assert.equal(validateRichDoc(unsafeLink).ok, false);
  const unsafeImage = { type: "doc", content: [{ type: "image", attrs: { src: "data:image/svg+xml,abc", alt: "" } }] };
  assert.equal(validateRichDoc(unsafeImage).ok, false);
  const unsafeCta = { type: "doc", content: [{ type: "cta", attrs: { href: "javascript:alert(1)" } }] };
  assert.equal(validateRichDoc(unsafeCta).ok, false);
});

test("article drafts require structured slugs and bounded fields", () => {
  const base = { intent: "draft", title: "Paint a room", slug: "paint-a-room", summary: "", category: "Painting", richDoc: { type: "doc", content: [] }, introduction: "", author: "Fieldwork Home editorial", tags: [], featuredImageUrl: "", featuredImageAlt: "", related: [], seoTitle: "", seoDescription: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", noindex: false };
  assert.equal(articleInput.safeParse(base).success, true);
  assert.equal(articleInput.safeParse({ ...base, slug: "Paint a room" }).success, false);
  assert.equal(articleInput.safeParse({ ...base, tags: Array(21).fill("tag") }).success, false);
});

test("versioned article bodies are distinguished from seeded arrays", () => {
  assert.equal(isArticleBody([{ heading: "Old" }]), false);
  assert.equal(isArticleBody({ version: 2, content: { type: "doc", content: [] }, meta: {} }), true);
});

test("public rich renderer escapes text and preserves safe article structure", () => {
  const html = renderToStaticMarkup(createElement(ArticleRichContent, { document: { type: "doc", content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Preparation" }] },
    { type: "paragraph", content: [{ type: "text", text: "<script>alert(1)</script>", marks: [{ type: "bold" }] }] },
    { type: "image", attrs: { src: "/sample.jpg", alt: "Painted wall", caption: "After two coats" } },
  ] } }));
  assert.match(html, /<h2>Preparation<\/h2>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /alt="Painted wall"/);
  assert.match(html, /After two coats/);
  assert.doesNotMatch(html, /<script>/);
});
