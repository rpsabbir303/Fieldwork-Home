import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { projectCategories, sectionPath, slugify } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "/",
    "/calculators",
    "/calculators/paint",
    "/calculators/tile",
    "/calculators/drywall",
    "/projects",
    "/cost-guides",
    "/materials-tools",
    "/design-ideas",
    "/home-maintenance",
    "/guides",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/editorial-policy",
    ...projectCategories.map((category) => `/projects/category/${slugify(category)}`),
    ...(await getCatalog()).map(sectionPath),
  ];
  return paths.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
export const dynamic = "force-dynamic";
