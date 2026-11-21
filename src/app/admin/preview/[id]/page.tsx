import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { fromRecord } from "@/lib/catalog";
import { Detail } from "@/components/content-pages";
import type { SectionKey } from "@/lib/content";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const record = await db.content.findUnique({ where: { id } });
  if (!record) notFound();
  return <><div className="cms-preview-banner">Private preview · {record.status.toLowerCase()} · <a href={record.section === "guides" ? `/admin/articles/edit/${record.id}` : `/admin/edit/${record.id}`}>Back to editor</a></div><Detail section={record.section as SectionKey} slug={record.slug} previewItem={fromRecord(record)} /></>;
}
