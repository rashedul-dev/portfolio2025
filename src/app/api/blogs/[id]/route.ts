// app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params; 
    const blogId = parseInt(id);

    console.log("Fetching blog with ID:", id, "Parsed ID:", blogId);

    // Validate ID parameter
    if (!id || isNaN(blogId) || blogId <= 0) {
      return NextResponse.json(
        {
          error: "Valid blog ID is required",
          code: "INVALID_ID",
          details: "Please provide a valid positive numeric ID",
        },
        { status: 400 }
      );
    }

    // Fetch blog with selective field inclusion for security
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImage: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        views: true,
      },
    });

    console.log("Found blog:", blog);

    // Handle blog not found
    if (!blog) {
      return NextResponse.json(
        {
          error: "Blog post not found",
          code: "BLOG_NOT_FOUND",
          details: `No blog found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Check if blog is published (optional: you might want to handle this differently for admin vs public)
    const url = new URL(request.url);
    const isAdminRequest = url.searchParams.get("admin") === "true";

    console.log("Is admin request:", isAdminRequest, "Blog published:", blog.published);

    if (!blog.published && !isAdminRequest) {
      return NextResponse.json(
        {
          error: "Blog post is not published",
          code: "BLOG_NOT_PUBLISHED",
          details: "This blog post is currently in draft status",
        },
        { status: 403 }
      );
    }

    // Increment view count for non-admin requests (optional)
    if (!isAdminRequest) {
      try {
        await prisma.blog.update({
          where: { id: blogId },
          data: { views: { increment: 1 } },
        });
      } catch (viewError) {
        console.warn("Failed to increment view count:", viewError);
        // Don't fail the request if view count update fails
      }
    }

    // Return the blog data directly (not wrapped in data property for compatibility)
    const response = NextResponse.json(blog);

    if (!isAdminRequest && blog.published) {
      // Cache published blogs for 5 minutes, revalidate after 1 minute
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    } else {
      // No cache for admin requests or drafts
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    }

    return response;
  } catch (error: any) {
    console.error("GET blog error:", error);

    // Handle database connection errors
    if (error.code === "P1001" || error.code === "P1017") {
      return NextResponse.json(
        {
          error: "Database temporarily unavailable",
          code: "DATABASE_UNAVAILABLE",
          details: "Please try again in a few moments",
        },
        { status: 503 }
      );
    }

    // Handle Prisma not found error
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Blog post not found",
          code: "BLOG_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred while fetching the blog post",
      },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE method for blog deletion
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);

    // Validate ID parameter
    if (!id || isNaN(blogId) || blogId <= 0) {
      return NextResponse.json(
        {
          error: "Valid blog ID is required",
          code: "INVALID_ID",
        },
        { status: 400 }
      );
    }

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

    // Delete the blog post
    await prisma.blog.delete({
      where: { id: blogId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog post deleted successfully",
        deletedId: blogId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE blog error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Blog post not found",
          code: "BLOG_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
