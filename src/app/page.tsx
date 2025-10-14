import { prisma } from "@/lib/prisma";
import { HomePageClient } from "@/components/homepage-client";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function Home() {
  // Fetch featured projects from database with ISR
  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return <HomePageClient projects={featuredProjects} />;
}
