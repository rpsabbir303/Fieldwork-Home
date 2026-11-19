import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Disclaimer", alternates: { canonical: "/disclaimer" } };
export default function Page() {
  return <LegalPage page="disclaimer" />;
}
