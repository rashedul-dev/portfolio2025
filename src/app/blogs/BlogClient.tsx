"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Page loading animation - matches home page timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?published=true", {
          next: {
            revalidate: 3600, // 1 hour
            tags: ["blogs"],
          },
        });

        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Animation variants - consistent with home page
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

  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading || !isMounted) {
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
          <p className="text-muted-foreground">Loading blogs...</p>
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
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold">
              Blog
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-2 text-muted-foreground">
              Insights on software development, architecture, and best practices
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          {blogs.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <h2 className="text-2xl font-semibold text-muted-foreground">No blog posts yet</h2>
              <p className="mt-2 text-muted-foreground">Check back soon for new content!</p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/blogs/${blog.slug}`} className="group">
        <Card className="overflow-hidden group border-muted/70 hover:border-primary/40 transition h-full flex flex-col bg-background hover:cursor-pointer">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative p-4 h-48 overflow-hidden">
              <motion.img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-lg flex items-start justify-between gap-2 group-hover:text-primary transition">
              <span className="line-clamp-2">{blog.title}</span>
              <motion.div whileHover={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                <ArrowUpRight className="size-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {blog.excerpt && (
              <motion.p
                className="text-sm text-muted-foreground line-clamp-3"
                whileHover={{ color: "hsl(var(--foreground))" }}
                transition={{ duration: 0.2 }}
              >
                {blog.excerpt}
              </motion.p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{estimateReadTime(blog.content || "")}</span>
              </div>
            </div>

            <Badge variant="secondary" className="rounded-md">
              Published
            </Badge>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
