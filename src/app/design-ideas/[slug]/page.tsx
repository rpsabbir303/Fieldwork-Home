import type { Metadata } from "next";
import { Detail } from "@/components/content-pages";
import { getContent } from "@/lib/catalog";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContent("design-ideas", slug);
  return item
    ? {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.summary,
        alternates: { canonical: "/design-ideas/" + slug },
        openGraph: {
          title: item.seoTitle || item.title,
          description: item.seoDescription || item.summary,
        },
      }
    : { title: "Resource not found" };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Detail section="design-ideas" slug={slug} />;
}
