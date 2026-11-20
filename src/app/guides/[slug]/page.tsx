import type { Metadata } from "next";
import { Detail } from "@/components/content-pages";
import { getContent } from "@/lib/catalog";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContent("guides", slug);
  return item
    ? {
        title: item.seoTitle || item.title,
        description: item.seoDescription || item.summary,
        alternates: { canonical: item.articleMeta?.canonicalUrl || "/guides/" + slug },
        robots: item.articleMeta?.noindex ? { index: false, follow: false } : undefined,
        openGraph: {
          title: item.articleMeta?.ogTitle || item.seoTitle || item.title,
          description: item.articleMeta?.ogDescription || item.seoDescription || item.summary,
          images: item.articleMeta?.ogImage || item.articleMeta?.featuredImageUrl ? [{ url: item.articleMeta.ogImage || item.articleMeta.featuredImageUrl }] : undefined,
        },
      }
    : { title: "Resource not found" };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Detail section="guides" slug={slug} />;
}
