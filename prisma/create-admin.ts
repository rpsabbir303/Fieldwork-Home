import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 14 || !process.env.DATABASE_URL) {
  console.error(
    "Set DATABASE_URL, ADMIN_EMAIL, and a unique ADMIN_PASSWORD of at least 14 characters before running this command.",
  );
  process.exit(1);
}
const db = new PrismaClient();
async function main() {
  if ((await db.adminUser.count()) !== 0) {
    throw new Error("An administrator already exists. Initial account creation stopped.");
  }
  const passwordHash = await hash(password!, 12);
  await db.adminUser.create({ data: { email: email!, passwordHash } });
  const admin = await db.adminUser.findUnique({ where: { email: email! } });
  if (!admin?.active || !(await compare(password!, admin.passwordHash)) || (await db.adminUser.count()) !== 1) {
    throw new Error("Administrator verification failed.");
  }
  console.log("Initial administrator created and password authentication verified.");
}
main()
  .catch(() => {
    console.error("Administrator setup failed. Check database connectivity and account state.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
