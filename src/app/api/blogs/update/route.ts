// app/api/blogs/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { generateSlug, generateExcerpt, isValidUrl } from "@/lib/blog-utils";
import { revalidateTag } from "next/cache";

interface UpdateBlogData {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string | null;
  published?: boolean;
}

export async function PUT(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      // Validate ID
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          {
            error: "Valid blog ID is required",
            code: "INVALID_ID",
          },
          { status: 400 }
        );
      }

      const blogId = parseInt(id);
      const requestBody = await req.json();

      // Check if blog exists
      const existingBlog = await prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!existingBlog) {
        return NextResponse.json(
          {
            error: "Blog post not found",
            code: "BLOG_NOT_FOUND",
          },
          { status: 404 }
        );
      }

      const { title, slug, content, excerpt, coverImage, published } = requestBody;
      const updates: UpdateBlogData = {};
      const cacheTagsToRevalidate = new Set<string>(["blogs", `blog-${blogId}`]);

      // Validate and prepare title update
      if (title !== undefined) {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
          return NextResponse.json(
            {
              error: "Title cannot be empty",
              code: "EMPTY_TITLE",
            },
            { status: 400 }
          );
        }

        if (trimmedTitle.length > 200) {
          return NextResponse.json(
            {
              error: "Title must not exceed 200 characters",
              code: "TITLE_TOO_LONG",
            },
            { status: 400 }
          );
        }

        updates.title = trimmedTitle;
      }

      // Validate and prepare slug update
      if (slug !== undefined) {
        const trimmedSlug = slug.trim();

        if (!trimmedSlug) {
          return NextResponse.json(
            {
              error: "Slug cannot be empty",
              code: "EMPTY_SLUG",
            },
            { status: 400 }
          );
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
          return NextResponse.json(
            {
              error: "Slug can only contain lowercase letters, numbers, and hyphens",
              code: "INVALID_SLUG_FORMAT",
            },
            { status: 400 }
          );
        }

        // Check if slug is being changed and if it conflicts
        if (trimmedSlug !== existingBlog.slug) {
          const existingSlug = await prisma.blog.findUnique({
            where: { slug: trimmedSlug },
          });

          if (existingSlug) {
            return NextResponse.json(
              {
                error: "This slug is already in use",
                code: "SLUG_CONFLICT",
                suggestion: `${trimmedSlug}-${Date.now().toString().slice(-4)}`,
              },
              { status: 409 }
            );
          }

          updates.slug = trimmedSlug;
          cacheTagsToRevalidate.add(`blog-${existingBlog.slug}`);
        }
      }

      // Auto-generate slug if title changed but slug not provided
      if (title !== undefined && slug === undefined) {
        const generatedSlug = generateSlug(updates.title || existingBlog.title);

        if (generatedSlug !== existingBlog.slug) {
          const existingSlug = await prisma.blog.findUnique({
            where: { slug: generatedSlug },
          });

          if (!existingSlug) {
            updates.slug = generatedSlug;
            cacheTagsToRevalidate.add(`blog-${existingBlog.slug}`);
          }
        }
      }

      // Validate and prepare content update
      if (content !== undefined) {
        const trimmedContent = content.trim();

        if (!trimmedContent) {
          return NextResponse.json(
            {
              error: "Content cannot be empty",
              code: "EMPTY_CONTENT",
            },
            { status: 400 }
          );
        }

        updates.content = trimmedContent;
      }

      // Validate and prepare excerpt update
      if (excerpt !== undefined) {
        const trimmedExcerpt = excerpt.trim();

        if (trimmedExcerpt.length > 300) {
          return NextResponse.json(
            {
              error: "Excerpt must not exceed 300 characters",
              code: "EXCERPT_TOO_LONG",
            },
            { status: 400 }
          );
        }

        updates.excerpt = trimmedExcerpt;
      } else if (content !== undefined) {
        // Auto-generate excerpt if content changed but excerpt not provided
        updates.excerpt = generateExcerpt(content);
      }

      // Validate and prepare cover image update
      if (coverImage !== undefined) {
        if (coverImage && !isValidUrl(coverImage)) {
          return NextResponse.json(
            {
              error: "Cover image must be a valid URL",
              code: "INVALID_COVER_IMAGE",
            },
            { status: 400 }
          );
        }

        if (coverImage && !coverImage.includes("cloudinary.com")) {
          return NextResponse.json(
            {
              error: "Cover image must be a valid Cloudinary URL",
              code: "INVALID_CLOUDINARY_URL",
            },
            { status: 400 }
          );
        }

        updates.coverImage = coverImage || null;
      }

      // Prepare published status update
      if (published !== undefined) {
        updates.published = Boolean(published);

        if (published || existingBlog.published) {
          cacheTagsToRevalidate.add("published-blogs");
        }
      }

      // Check if there are actual updates
      if (Object.keys(updates).length === 0) {
        return NextResponse.json(
          {
            error: "No valid fields to update",
            code: "NO_UPDATES",
          },
          { status: 400 }
        );
      }

      // Update the blog post
      const updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: updates,
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

      // Revalidate cache tags
      Array.from(cacheTagsToRevalidate).forEach((tag) => {
        revalidateTag(tag);
      });

      return NextResponse.json(
        {
          message: "Blog post updated successfully",
          blog: updatedBlog,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Blog update error:", error);

      // Handle specific Prisma errors
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "Slug conflict - please try a different slug",
            code: "SLUG_CONFLICT",
          },
          { status: 409 }
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error: "Blog post not found",
            code: "BLOG_NOT_FOUND",
          },
          { status: 404 }
        );
      }

      // Handle database connection errors
      if (error.code === "P1001" || error.code === "P1017") {
        return NextResponse.json(
          {
            error: "Database connection issue - please try again",
            code: "DATABASE_UNAVAILABLE",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "An unexpected error occurred",
          code: "INTERNAL_SERVER_ERROR",
        },
        { status: 500 }
      );
    }
  });
}
