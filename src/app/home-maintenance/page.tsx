import type { Metadata } from "next";
import { Landing } from "@/components/content-pages";
import { sectionInfo } from "@/lib/content";
export const metadata: Metadata = {
  title: sectionInfo["home-maintenance"].title,
  description: sectionInfo["home-maintenance"].intro,
  alternates: { canonical: "/home-maintenance" },
};
export default function Page() {
  return <Landing section="home-maintenance" />;
}
export const dynamic = "force-dynamic";
