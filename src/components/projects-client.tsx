"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Github, ExternalLink, Filter } from "lucide-react";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  tags: string[];
  featured: boolean;
  createdAt: Date;
}

interface ProjectsPageClientProps {
  projects: Project[];
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Page loading animation - matches home page timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Extract all unique tags - FIXED: Better error handling and type safety
  const allTags = Array.from(
    new Set(
      projects
        .flatMap((p) => {
          try {
            if (Array.isArray(p.tags)) {
              return p.tags;
            }
            if (typeof p.tags === "string") {
              const parsed = JSON.parse(p.tags);
              return Array.isArray(parsed) ? parsed : [];
            }
            return [];
          } catch {
            return [];
          }
        })
        .filter(Boolean) // Remove any empty/null/undefined tags
    )
  ).sort(); // Sort tags for consistent display

  // Filter projects based on search and tag - FIXED: Moved to useEffect to prevent stale closures
  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        searchTerm === "" ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!selectedTag) return matchesSearch;

      try {
        let tags: string[] = [];
        if (Array.isArray(project.tags)) {
          tags = project.tags;
        } else if (typeof project.tags === "string") {
          tags = JSON.parse(project.tags);
        }
        return matchesSearch && Array.isArray(tags) && tags.includes(selectedTag);
      } catch {
        return matchesSearch;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedTag]);

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // FIXED: Clear both filters function
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="size-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading projects...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <header className="">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold">
              All Projects
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted-foreground mt-2">
              A collection of my work in full-stack development, open-source, and side projects.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Filters */}
      <section className=" bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10  dark:bg-black"
            />
          </motion.div>

          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="size-4" />
                <span>Filter by technology:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            {(searchTerm || selectedTag) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-12 ">
          <div className="mx-auto max-w-6xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-2xl font-semibold mb-6"
            >
              Featured Projects
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-2xl font-semibold mb-6"
            >
              All Projects
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {otherProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i + featuredProjects.length} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 text-center">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
          <Button variant="ghost" className="mt-4" onClick={clearFilters}>
            Clear Filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // FIXED: Better tag parsing with proper error handling
  const tags = (() => {
    try {
      if (Array.isArray(project.tags)) {
        return project.tags;
      }
      if (typeof project.tags === "string") {
        const parsed = JSON.parse(project.tags);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  })();

  const defaultImage = "https://images.unsplash.com/photo-1557825835-70d97c4aa451?q=80&w=1600&auto=format&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden group border-muted/70 hover:border-primary/40 transition h-full flex flex-col bg-muted/30 ">
        <div className="relative h-22 overflow-hidden">
          <motion.img
            src={project.thumbnail || defaultImage}
            alt={project.title}
            className="w-12 h-12 ml-10 object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center justify-between gap-4">
            <span className="flex-1 truncate">{project.title}</span>
            {project.featured && (
              <Badge variant="default" className="shrink-0">
                Featured
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="rounded-md">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {project.projectUrl && (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a href={project.projectUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 size-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="mr-2 size-4" />
                    Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
