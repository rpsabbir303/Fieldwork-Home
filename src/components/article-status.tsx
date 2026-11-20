"use client";
import { articleStatusAction } from "@/app/admin/actions";

export function ArticleStatus({ id, published, title }: { id: string; published: boolean; title: string }) {
  return <form action={articleStatusAction} onSubmit={event => {
    if (!window.confirm(`${published ? "Unpublish" : "Publish"} “${title}”${published ? " and keep it as a private draft" : " to the public website"}?`)) event.preventDefault();
  }}><input type="hidden" name="id" value={id}/><input type="hidden" name="status" value={published ? "DRAFT" : "PUBLISHED"}/><button type="submit" className="admin-link">{published ? "Unpublish" : "Publish"}</button></form>;
}
