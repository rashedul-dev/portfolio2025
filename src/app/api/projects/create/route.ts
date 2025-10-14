// app/api/projects/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";
import { generateSlug, isValidUrl } from "@/lib/blog-utils"; // Using blog-utils since project-utils might not exist

export async function POST(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const requestBody = await req.json();
      const { title, slug, description, content, thumbnail, projectUrl, githubUrl, tags, featured } = requestBody;

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

      if (!description?.trim()) {
        return NextResponse.json(
          {
            error: "Description is required",
            code: "MISSING_DESCRIPTION",
          },
          { status: 400 }
        );
      }

      // Validate field lengths
      if (title.trim().length > 200) {
        return NextResponse.json(
          {
            error: "Title must be 200 characters or less",
            code: "TITLE_TOO_LONG",
          },
          { status: 400 }
        );
      }

      if (description.trim().length > 500) {
        return NextResponse.json(
          {
            error: "Description must be 500 characters or less",
            code: "DESCRIPTION_TOO_LONG",
          },
          { status: 400 }
        );
      }

      // Validate URLs if provided
      if (thumbnail && !isValidUrl(thumbnail)) {
        return NextResponse.json(
          {
            error: "Thumbnail must be a valid URL",
            code: "INVALID_THUMBNAIL_URL",
          },
          { status: 400 }
        );
      }

      // Validate Cloudinary URL specifically for thumbnails
      if (thumbnail && !thumbnail.includes("cloudinary.com")) {
        return NextResponse.json(
          {
            error: "Thumbnail must be a valid Cloudinary URL",
            code: "INVALID_CLOUDINARY_URL",
          },
          { status: 400 }
        );
      }

      if (projectUrl && !isValidUrl(projectUrl)) {
        return NextResponse.json(
          {
            error: "Project URL must be a valid URL",
            code: "INVALID_PROJECT_URL",
          },
          { status: 400 }
        );
      }

      if (githubUrl && !isValidUrl(githubUrl)) {
        return NextResponse.json(
          {
            error: "GitHub URL must be a valid URL",
            code: "INVALID_GITHUB_URL",
          },
          { status: 400 }
        );
      }

      // Validate and parse tags
      let parsedTags: string[] = [];
      if (tags) {
        if (Array.isArray(tags)) {
          parsedTags = tags.slice(0, 10); // Limit to 10 tags
        } else if (typeof tags === "string") {
          // Handle case where tags might be sent as JSON string
          try {
            const tempTags = JSON.parse(tags);
            parsedTags = Array.isArray(tempTags) ? tempTags.slice(0, 10) : [];
          } catch {
            // If not JSON, treat as comma-separated
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

      // Check for duplicate slug
      const existingProject = await prisma.project.findUnique({
        where: { slug: finalSlug },
      });

      if (existingProject) {
        return NextResponse.json(
          {
            error: "A project with this slug already exists",
            code: "DUPLICATE_SLUG",
            suggestion: `${finalSlug}-${Date.now().toString().slice(-4)}`,
          },
          { status: 409 }
        );
      }

      const newProject = await prisma.project.create({
        data: {
          title: title.trim(),
          slug: finalSlug,
          description: description.trim(),
          content: content || null,
          thumbnail: thumbnail || "https://placehold.co/600x400/png",
          projectUrl: projectUrl || null,
          githubUrl: githubUrl || null,
          tags: parsedTags,
          featured: featured === true,
        },
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
          message: "Project created successfully",
          project: newProject,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("POST project error:", error);

      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "A project with this slug already exists",
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
