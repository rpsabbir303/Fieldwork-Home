import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminEditor } from "@/components/admin-editor";
export const metadata: Metadata = {
  title: "New editorial resource",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  return (
    <main className="admin-area">
      <div className="container">
        <AdminEditor error={error} />
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";
