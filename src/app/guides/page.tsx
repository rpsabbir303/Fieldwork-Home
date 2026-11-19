import type { Metadata } from "next";
import { Landing } from "@/components/content-pages";
import { sectionInfo } from "@/lib/content";
export const metadata: Metadata = {
  title: sectionInfo["guides"].title,
  description: sectionInfo["guides"].intro,
  alternates: { canonical: "/guides" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <Landing section="guides" activeCategory={category} />;
}
export const dynamic = "force-dynamic";
