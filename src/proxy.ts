import { NextResponse, type NextRequest } from "next/server";

// Deploy the same commit twice with APP_MODE=public and APP_MODE=admin.
// This routing boundary is in addition to authorization inside every admin action.
export function proxy(request: NextRequest) {
  const mode = process.env.APP_MODE;
  const path = request.nextUrl.pathname;
  if (mode === "public" && (path === "/admin" || path.startsWith("/admin/"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (mode === "admin") {
    const expectedHost = process.env.ADMIN_HOSTNAME?.toLowerCase();
    const host = request.headers.get("host")?.split(":")[0].toLowerCase();
    if (expectedHost && host !== expectedHost) return new NextResponse("Not found", { status: 404 });
    if (path === "/") return NextResponse.rewrite(new URL("/admin", request.url));
    if (path === "/login") return NextResponse.rewrite(new URL("/admin/login", request.url));
    if (!(path === "/admin" || path.startsWith("/admin/") || path.startsWith("/_next/") || path === "/icon.svg" || path === "/favicon.ico")) {
      return new NextResponse("Not found", { status: 404 });
    }
  }
  return NextResponse.next();
}
