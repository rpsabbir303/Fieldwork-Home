import type { Metadata } from "next";
import { Landing } from "@/components/content-pages";
import { sectionInfo } from "@/lib/content";
export const metadata: Metadata = {
  title: sectionInfo["materials-tools"].title,
  description: sectionInfo["materials-tools"].intro,
  alternates: { canonical: "/materials-tools" },
};
export default function Page() {
  return <Landing section="materials-tools" />;
}
export const dynamic = "force-dynamic";
