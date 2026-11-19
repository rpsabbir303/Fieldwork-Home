import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminEditor } from "@/components/admin-editor";
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
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const item = await db.content.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <main className="admin-area">
      <div className="container">
        <AdminEditor item={item} error={error} />
      </div>
    </main>
  );
}
