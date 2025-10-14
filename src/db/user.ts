import { hashPassword } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUsers() {
  // Get passwords from environment variables
  const demoAdminPassword = process.env.SEED_ADMIN_PASSWORD;
  const mainAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;

  // Require environment variables in production
  if (!demoAdminPassword || !mainAdminPassword) {
    console.log("❌ User seeding failed: SEED_ADMIN_PASSWORD and SEED_SUPER_ADMIN_PASSWORD must be set");
    process.exit(1);
  }

  try {
    // Create demo admin user
    const hashedDemoPassword = await hashPassword(demoAdminPassword);
    const adminUserDemo = await prisma.user.upsert({
      where: { email: "admin@portfolio.com" },
      update: {},
      create: {
        email: "admin@portfolio.com",
        password: hashedDemoPassword,
        name: "Demo Admin User",
        role: "admin",
      },
    });
    console.log("✅ Demo Admin user created:", adminUserDemo.email);

    // Create main admin user
    const hashedMainPassword = await hashPassword(mainAdminPassword);
    const adminUser = await prisma.user.upsert({
      where: { email: "rashedulislam.edge@gmail.com" },
      update: {},
      create: {
        email: "rashedulislam.edge@gmail.com",
        password: hashedMainPassword,
        name: "Rashedul Islam",
        role: "admin",
      },
    });
    console.log("✅ Main Admin user created:", adminUser.email);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
