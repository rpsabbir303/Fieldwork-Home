import type { Metadata } from "next";
import { Landing } from "@/components/content-pages";
import { sectionInfo } from "@/lib/content";
export const metadata: Metadata = {
  title: sectionInfo["cost-guides"].title,
  description: sectionInfo["cost-guides"].intro,
  alternates: { canonical: "/cost-guides" },
};
export default function Page() {
  return <Landing section="cost-guides" />;
}
export const dynamic = "force-dynamic";
