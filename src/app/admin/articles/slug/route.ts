import { getAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const id = url.searchParams.get("id") ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) {
    return Response.json({ available: false, message: "Use lowercase letters, numbers, and hyphens." }, { status: 422 });
  }
  const existing = await db.content.findUnique({ where: { section_slug: { section: "guides", slug } }, select: { id: true } });
  return Response.json({ available: !existing || existing.id === id }, { headers: { "cache-control": "no-store" } });
}
