"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSession, clearSession, requireAdmin } from "@/lib/auth";
import { db, databaseConfigured } from "@/lib/db";
import { SectionKey, slugify } from "@/lib/content";
import { legacyToRich, validateRichDoc } from "@/lib/article";

const loginSchema = z.object({ email: z.email().max(254), password: z.string().min(1).max(500) });
const contentSchema = z.object({
  id: z.string().optional(),
  section: z.enum([
    "projects",
    "guides",
    "cost-guides",
    "materials-tools",
    "design-ideas",
    "home-maintenance",
  ]),
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(180),
  summary: z.string().trim().min(20).max(500),
  category: z.string().trim().min(2).max(80),
  body: z.string().trim().min(30).max(40000),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  tools: z.string().max(3000),
  materials: z.string().max(3000),
  safety: z.string().max(3000),
  related: z.string().max(3000),
  seoTitle: z.string().max(160),
  seoDescription: z.string().max(300),
});

function list(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
function parseBody(value: string) {
  const blocks: { heading: string; paragraphs: string[]; bullets: string[] }[] = [];
  for (const line of value.split(/\r?\n/)) {
    const text = line.trim();
    if (!text) continue;
    if (text.startsWith("## "))
      blocks.push({ heading: text.slice(3).trim() || "Details", paragraphs: [], bullets: [] });
    else {
      if (!blocks.length) blocks.push({ heading: "Details", paragraphs: [], bullets: [] });
      const block = blocks[blocks.length - 1];
      if (text.startsWith("- ")) block.bullets.push(text.slice(2));
      else block.paragraphs.push(text);
    }
  }
  return blocks;
}

export async function loginAction(formData: FormData) {
  if (!databaseConfigured || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
    redirect("/admin/login?error=setup");
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/admin/login?error=invalid");
  const admin = await db.adminUser
    .findUnique({ where: { email: parsed.data.email.toLowerCase() } })
    .catch(() => null);
  const valid = admin?.active && (await compare(parsed.data.password, admin.passwordHash));
  if (!valid || !admin) redirect("/admin/login?error=invalid");
  await createSession(admin.id);
  redirect("/admin");
}
export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveContentAction(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = contentSchema.safeParse(raw);
  if (!parsed.success) redirect(`/admin/${raw.id ? `edit/${raw.id}` : "new"}?error=validation`);
  const data = parsed.data;
  const categorySlug = `${data.section}-${slugify(data.category)}`;
  const category = await db.category.upsert({
    where: { slug: categorySlug },
    update: { name: data.category },
    create: { name: data.category, slug: categorySlug, section: data.section },
  });
  const existing = data.id ? await db.content.findUnique({ where: { id: data.id }, select: { publishedAt: true, section: true, slug: true } }) : null;
  if (data.id && !existing) redirect("/admin/content?error=missing");
  const payload = {
    section: data.section as SectionKey,
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    category: data.category,
    categoryId: category.id,
    body: parseBody(data.body),
    tools: list(data.tools),
    materials: list(data.materials),
    safety: data.safety || null,
    related: list(data.related).filter((path) => path.startsWith("/") && !path.startsWith("//")),
    status: data.status,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    publishedAt: data.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null,
  };
  try {
    if (data.id) await db.content.update({ where: { id: data.id }, data: payload });
    else await db.content.create({ data: payload });
  } catch {
    redirect(`/admin/${data.id ? `edit/${data.id}` : "new"}?error=save`);
  }
  revalidatePath("/");
  revalidatePath(`/${data.section}`);
  revalidatePath(`/${data.section}/${data.slug}`);
  if (existing && (existing.section !== data.section || existing.slug !== data.slug)) revalidatePath(`/${existing.section}/${existing.slug}`);
  revalidatePath("/search");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}
export async function deleteContentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin");
  const item = await db.content.findUnique({ where: { id } });
  if (item) {
    await db.content.delete({ where: { id } });
    revalidatePath(`/${item.section}`);
    revalidatePath(`/${item.section}/${item.slug}`);
    revalidatePath("/search");
    revalidatePath("/admin");
  }
  redirect(item?.section === "guides" ? "/admin/articles?deleted=1" : "/admin?deleted=1");
}
export async function toggleStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const item = await db.content.findUnique({ where: { id } });
  if (!item) redirect("/admin");
  await db.content.update({
    where: { id },
    data: {
      status: item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
      publishedAt: item.status === "PUBLISHED" ? null : new Date(),
    },
  });
  revalidatePath(`/${item.section}`);
  revalidatePath(`/${item.section}/${item.slug}`);
  revalidatePath("/search");
  revalidatePath("/admin");
  redirect("/admin?updated=1");
}

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  section: z.enum(["guides", "projects", "cost-guides", "materials-tools", "design-ideas", "home-maintenance"]),
});
export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect("/admin/categories?error=validation");
  const { id, name, section } = parsed.data;
  const slug = `${section}-${slugify(name)}`;
  const duplicate = await db.category.findUnique({ where: { slug } });
  if (duplicate && duplicate.id !== id) redirect("/admin/categories?error=duplicate");
  if (id) {
    const existing = await db.category.findUnique({ where: { id }, include: { contents: { select: { id: true } } } });
    if (!existing) redirect("/admin/categories?error=missing");
    if (existing.section !== section && existing.contents.length) redirect("/admin/categories?error=section");
    await db.$transaction(async tx => {
      await tx.category.update({ where: { id }, data: { name, slug, section } });
      await tx.content.updateMany({ where: { categoryId: id }, data: { category: name } });
    });
  } else await db.category.create({ data: { name, slug, section } });
  revalidatePath("/admin/categories");
  revalidatePath("/admin/content");
  redirect("/admin/categories?saved=1");
}
export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const category = await db.category.findUnique({ where: { id }, include: { _count: { select: { contents: true } } } });
  if (!category || category._count.contents) redirect("/admin/categories?error=in-use");
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  redirect("/admin/categories?deleted=1");
}

