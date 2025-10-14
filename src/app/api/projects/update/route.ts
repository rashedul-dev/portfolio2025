// app/api/projects/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { generateSlug, isValidUrl } from "@/lib/blog-utils"; // Using blog-utils since project-utils might not exist

export async function PUT(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          {
            error: "Valid project ID is required",
            code: "INVALID_ID",
          },
          { status: 400 }
        );
      }

      const projectId = parseInt(id);
      const requestBody = await req.json();

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!existingProject) {
        return NextResponse.json(
          {
            error: "Project not found",
            code: "PROJECT_NOT_FOUND",
          },
          { status: 404 }
        );
      }

      const { title, slug, description, content, thumbnail, projectUrl, githubUrl, tags, featured } = requestBody;
      const updates: any = {};

      // Validate and update fields
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
              error: "Title must be 200 characters or less",
              code: "TITLE_TOO_LONG",
            },
            { status: 400 }
          );
        }
        updates.title = trimmedTitle;
      }

      if (description !== undefined) {
        const trimmedDescription = description.trim();
        if (trimmedDescription.length > 500) {
          return NextResponse.json(
            {
              error: "Description must be 500 characters or less",
              code: "DESCRIPTION_TOO_LONG",
            },
            { status: 400 }
          );
        }
        updates.description = trimmedDescription;
      }

      // Handle slug update
      if (slug !== undefined || title !== undefined) {
        const finalSlug = slug?.trim() || (title ? generateSlug(title.trim()) : existingProject.slug);

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

        // Check for duplicate slug only if it's different from current
        if (finalSlug !== existingProject.slug) {
          const duplicateProject = await prisma.project.findUnique({
            where: { slug: finalSlug },
          });

          if (duplicateProject) {
            return NextResponse.json(
              {
                error: "A project with this slug already exists",
                code: "DUPLICATE_SLUG",
                suggestion: `${finalSlug}-${Date.now().toString().slice(-4)}`,
              },
              { status: 409 }
            );
          }
        }
        updates.slug = finalSlug;
      }

      // Validate and update thumbnail
      if (thumbnail !== undefined) {
        if (thumbnail && !isValidUrl(thumbnail)) {
          return NextResponse.json(
            {
              error: "Thumbnail must be a valid URL",
              code: "INVALID_THUMBNAIL_URL",
            },
            { status: 400 }
          );
        }

        // Validate Cloudinary URL specifically
        if (thumbnail && !thumbnail.includes("cloudinary.com")) {
          return NextResponse.json(
            {
              error: "Thumbnail must be a valid Cloudinary URL",
              code: "INVALID_CLOUDINARY_URL",
            },
            { status: 400 }
          );
        }
        updates.thumbnail = thumbnail || null;
      }

      // Validate and update URLs
      if (projectUrl !== undefined) {
        if (projectUrl && !isValidUrl(projectUrl)) {
          return NextResponse.json(
            {
              error: "Project URL must be a valid URL",
              code: "INVALID_PROJECT_URL",
            },
            { status: 400 }
          );
        }
        updates.projectUrl = projectUrl || null;
      }

      if (githubUrl !== undefined) {
        if (githubUrl && !isValidUrl(githubUrl)) {
          return NextResponse.json(
            {
              error: "GitHub URL must be a valid URL",
              code: "INVALID_GITHUB_URL",
            },
            { status: 400 }
          );
        }
        updates.githubUrl = githubUrl || null;
      }

      // Parse and validate tags
      if (tags !== undefined) {
        let parsedTags: string[] = [];

        if (Array.isArray(tags)) {
          parsedTags = tags.slice(0, 10); // Limit to 10 tags
        } else if (typeof tags === "string") {
          try {
            const tempTags = JSON.parse(tags);
            parsedTags = Array.isArray(tempTags) ? tempTags.slice(0, 10) : [];
          } catch {
            parsedTags = tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
              .slice(0, 10);
          }
        }

        // Validate each tag length
        for (const tag of parsedTags) {
          if (tag.length > 20) {
            return NextResponse.json(
              {
                error: "Each tag must be 20 characters or less",
                code: "TAG_TOO_LONG",
              },
              { status: 400 }
            );
          }
        }

        updates.tags = parsedTags;
      }

      // Update content if provided
      if (content !== undefined) {
        updates.content = content;
      }

      // Update featured status
      if (featured !== undefined) {
        updates.featured = Boolean(featured);
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

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: updates,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
          projectUrl: true,
          githubUrl: true,
          tags: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json(
        {
          message: "Project updated successfully",
          project: updatedProject,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Project update error:", error);

      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "A project with this slug already exists",
            code: "DUPLICATE_SLUG",
          },
          { status: 409 }
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error: "Project not found",
            code: "PROJECT_NOT_FOUND",
          },
          { status: 404 }
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
