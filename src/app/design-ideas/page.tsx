import type { Metadata } from "next";
import { Landing } from "@/components/content-pages";
import { sectionInfo } from "@/lib/content";
export const metadata: Metadata = {
  title: sectionInfo["design-ideas"].title,
  description: sectionInfo["design-ideas"].intro,
  alternates: { canonical: "/design-ideas" },
};
export default function Page() {
  return <Landing section="design-ideas" />;
}
export const dynamic = "force-dynamic";
