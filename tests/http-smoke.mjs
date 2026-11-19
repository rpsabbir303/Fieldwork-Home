const base = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const paths = [
  "/",
  "/calculators",
  "/calculators/paint",
  "/calculators/tile",
  "/calculators/drywall",
  "/projects",
  "/projects/paint-an-interior-room",
  "/projects/category/painting",
  "/guides",
  "/guides/choosing-interior-paint-finish",
  "/cost-guides",
  "/cost-guides/interior-painting-budget",
  "/materials-tools",
  "/materials-tools/porcelain-vs-ceramic-tile",
  "/design-ideas",
  "/home-maintenance/spring-home-checklist",
  "/search?q=paint",
  "/search?q=unfindablephrase",
  "/about",
  "/privacy",
  "/sitemap.xml",
  "/robots.txt",
  "/admin",
  "/admin/new",
  "/admin/login",
];
let failed = false;
for (const path of paths) {
  const response = await fetch(base + path, { redirect: "manual" });
  console.log(response.status, path);
  const expected = path === "/admin" || path === "/admin/new" ? 307 : 200;
  if (response.status !== expected) failed = true;
}
if (failed) process.exitCode = 1;
