// app/api/blogs/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { generateSlug, generateExcerpt, isValidUrl } from "@/lib/blog-utils";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const requestBody = await req.json();
      const { title, slug, content, excerpt, coverImage, published } = requestBody;

      // Validate required fields
      if (!title?.trim()) {
        return NextResponse.json(
          {
            error: "Title is required",
            code: "MISSING_TITLE",
          },
          { status: 400 }
        );
      }

      // Validate title length
      if (title.trim().length > 200) {
        return NextResponse.json(
          {
            error: "Title must not exceed 200 characters",
            code: "TITLE_TOO_LONG",
          },
          { status: 400 }
        );
      }

      // Validate content length
      if (!content?.trim()) {
        return NextResponse.json(
          {
            error: "Content is required",
            code: "MISSING_CONTENT",
          },
          { status: 400 }
        );
      }

      // Validate excerpt length if provided
      if (excerpt && excerpt.length > 300) {
        return NextResponse.json(
          {
            error: "Excerpt must not exceed 300 characters",
            code: "EXCERPT_TOO_LONG",
          },
          { status: 400 }
        );
      }

      // Validate cover image URL if provided
      if (coverImage && !isValidUrl(coverImage)) {
        return NextResponse.json(
          {
            error: "Cover image must be a valid URL",
            code: "INVALID_COVER_IMAGE_URL",
          },
          { status: 400 }
        );
      }

      // Validate Cloudinary URL if provided
      if (coverImage && !coverImage.includes("cloudinary.com")) {
        return NextResponse.json(
          {
            error: "Cover image must be a valid Cloudinary URL",
            code: "INVALID_CLOUDINARY_URL",
          },
          { status: 400 }
        );
      }

      // Generate slug if not provided
      const finalSlug = slug?.trim() || generateSlug(title.trim());

      // Validate slug format
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(finalSlug)) {
        return NextResponse.json(
          {
            error: "Slug can only contain lowercase letters, numbers, and hyphens",
            code: "INVALID_SLUG_FORMAT",
          },
          { status: 400 }
        );
      }

      // Check if slug already exists
      const existingBlog = await prisma.blog.findUnique({
        where: { slug: finalSlug },
      });

      if (existingBlog) {
        return NextResponse.json(
          {
            error: "A blog with this slug already exists",
            code: "DUPLICATE_SLUG",
            suggestion: `${finalSlug}-${Date.now().toString().slice(-4)}`,
          },
          { status: 409 }
        );
      }

      // Auto-generate excerpt if not provided
      const finalExcerpt = excerpt?.trim() || generateExcerpt(content);

      // Set default cover image if not provided
      const finalCoverImage = coverImage || null;

      const newBlog = await prisma.blog.create({
        data: {
          title: title.trim(),
          slug: finalSlug,
          content: content.trim(),
          excerpt: finalExcerpt,
          coverImage: finalCoverImage,
          published: published || false,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Revalidate relevant cache tags
      revalidateTag("blogs");
      if (published) {
        revalidateTag("published-blogs");
      }

      return NextResponse.json(
        {
          message: "Blog created successfully",
          blog: newBlog,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Blog creation error:", error);

      // Handle Prisma errors
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "A blog with this slug already exists",
            code: "DUPLICATE_SLUG",
          },
          { status: 409 }
        );
      }

      // Handle database connection errors
      if (error.code === "P1001" || error.code === "P1017") {
        return NextResponse.json(
          {
            error: "Database connection error. Please try again.",
            code: "DATABASE_ERROR",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        },
        { status: 500 }
      );
    }
  });
}
