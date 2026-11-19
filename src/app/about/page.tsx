import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "About Fieldwork Home",
  alternates: { canonical: "/about" },
};
export default function Page() {
  return <LegalPage page="about" />;
}
