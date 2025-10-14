"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Menu, Moon, Sun, ArrowUpRight, Github, Linkedin, Mail, ExternalLink, Download } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

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
}

interface HomePageClientProps {
  projects: Project[];
}

export function HomePageClient({ projects }: HomePageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [currentImage, setCurrentImage] = useState("/images/portrait-light.png");
  const [isLoading, setIsLoading] = useState(true);

  // Page loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Theme initialization - ONLY ON MOUNT
  useEffect(() => {
    setMounted(true);
    const ls = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = ls ? ls === "dark" : prefersDark;
    setDark(shouldDark);
    setCurrentImage(shouldDark ? "/images/portrait-dark.jpg" : "/images/portrait-light.png");
  }, []);

  // Listen for theme changes from navbar - FIXED VERSION
  useEffect(() => {
    const handleThemeChange = (event: any) => {
      // Get the latest theme from the event or localStorage
      const newDark = event.detail !== undefined ? event.detail : localStorage.getItem("theme") === "dark";
      setDark(newDark);
      setCurrentImage(newDark ? "/images/portrait-dark.jpg" : "/images/portrait-light.png");
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []); // Remove 'dark' dependency to avoid stale closures

  // Also listen for storage changes (backup)
  useEffect(() => {
    const handleStorageChange = () => {
      const isDark = localStorage.getItem("theme") === "dark";
      setDark(isDark);
      setCurrentImage(isDark ? "/images/portrait-dark.jpg" : "/images/portrait-light.png");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/projects", label: "Projects" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    []
  );

  const skills = [
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "Express",
    "Mongoose ",
    "Prisma",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Redux",
    // "tRPC",
    // "GraphQL",
    // "Docker",
    // "AWS",
    // "CI/CD",
    "Git",
    "Tailwind",
    "Testing",
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.status === 401) {
        toast.error("Email service unavailable. Opening your email client…");
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name || ""}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:rashedulislam.edge@gmail.com?subject=${subject}&body=${body}`;
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message");
      }
      toast.success("Message sent! I'll get back to you shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Micro-animations variants
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
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
          <p className="text-muted-foreground">Loading portfolio...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      id="home"
      className="min-h-screen font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 !flex">
        <div className="mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-10 !w-[1152px] !h-full !max-w-6xl">
          {/* Portrait Image with Theme Sync */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="group relative mx-auto h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 order-1 md:order-2"
          >
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent blur-xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-xl ring-1 ring-border/60 shadow-lg bg-card">
              <motion.div
                key={currentImage} // Force re-render when image changes
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="size-full"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse rounded-lg" />
                )}

                <Image
                  src={currentImage}
                  alt="Rashedul Islam portrait"
                  className={`size-full object-cover transition-all duration-500 ${
                    isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
                  }`}
                  width={320}
                  height={400}
                  priority
                  onLoad={() => setIsLoading(false)}
                  onLoadingComplete={() => setIsLoading(false)}
                />
                {/* <Image
                  src={currentImage}
                  alt="Rashedul Islam portrait"
                  className="size-full object-cover"
                  width={320}
                  height={400}
                  priority
                /> */}
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="max-w-3xl order-2 md:order-1"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="size-2 rounded-full bg-emerald-500"
              />
              Available for senior full-stack roles & consulting
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl sm:text-6xl font-semibold tracking-tight">
              Rashedul Islam
            </motion.h1>

            <motion.p variants={fadeIn} className="mt-3 text-lg text-muted-foreground">
              Senior Full Stack Developer specializing in scalable web platforms, data-intensive systems, and beautiful
              UX.
            </motion.p>

            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#projects">
                  View Projects <ArrowUpRight className="ml-1 size-4" />
                </a>
              </Button>
              {/* <Button asChild variant="secondary">
                <a href="/contact">
                  Contact Me <Mail className="ml-1 size-4" />
                </a>
              </Button> */}
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => toast.error("Resume will be available soon ")}
              >
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </motion.div>

            <motion.ul
              variants={staggerChildren}
              initial="initial"
              animate="animate"
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground text-center"
            >
              {[
                { value: "2+ yrs", label: "experience" },
                { value: "15+", label: "projects shipped" },
                { value: "1", label: "companies served" },
              ].map((stat, index) => (
                <motion.li key={stat.value} variants={fadeIn} className="rounded-md border p-3">
                  <span className="text-foreground font-medium">{stat.value}</span>
                  <br />
                  {stat.label}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-10 flex items-end justify-between"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">Featured Projects</h2>
              <p className="text-muted-foreground mt-1">A few things I've built recently.</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <a href="/projects" rel="noreferrer">
                Explore all <ArrowUpRight className="ml-1 size-4" />
              </a>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const tags = typeof project.tags === "string" ? JSON.parse(project.tags) : project.tags || [];
              const defaultImage =
                "https://images.unsplash.com/photo-1557825835-70d97c4aa451?q=80&w=1600&auto=format&fit=crop";

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="overflow-hidden group border-muted/70 hover:border-primary/40 transition h-full flex flex-col bg-muted/30 hover:cursor-pointer">
                    <div className="relative h-22 overflow-hidden">
                      <div className="h-12 w-12 ml-10">
                        <img
                          src={project.thumbnail || defaultImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl flex items-start justify-between gap-2">
                        <span>{project.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {project.projectUrl && (
                            <Button asChild variant="outline" size="sm" className="flex-1">
                              <a href={project.projectUrl} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-2 size-4" />
                                Website
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button asChild variant="outline" size="sm" className="flex-1">
                              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                                <Github className="mr-2 size-4" />
                                Source
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / Skills Section */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2"
          >
            <div className="hidden sm:inline-flex">
              <Link href="/about" className="flex align-middle justify-center" rel="noreferrer">
                <h2 className="text-2xl sm:text-3xl font-semibold">About</h2>
                <ArrowUpRight className="ml-1 size-6 text-muted-foreground hover:text-primary" />
              </Link>
            </div>
            <p className="mt-3 text-primary">
              I am an experienced Full-Stack Developer with a 2+ year track record of building and scaling comprehensive
              software solutions. My core strength lies in full-spectrum development: designing robust backend
              architecture for reliability and performance, and implementing smooth, modern UIs. I am passionate about
              optimizing the entire development lifecycle, constantly looking for ways to improve performance, enhance
              the developer experience, and maintain elegant design standards.
            </p>
            <div className="mt-6">
              <div className="text-xl text-muted-foreground">Previously contributed to</div>
              <ul className="mt-2 list-disc pl-5 text-balance">
                <li>Fintech analytics platforms at scale</li>
                <li>Headless commerce and marketplaces</li>
                <li>Realtime collaboration tooling</li>
              </ul>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Skills & Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={staggerChildren}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                >
                  {skills.map((s, index) => (
                    <motion.div
                      key={s}
                      variants={scaleIn}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-card"
                    >
                      <span>{s}</span>
                      <span className="text-muted-foreground">★</span>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold">Let's build something</h2>
            <p className="text-muted-foreground mt-1">
              Interested in working together or have a question? Drop a message.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-wrap gap-3"
            >
              <Button asChild variant="secondary">
                <a href="mailto:rashedulislam.edge@gmail.com">
                  <Mail className="mr-2 size-4" /> Email
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://github.com/rashedul-dev" target="_blank" rel="noreferrer">
                  <Github className="mr-2 size-4" /> GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://www.linkedin.com/in/rashedul-dev/" target="_blank" rel="noreferrer">
                  <Linkedin className="mr-2 size-4" /> LinkedIn
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={submitting}
                        className="dark:bg-muted/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={submitting}
                        className="dark:bg-muted/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Hi Rashedul, I'd love to talk about…"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={submitting}
                        className="dark:bg-muted/20"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Sends directly to my inbox</span>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Sending…" : "Send"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t py-10"
      >
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}Rashedul Islam. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#home" className="hover:underline">
              Top
            </a>
            <a href="#projects" className="hover:underline">
              Projects
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
