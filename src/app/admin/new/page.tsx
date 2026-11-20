import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminEditor } from "@/components/admin-editor";
import { AdminShell } from "@/components/admin-shell";
export const metadata: Metadata = {
  title: "New editorial resource",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await requireAdmin();
  const { error } = await searchParams;
  return (
    <AdminShell email={admin.email}><AdminEditor error={error} /></AdminShell>
  );
}
export const dynamic = "force-dynamic";
