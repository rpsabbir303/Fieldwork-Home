import { PrismaClient } from "@prisma/client";
import { starterContent, slugify } from "../src/lib/content";

const db = new PrismaClient();
async function main() {
  for (const item of starterContent) {
    const category = await db.category.upsert({
      where: { slug: `${item.section}-${slugify(item.category)}` },
      update: {},
      create: {
        slug: `${item.section}-${slugify(item.category)}`,
        name: item.category,
        section: item.section,
      },
    });
    await db.content.upsert({
      where: { section_slug: { section: item.section, slug: item.slug } },
      update: {},
      create: {
        section: item.section,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        category: item.category,
        categoryId: category.id,
        status: "PUBLISHED",
        body: item.blocks,
        related: item.related ?? [],
        tools: item.tools ?? [],
        materials: item.materials ?? [],
        safety: item.safety,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${starterContent.length} starter editorial entries.`);
}
main().finally(() => db.$disconnect());