export async function duplicateArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const source = await db.content.findUnique({ where: { id } });
  if (!source || source.section !== "guides") redirect("/admin/articles?error=missing");
  const suffix = crypto.randomUUID().slice(0, 8);
  const copy = await db.content.create({ data: {
    section: "guides", slug: `${source.slug.slice(0, 165)}-copy-${suffix}`,
    title: `${source.title.slice(0, 145)} (Copy)`, summary: source.summary,
    category: source.category, categoryId: source.categoryId,
    body: source.body as import("@prisma/client").Prisma.InputJsonValue,
    related: source.related as import("@prisma/client").Prisma.InputJsonValue,
    tools: source.tools as import("@prisma/client").Prisma.InputJsonValue,
    materials: source.materials as import("@prisma/client").Prisma.InputJsonValue,
    safety: source.safety, seoTitle: source.seoTitle, seoDescription: source.seoDescription,
    status: "DRAFT", publishedAt: null,
  } });
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/edit/${copy.id}?duplicated=1`);
}

export async function articleStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "PUBLISHED" && status !== "DRAFT") redirect("/admin/articles?error=status");
  const item = await db.content.findUnique({ where: { id } });
  if (!item || item.section !== "guides") redirect("/admin/articles?error=missing");
  if (status === "PUBLISHED") {
    const document = validateRichDoc(legacyToRich(item.body));
    if (item.title.length < 3 || item.summary.length < 20 || !document.ok || document.text.length < 30) redirect("/admin/articles?error=validation");
  }
  await db.content.update({ where: { id }, data: { status, publishedAt: status === "PUBLISHED" ? (item.publishedAt ?? new Date()) : null } });
  revalidatePath("/guides"); revalidatePath(`/guides/${item.slug}`); revalidatePath("/search"); revalidatePath("/admin/articles");
  redirect("/admin/articles?updated=1");
}
