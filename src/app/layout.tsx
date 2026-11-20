import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fieldwork Home | Plan smarter. Make more of home.",
    template: "%s | Fieldwork Home",
  },
  description:
    "Independent home improvement resources for US homeowners: practical project guides, transparent calculators, material comparisons, and maintenance checklists.",
  openGraph: {
    type: "website",
    siteName: "Fieldwork Home",
    title: "Fieldwork Home",
    description:
      "Practical tools and thoughtful guidance for the decisions between an idea and a finished space.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {process.env.APP_MODE !== "admin" && <SiteHeader />}
        {children}
        {process.env.APP_MODE !== "admin" && <SiteFooter />}
      </body>
    </html>
  );
}
