import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

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
  const passwordHash = await hash(password!, 12);
  await db.adminUser.upsert({
    where: { email: email! },
    update: { passwordHash, active: true },
    create: { email: email!, passwordHash },
  });
  console.log(
    `Admin account ready for ${email}. Clear ADMIN_PASSWORD from your shell or environment file after setup.`,
  );
}
main().finally(() => db.$disconnect());
