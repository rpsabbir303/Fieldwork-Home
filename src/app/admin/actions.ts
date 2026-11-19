"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSession, clearSession, requireAdmin } from "@/lib/auth";
import { db, databaseConfigured } from "@/lib/db";
import { SectionKey, slugify } from "@/lib/content";

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
    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
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
  redirect("/admin?deleted=1");
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
