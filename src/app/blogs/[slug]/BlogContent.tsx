"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogContentProps {
  blog: Blog;
}

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

export default function BlogContent({ blog }: BlogContentProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const estimateReadTime = (content: string | null | undefined) => {
    if (!content) return "0 min read";
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, "");
    const minutes = Math.ceil(plainText.split(/\s+/).length / wordsPerMinute);
    return `${minutes} min read`;
  };

  const prepareContent = (content: string | null) => {
    if (!content) return "<p>No content available.</p>";
    return content;
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/20 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="mx-auto max-w-4xl px-4 py-4">
          <motion.div whileHover={{ x: -2 }} transition={{ type: "spring", stiffness: 400 }}>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Back to all posts
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-12 bg-card/50"
      >
        <div className="mx-auto max-w-4xl px-4 space-y-6">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="rounded-md">
                {blog.published ? "Published" : "Draft"}
              </Badge>
              <div className="text-sm text-muted-foreground">Last updated: {formatDate(blog.updatedAt)}</div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight"
            >
              {blog.title}
            </motion.h1>

            {blog.excerpt && (
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed mt-4">
                {blog.excerpt}
              </motion.p>
            )}

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-4"
            >
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>Admin User</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{estimateReadTime(blog.content)}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Cover Image */}
      {blog.coverImage && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="py-8"
        >
          <div className="mx-auto max-w-4xl px-4">
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
              <motion.img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.section>
      )}

      {/* Blog Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="py-12"
      >
        <div className="mx-auto min-h-[50vh] max-w-4xl px-4">
          <motion.div
            className="
              /* Base typography */
              leading-7 text-foreground
              /* Paragraphs */
              [&_p]:mb-6 [&_p]:leading-relaxed
              /* Headings */
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:leading-tight
              [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-tight
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:leading-snug
              [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:leading-snug
              [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-2 [&_h5]:leading-snug
              [&_h6]:text-base [&_h6]:font-semibold [&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:leading-snug
              /* Lists */
              [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6
              [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:my-2 [&_li]:leading-relaxed
              /* Blockquotes */
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-muted/20 
              [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic
              [&_blockquote_p]:mb-0
              /* Code */
              [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-border
              [&_pre_code]:bg-transparent [&_pre_code]:p-0
              /* Links */
              [&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-transparent
              hover:[&_a]:border-primary [&_a]:transition-colors
              /* Images */
              [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-8 [&_img]:max-w-full [&_img]:mx-auto
              /* Text formatting */
              [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_s]:line-through
              /* Alignment */
              [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify
              [&_.ql-align-center_img]:mx-auto [&_.ql-align-right_img]:ml-auto [&_.ql-align-left_img]:mr-auto
              /* Line breaks */
              [&_br]:block [&_br]:mt-2
              /* Spacing between elements */
              [&_p+_h1]:mt-12 [&_p+_h2]:mt-10 [&_p+_h3]:mt-8 [&_p+_h4]:mt-6 [&_p+_h5]:mt-4 [&_p+_h6]:mt-3
              [&_h1+_p]:mt-2 [&_h2+_p]:mt-2 [&_h3+_p]:mt-1 [&_h4+_p]:mt-1 [&_h5+_p]:mt-1 [&_h6+_p]:mt-1
            "
            dangerouslySetInnerHTML={{
              __html: prepareContent(blog.content),
            }}
          />
        </div>
      </motion.article>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border-t bg-card py-8"
      >
        <div className="mx-auto max-w-4xl px-4 flex items-center justify-between">
          <div>
            <motion.div whileHover={{ x: -2 }} transition={{ type: "spring", stiffness: 400 }}>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                Back to all posts
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
            </motion.div>
            <a
              href="#top"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              Top
            </a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
