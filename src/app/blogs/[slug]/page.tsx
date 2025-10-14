import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import BlogContent from "./BlogContent";

const prisma = new PrismaClient();

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: {
      slug: slug,
      published: true,
    },
  });

  if (!blog) {
    notFound();
  }

  // Convert Date objects to strings
  const blogData = {
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };

  return <BlogContent blog={blogData} />;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, coverImage: true },
  });

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || "Read this blog post",
    openGraph: {
      title: blog.title,
      description: blog.excerpt || "Read this blog post",
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}
