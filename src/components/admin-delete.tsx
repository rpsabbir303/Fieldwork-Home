"use client";
import { deleteContentAction } from "@/app/admin/actions";
export function AdminDelete({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteContentAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="admin-link danger">
        Delete
      </button>
    </form>
  );
}
