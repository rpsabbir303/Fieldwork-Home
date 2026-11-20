"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { Node } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import { useRouter } from "next/navigation";
import type { RichNode, ArticleMeta } from "@/lib/article";
import { emptyArticleMeta, emptyRichDoc, safeContentUrl } from "@/lib/article";

const customBlocks = [
  { name: "callout", attrs: ["title", "text"] },
  { name: "faq", attrs: ["question", "answer"] },
  { name: "cta", attrs: ["title", "label", "href"] },
  { name: "checklist", attrs: ["items"] },
].map(block => Node.create({
  name: block.name, group: "block", atom: true,
  addAttributes() { return Object.fromEntries(block.attrs.map(name => [name, { default: "" }])); },
  parseHTML() { return [{ tag: `div[data-article-block="${block.name}"]` }]; },
  renderHTML({ HTMLAttributes }) { return ["div", { ...HTMLAttributes, "data-article-block": block.name, class: "article-editor-block" }, `${block.name.toUpperCase()} · ${String(HTMLAttributes.title || HTMLAttributes.question || HTMLAttributes.items || "")}`]; },
}));

const CaptionedImage = Image.extend({
  addAttributes() { return { ...this.parent?.(), caption: { default: "" } }; },
});

type Initial = {
  id: string; title: string; slug: string; summary: string; category: string; status: string;
  updatedAt: string; publishedAt: string | null; seoTitle: string; seoDescription: string;
  richDoc: RichNode; meta: ArticleMeta; related: string[];
};
type Fields = {
  title: string; slug: string; summary: string; category: string; introduction: string;
  author: string; tags: string; featuredImageUrl: string; featuredImageAlt: string;
  related: string; seoTitle: string; seoDescription: string; canonicalUrl: string;
  ogTitle: string; ogDescription: string; ogImage: string; noindex: boolean;
};
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 165); }
function initialFields(initial?: Initial): Fields {
  const meta = initial?.meta ?? emptyArticleMeta;
  return { title: initial?.title ?? "", slug: initial?.slug ?? "", summary: initial?.summary ?? "", category: initial?.category ?? "General",
    introduction: meta.introduction, author: meta.author, tags: meta.tags.join(", "),
    featuredImageUrl: meta.featuredImageUrl, featuredImageAlt: meta.featuredImageAlt,
    related: initial?.related.join("\n") ?? "", seoTitle: initial?.seoTitle ?? "", seoDescription: initial?.seoDescription ?? "",
    canonicalUrl: meta.canonicalUrl, ogTitle: meta.ogTitle, ogDescription: meta.ogDescription,
    ogImage: meta.ogImage, noindex: meta.noindex };
}

