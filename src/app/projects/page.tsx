import { prisma } from "@/lib/prisma";
import { ProjectsPageClient } from "@/components/projects-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Rashedul Islam",
  description: "Explore my portfolio of full-stack development projects and open-source contributions.",
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function ProjectsPage() {
  // Fetch all projects with ISR
  const projects = (
    await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
  ).map((p) => ({
    ...p,
    tags: p.tags ?? "",
  }));

  return <ProjectsPageClient projects={projects} />;
}
