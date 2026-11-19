import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sectionInfo, type SectionKey, sectionPath } from "@/lib/content";
import { logoutAction, toggleStatusAction } from "./actions";
import { AdminDelete } from "@/components/admin-delete";

export const metadata: Metadata = {
  title: "Editorial dashboard",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; updated?: string }>;
}) {
  const admin = await requireAdmin();
  const { saved, deleted, updated } = await searchParams;
  const [items, total, published, categories] = await Promise.all([
    db.content.findMany({ orderBy: { updatedAt: "desc" }, take: 100 }),
    db.content.count(),
    db.content.count({ where: { status: "PUBLISHED" } }),
    db.category.count(),
  ]);
  return (
    <main className="admin-area">
      <div className="container admin-dashboard">
        <div className="admin-top">
          <div>
            <p className="eyebrow">Editorial workspace</p>
            <h1>Content dashboard</h1>
            <p>Signed in as {admin.email}</p>
          </div>
          <form action={logoutAction}>
            <button className="admin-link" type="submit">
              Sign out
            </button>
          </form>
        </div>
        {(saved || deleted || updated) && (
          <div className="admin-success" role="status">
            Content {saved ? "saved" : deleted ? "deleted" : "updated"} successfully.
          </div>
        )}
        <div className="admin-stats">
          <div>
            <span>Total content</span>
            <strong>{total}</strong>
          </div>
          <div>
            <span>Published</span>
            <strong>{published}</strong>
          </div>
          <div>
            <span>Drafts</span>
            <strong>{total - published}</strong>
          </div>
          <div>
            <span>Categories</span>
            <strong>{categories}</strong>
          </div>
        </div>
        <div className="admin-list-head">
          <div>
            <h2>Resources</h2>
            <p>Recent database content, including seeded starter entries.</p>
          </div>
          <Link href="/admin/new" className="button button-primary">
            New resource
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <small>
                      /{item.section}/{item.slug}
                    </small>
                  </td>
                  <td>{sectionInfo[item.section as SectionKey]?.label ?? item.section}</td>
                  <td>{item.category}</td>
                  <td>
                    <span
                      className={`status-badge ${item.status === "PUBLISHED" ? "published" : ""}`}
                    >
                      {item.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{item.updatedAt.toLocaleDateString("en-US")}</td>
                  <td>
                    <div className="admin-actions">
                      <Link href={`/admin/edit/${item.id}`}>Edit</Link>
                      {item.status === "PUBLISHED" && (
                        <Link
                          href={sectionPath({
                            section: item.section as SectionKey,
                            slug: item.slug,
                          })}
                        >
                          View
                        </Link>
                      )}
                      <form action={toggleStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="admin-link">
                          {item.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <AdminDelete id={item.id} title={item.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && (
            <div className="empty-state">
              <h2>No database content yet</h2>
              <p>Run the starter seed command or create your first editorial resource.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
