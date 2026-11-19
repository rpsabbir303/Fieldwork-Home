import type { Metadata } from "next";
import { Landing } from "@/components/content-pages";
import { sectionInfo } from "@/lib/content";
export const metadata: Metadata = {
  title: sectionInfo["projects"].title,
  description: sectionInfo["projects"].intro,
  alternates: { canonical: "/projects" },
};
export default function Page() {
  return <Landing section="projects" />;
}
export const dynamic = "force-dynamic";
