import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
export const db =
  globalForPrisma.prisma ??
  new PrismaClient(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
export const databaseConfigured = Boolean(databaseUrl);
