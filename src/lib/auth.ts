import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db, databaseConfigured } from "./db";

const cookieName = "fieldwork_admin";
function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function createSession(adminId: string) {
  const secret = key();
  if (!secret) throw new Error("SESSION_SECRET must contain at least 32 characters.");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}
export async function clearSession() {
  (await cookies()).delete(cookieName);
}
export async function getAdmin() {
  if (!databaseConfigured) return null;
  const secret = key();
  if (!secret) return null;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (payload.role !== "admin" || !payload.sub) return null;
    return await db.adminUser.findFirst({
      where: { id: payload.sub, active: true },
      select: { id: true, email: true },
    });
  } catch {
    return null;
  }
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
