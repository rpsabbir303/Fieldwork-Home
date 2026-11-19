import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };
export default function Page() {
  return <LegalPage page="contact" />;
}