export function ArticleEditor({ initial, categories, media }: { initial?: Initial; categories: string[]; media: { id: string; url: string; alt: string }[] }) {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(() => initialFields(initial));
  const fieldsRef = useRef(fields);
  const [recordStatus, setRecordStatus] = useState(initial?.status ?? "DRAFT");
  const statusRef = useRef(initial?.status ?? "DRAFT");
  const [saveState, setSaveState] = useState(initial ? "Saved" : "New draft");
  const [revision, setRevision] = useState(0);
  const [savedRevision, setSavedRevision] = useState(0);
  const [recordId, setRecordId] = useState(initial?.id ?? "");
  const [retry, setRetry] = useState(0);
  const revisionRef = useRef(0), savedRevisionRef = useRef(0);
  const idRef = useRef(initial?.id ?? ""), updatedRef = useRef(initial?.updatedAt ?? "");
  const inflightRef = useRef<Promise<boolean> | null>(null);
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } }), TableKit, CaptionedImage, ...customBlocks],
    content: initial?.richDoc ?? emptyRichDoc,
    immediatelyRender: false,
    editorProps: { attributes: { class: "article-tiptap", "aria-label": "Article body" } },
    onUpdate: () => { revisionRef.current += 1; setRevision(revisionRef.current); setSaveState("Unsaved changes"); },
  });
  const editorRef = useRef(editor);
  useEffect(() => { editorRef.current = editor; }, [editor]);
  const dirty = revision > savedRevision;
  const update = (key: keyof Fields, value: string | boolean) => {
    const next = { ...fieldsRef.current, [key]: value };
    fieldsRef.current = next;
    setFields(next);
    revisionRef.current += 1; setRevision(revisionRef.current); setSaveState("Unsaved changes");
  };

  const persist = useCallback(async (intent: "draft" | "publish" | "unpublish") => {
    if (inflightRef.current) await inflightRef.current;
    const task = (async () => {
      const current = fieldsRef.current;
      const doc = editorRef.current?.getJSON() ?? emptyRichDoc;
      const slug = current.slug || slugify(current.title);
      if (!current.title.trim() || !slug || !current.category.trim()) { setSaveState("Add a title and category to save this draft."); return false; }
      const atRevision = revisionRef.current;
      setSaveState(intent === "publish" ? "Publishing…" : "Saving…");
      try {
        const response = await fetch("/admin/articles/save", {
          method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: idRef.current || undefined, expectedUpdatedAt: updatedRef.current || undefined,
            intent, ...current, slug, tags: current.tags.split(",").map(v => v.trim()).filter(Boolean),
            related: current.related.split(/\r?\n/).map(v => v.trim()).filter(Boolean), richDoc: doc }),
        });
        const data = await response.json() as { id?: string; updatedAt?: string; status?: string; error?: string };
        if (!response.ok || !data.id || !data.updatedAt) { setSaveState(data.error ?? "Save failed. Your changes remain in this browser."); return false; }
        const previousId = idRef.current;
        idRef.current = data.id; updatedRef.current = data.updatedAt;
        setRecordId(data.id);
        statusRef.current = data.status ?? "DRAFT";
        setRecordStatus(data.status ?? "DRAFT");
        if (!previousId) {
          window.history.replaceState(null, "", `/admin/articles/edit/${data.id}`);
          window.localStorage.removeItem("fieldwork-article-new");
        }
        if (atRevision === revisionRef.current) {
          if (!current.slug) { const next = { ...fieldsRef.current, slug }; fieldsRef.current = next; setFields(next); }
          savedRevisionRef.current = atRevision;
          setSavedRevision(atRevision);
          setSaveState(data.status === "PUBLISHED" ? "Published · saved" : "Draft saved");
          window.localStorage.removeItem(`fieldwork-article-${data.id}`);
        } else { setSaveState("New changes pending…"); setRetry(v => v + 1); }
        return true;
      } catch { setSaveState("Could not reach the server. Your changes remain in this browser."); return false; }
    })();
    inflightRef.current = task;
    try { return await task; } finally { if (inflightRef.current === task) inflightRef.current = null; }
  }, []);

  useEffect(() => {
    if (revision <= savedRevisionRef.current) return;
    try { window.localStorage.setItem(`fieldwork-article-${idRef.current || "new"}`, JSON.stringify({ savedAt: Date.now(), fields: fieldsRef.current, richDoc: editorRef.current?.getJSON() })); } catch { /* Browser storage may be disabled. */ }
    if (recordStatus !== "DRAFT") return;
    const timer = window.setTimeout(() => { if (statusRef.current === "DRAFT") void persist("draft"); }, 2000);
    return () => window.clearTimeout(timer);
  }, [revision, retry, recordStatus, persist]);
  useEffect(() => {
    if (!editor) return;
    const backupKey = `fieldwork-article-${idRef.current || "new"}`;
    try {
      const raw = window.localStorage.getItem(backupKey);
      if (!raw) return;
      const backup = JSON.parse(raw) as { savedAt: number; fields: Fields; richDoc: RichNode };
      if (backup.savedAt <= (initial?.updatedAt ? Date.parse(initial.updatedAt) : 0)) { window.localStorage.removeItem(backupKey); return; }
      if (window.confirm("A newer unsaved article draft was found in this browser. Restore it?")) {
        fieldsRef.current = backup.fields; setFields(backup.fields); editor.commands.setContent(backup.richDoc); revisionRef.current += 1; setRevision(revisionRef.current); setSaveState("Restored unsaved draft");
      } else window.localStorage.removeItem(backupKey);
    } catch { /* Ignore malformed local backups. */ }
  }, [editor, initial?.updatedAt]);
  useEffect(() => { const beforeUnload = (event: BeforeUnloadEvent) => { if (revisionRef.current > savedRevisionRef.current) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", beforeUnload); return () => window.removeEventListener("beforeunload", beforeUnload); }, []);

  const insertSpecial = (kind: "callout" | "faq" | "cta" | "checklist") => {
    if (!editor) return;
    let attrs: Record<string, string> | null = null;
    if (kind === "callout") { const title = window.prompt("Callout heading", "Tip"); if (title === null) return; const text = window.prompt("Callout text"); if (text === null) return; attrs = { title, text }; }
    if (kind === "faq") { const question = window.prompt("FAQ question"); if (!question) return; const answer = window.prompt("FAQ answer"); if (answer === null) return; attrs = { question, answer }; }
    if (kind === "cta") { const title = window.prompt("CTA heading"); if (!title) return; const label = window.prompt("Link label", "Learn more"); if (!label) return; const href = window.prompt("Internal path or HTTPS URL", "/calculators"); if (!href || !safeContentUrl(href)) return; attrs = { title, label, href }; }
    if (kind === "checklist") { const items = window.prompt("Checklist items, one per line"); if (!items) return; attrs = { items }; }
    if (attrs) editor.chain().focus().insertContent({ type: kind, attrs }).run();
  };
  const insertImage = () => {
    if (!editor) return;
    const src = window.prompt("Image URL (HTTPS or local path)", fields.featuredImageUrl || "");
    if (!src || !safeContentUrl(src)) { setSaveState("Use a local path or HTTPS image URL."); return; }
    const alt = window.prompt("Image alt text"); if (!alt?.trim()) { setSaveState("Image alt text is required."); return; }
    const caption = window.prompt("Caption (optional)", "") ?? "";
    editor.chain().focus().insertContent({ type: "image", attrs: { src, alt, caption } }).run();
  };
  const editSelectedBlock = () => {
    if (!editor || !(editor.state.selection instanceof NodeSelection)) { setSaveState("Select an image or special block first."); return; }
    const selected = editor.state.selection.node;
    const fieldsByType: Record<string, string[]> = { image: ["src", "alt", "caption"], callout: ["title", "text"], faq: ["question", "answer"], cta: ["title", "label", "href"], checklist: ["items"] };
    const names = fieldsByType[selected.type.name];
    if (!names) { setSaveState("Select an image or special block first."); return; }
    const attrs: Record<string, string> = {};
    for (const name of names) { const value = window.prompt(name.replace(/^[a-z]/, c => c.toUpperCase()), String(selected.attrs[name] ?? "")); if (value === null) return; attrs[name] = value; }
    if ((attrs.src && !safeContentUrl(attrs.src)) || (attrs.href && !safeContentUrl(attrs.href)) || (selected.type.name === "image" && !attrs.alt?.trim())) { setSaveState("Check the link and image alt text."); return; }
    editor.chain().focus().updateAttributes(selected.type.name, attrs).run();
  };
  const setLink = () => { if (!editor) return; const href = window.prompt("Internal path or HTTPS URL", editor.getAttributes("link").href || "https://"); if (href === null) return; if (!href) { editor.chain().focus().unsetLink().run(); return; } if (!safeContentUrl(href)) { setSaveState("Use a local path or HTTPS link."); return; } editor.chain().focus().extendMarkRange("link").setLink({ href }).run(); };
  const preview = async () => { if (dirty) { if (recordStatus === "PUBLISHED" && !window.confirm("Save these changes to the live article before previewing?")) return; const ok = await persist(recordStatus === "PUBLISHED" ? "publish" : "draft"); if (!ok) return; } if (idRef.current) router.push(`/admin/preview/${idRef.current}`); };
  const saveDraft = async () => { if (recordStatus === "PUBLISHED" && !window.confirm("Unpublish this article and save it as a draft?")) return; await persist("draft"); };
  const publish = async () => { if (!window.confirm("Publish this article to the public website now?")) return; await persist("publish"); };
  const unpublish = async () => { if (!window.confirm("Unpublish this article and keep it as a draft?")) return; await persist("unpublish"); };
  const back = (event: React.MouseEvent<HTMLAnchorElement>) => { if (dirty && !window.confirm("You have unsaved changes. Leave the editor?")) event.preventDefault(); };
  return <div className="article-workspace">
    <header className="article-editor-head"><div><p className="eyebrow">Editorial / Article</p><h1>{initial ? "Edit article" : "New article"}</h1><p>Write, preview and publish to the Fieldwork Home learning library.</p></div><div className="article-editor-head-actions"><span className={`cms-pill ${recordStatus === "PUBLISHED" ? "live" : ""}`}>{recordStatus.toLowerCase()}</span><a href="/admin/articles" onClick={back}>All articles</a></div></header>
    <div className="article-savebar"><span role="status" aria-live="polite">{saveState}</span><div><button type="button" onClick={() => void saveDraft()}>Save draft</button><button type="button" onClick={() => void preview()} disabled={!recordId && !fields.title}>Preview</button>{recordStatus === "PUBLISHED" ? <button type="button" onClick={() => void unpublish()}>Unpublish</button> : null}<button type="button" className="button-primary" onClick={() => void publish()}>{recordStatus === "PUBLISHED" ? "Update published" : "Publish"}</button></div></div>
    <div className="article-editor-grid"><div className="article-writing"><section className="cms-panel article-core"><label>Article title<input value={fields.title} onChange={e => update("title", e.target.value)} onBlur={() => { if (!fields.slug && fields.title) update("slug", slugify(fields.title)); }} placeholder="Give your article a clear title" maxLength={160}/></label><label>URL slug<input value={fields.slug} onChange={e => update("slug", e.target.value)} placeholder="article-url-slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={180}/><small>/guides/{fields.slug || "your-article"}</small></label><label>Excerpt<textarea value={fields.summary} onChange={e => update("summary", e.target.value)} maxLength={500} rows={3} placeholder="A useful summary for readers and search results"/></label><label>Introduction<textarea value={fields.introduction} onChange={e => update("introduction", e.target.value)} maxLength={2000} rows={3} placeholder="Set the scene before the main article"/></label></section>
      <section className="cms-panel article-body-panel"><div className="cms-panel-head"><div><h2>Article body</h2><p>Use the toolbar to structure and format your writing.</p></div></div><div className="article-toolbar" role="toolbar" aria-label="Article formatting"><button type="button" onClick={() => editor?.chain().focus().setParagraph().run()}>P</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button><button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button><button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></button><button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}><i>I</i></button><button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></button><button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button><button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbers</button><button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button><button type="button" onClick={setLink}>Link</button><button type="button" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button><button type="button" onClick={insertImage}>Image</button><button type="button" onClick={editSelectedBlock}>Edit block</button><button type="button" onClick={() => editor?.chain().focus().addRowAfter().run()}>Row +</button><button type="button" onClick={() => editor?.chain().focus().addColumnAfter().run()}>Column +</button><button type="button" onClick={() => editor?.chain().focus().deleteTable().run()}>Remove table</button><button type="button" onClick={() => insertSpecial("callout")}>Callout</button><button type="button" onClick={() => insertSpecial("faq")}>FAQ</button><button type="button" onClick={() => insertSpecial("checklist")}>Checklist</button><button type="button" onClick={() => insertSpecial("cta")}>CTA</button></div><EditorContent editor={editor} /><p className="article-editor-help">Page title is the H1. Use H2 and H3 for sections. Select text before adding a link.</p></section>
      <section className="cms-panel article-core"><h2>Related resources</h2><label>Internal paths, one per line<textarea value={fields.related} onChange={e => update("related", e.target.value)} rows={4} placeholder="/calculators/paint"/></label></section></div>
      <aside className="article-settings"><section className="cms-panel"><h2>Organization</h2><label>Author<input value={fields.author} onChange={e => update("author", e.target.value)} maxLength={120}/></label><label>Category<input list="article-categories" value={fields.category} onChange={e => update("category", e.target.value)} maxLength={80}/><datalist id="article-categories">{categories.map(name => <option key={name} value={name}/>)}</datalist></label><label>Tags <small>Comma separated</small><input value={fields.tags} onChange={e => update("tags", e.target.value)} placeholder="Painting, Planning"/></label></section>
      <section className="cms-panel"><h2>Featured image</h2>{fields.featuredImageUrl && safeContentUrl(fields.featuredImageUrl) && <img className="article-image-preview" src={fields.featuredImageUrl} alt={fields.featuredImageAlt || "Selected featured image"}/>}<label>Choose existing image<select value="" onChange={e => { const selected = media.find(m => m.id === e.target.value); if (selected) { update("featuredImageUrl", selected.url); update("featuredImageAlt", selected.alt); } }}><option value="">Select from media library</option>{media.map(m => <option key={m.id} value={m.id}>{m.alt || m.url}</option>)}</select></label><label>Image URL<input value={fields.featuredImageUrl} onChange={e => update("featuredImageUrl", e.target.value)} placeholder="https://... or /image.jpg"/></label><label>Image alt text<input value={fields.featuredImageAlt} onChange={e => update("featuredImageAlt", e.target.value)} maxLength={300}/></label><p className="cms-muted">Uploads require persistent media storage. Existing media URLs or HTTPS image URLs can be used now.</p></section>
      <section className="cms-panel"><h2>Search appearance</h2><label>SEO title<input value={fields.seoTitle} onChange={e => update("seoTitle", e.target.value)} maxLength={160}/></label><label>Meta description<textarea value={fields.seoDescription} onChange={e => update("seoDescription", e.target.value)} rows={3} maxLength={300}/></label><label>Canonical URL<input value={fields.canonicalUrl} onChange={e => update("canonicalUrl", e.target.value)} placeholder="Defaults to this article URL"/></label><label>Open Graph title<input value={fields.ogTitle} onChange={e => update("ogTitle", e.target.value)} maxLength={160}/></label><label>Open Graph description<textarea value={fields.ogDescription} onChange={e => update("ogDescription", e.target.value)} rows={3} maxLength={300}/></label><label>Open Graph image URL<input value={fields.ogImage} onChange={e => update("ogImage", e.target.value)} placeholder="Defaults to featured image"/></label><label className="article-checkbox"><input type="checkbox" checked={fields.noindex} onChange={e => update("noindex", e.target.checked)}/>Noindex this article</label><div className="article-serp"><small>Search preview · illustrative rendering</small><strong>{fields.seoTitle || fields.title || "Article title"}</strong><span>/guides/{fields.slug || "your-article"}</span><p>{fields.seoDescription || fields.summary || "Article description"}</p></div></section></aside></div>
  </div>;
}


