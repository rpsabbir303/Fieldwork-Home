import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminEditor } from "@/components/admin-editor";
import { AdminShell } from "@/components/admin-shell";
export const metadata: Metadata = {
  title: "Edit editorial resource",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const item = await db.content.findUnique({ where: { id } });
  if (!item) notFound();
  if (item.section === "guides") redirect(`/admin/articles/edit/${id}`);
  return (
    <AdminShell email={admin.email}><AdminEditor item={item} error={error} /></AdminShell>
  );
}
