import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Get passwords from environment variables
  const demoAdminPassword = process.env.SEED_ADMIN_PASSWORD;
  const mainAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;

  // Require environment variables
  if (!demoAdminPassword || !mainAdminPassword) {
    console.log("❌ Seeding failed: SEED_ADMIN_PASSWORD and SEED_SUPER_ADMIN_PASSWORD must be set");
    process.exit(1);
  }

  await seedUsers(demoAdminPassword, mainAdminPassword);
  await seedBlogs();
  await seedProjects();

  console.log("🎉 Database seeding completed!");
}

async function seedUsers(demoAdminPassword: string, mainAdminPassword: string) {
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
}

async function seedBlogs() {
  const existingBlogs = await prisma.blog.findMany();
  if (existingBlogs.length === 0) {
    await prisma.blog.create({
      data: {
        title: "Welcome to My Portfolio",
        slug: "welcome-to-my-portfolio",
        content: "This is my first blog post. Welcome to my portfolio website!",
        excerpt: "Introduction to my portfolio and journey as a developer",
        published: true,
      },
    });
    console.log("✅ Sample blog created");
  } else {
    console.log("✅ Already has some Blogs");
  }
}

async function seedProjects() {
  const existingProjects = await prisma.project.findMany();
  if (existingProjects.length === 0) {
    await prisma.project.create({
      data: {
        title: "Portfolio Website",
        slug: "portfolio-website",
        description: "My personal portfolio built with Next.js",
        content: "This project showcases my skills in web development.",
        thumbnail: "https://placehold.co/600x400/png",
        projectUrl: "https://yourportfolio.com",
        githubUrl: "https://github.com/yourusername/portfolio",
        tags: [],
        featured: true,
      },
    });
    console.log("✅ Sample project created");
  } else {
    console.log("✅ Already has some Projects");
  }
}

main()
  .catch((error) => {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
