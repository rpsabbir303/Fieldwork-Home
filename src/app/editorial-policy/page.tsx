import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Editorial policy",
  alternates: { canonical: "/editorial-policy" },
};
export default function Page() {
  return <LegalPage page="editorial-policy" />;
}
