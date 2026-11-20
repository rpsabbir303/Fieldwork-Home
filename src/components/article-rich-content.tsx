import type { ReactNode } from "react";
import type { RichNode } from "@/lib/article";
import { safeContentUrl } from "@/lib/article";

function renderChildren(node: RichNode): ReactNode { return node.content?.map((child, index) => <RenderNode key={index} node={child} />); }
function RenderNode({ node }: { node: RichNode }): ReactNode {
  if (node.type === "text") {
    let result: ReactNode = node.text ?? "";
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") result = <strong>{result}</strong>;
      if (mark.type === "italic") result = <em>{result}</em>;
      if (mark.type === "underline") result = <u>{result}</u>;
      if (mark.type === "strike") result = <s>{result}</s>;
      if (mark.type === "code") result = <code>{result}</code>;
      if (mark.type === "link") { const href = String(mark.attrs?.href ?? ""); if (safeContentUrl(href)) result = <a href={href} rel={href.startsWith("/") ? undefined : "noopener noreferrer"}>{result}</a>; }
    }
    return result;
  }
  const children = renderChildren(node);
  switch (node.type) {
    case "doc": return <>{children}</>;
    case "paragraph": return <p>{children}</p>;
    case "heading": return Number(node.attrs?.level) === 3 ? <h3>{children}</h3> : <h2>{children}</h2>;
    case "bulletList": return <ul>{children}</ul>;
    case "orderedList": return <ol>{children}</ol>;
    case "listItem": return <li>{children}</li>;
    case "blockquote": return <blockquote>{children}</blockquote>;
    case "codeBlock": return <pre><code>{children}</code></pre>;
    case "hardBreak": return <br />;
    case "horizontalRule": return <hr />;
    case "table": return <div className="article-table-scroll"><table><tbody>{children}</tbody></table></div>;
    case "tableRow": return <tr>{children}</tr>;
    case "tableCell": return <td>{children}</td>;
    case "tableHeader": return <th scope="col">{children}</th>;
    case "image": { const src = String(node.attrs?.src ?? ""); if (!safeContentUrl(src)) return null; return <figure><img src={src} alt={String(node.attrs?.alt ?? "")} loading="lazy" />{Boolean(node.attrs?.caption) && <figcaption>{String(node.attrs?.caption)}</figcaption>}</figure>; }
    case "callout": return <aside className="article-callout"><strong>{String(node.attrs?.title ?? "Note")}</strong><p>{String(node.attrs?.text ?? "")}</p></aside>;
    case "faq": return <section className="article-faq"><h3>{String(node.attrs?.question ?? "Question")}</h3><p>{String(node.attrs?.answer ?? "")}</p></section>;
    case "cta": { const href = String(node.attrs?.href ?? ""); return safeContentUrl(href) ? <div className="article-cta"><strong>{String(node.attrs?.title ?? "Next step")}</strong><a href={href}>{String(node.attrs?.label ?? "Learn more")}</a></div> : null; }
    case "checklist": return <div className="article-checklist"><strong>Checklist</strong><ul>{String(node.attrs?.items ?? "").split("\n").filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</ul></div>;
    default: return null;
  }
}
export function ArticleRichContent({ document }: { document: RichNode }) { return <div className="article-rich"><RenderNode node={document} /></div>; }
