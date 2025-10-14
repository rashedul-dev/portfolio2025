// app/api/projects/[id]/route.ts
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

    const projectId = parseInt(id);

    // Validate ID parameter
    if (!id || isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          error: "Valid project ID is required",
          code: "INVALID_ID",
          details: "Please provide a valid positive numeric ID",
        },
        { status: 400 }
      );
    }

    // Fetch project with selective field inclusion for security
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        thumbnail: true,
        projectUrl: true,
        githubUrl: true,
        tags: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Handle project not found
    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
          code: "PROJECT_NOT_FOUND",
          details: `No project found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    // Check admin access for additional features if needed
    const url = new URL(request.url);
    const isAdminRequest = url.searchParams.get("admin") === "true";

    // Set cache headers
    const response = NextResponse.json(project);

    if (!isAdminRequest) {
      // Cache public requests for better performance
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    } else {
      // No cache for admin requests
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    }

    return response;
  } catch (error: any) {
    console.error("GET project error:", error);

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
          error: "Project not found",
          code: "PROJECT_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        details: "An unexpected error occurred while fetching the project",
      },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE method for project deletion
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params; // Remove 'await' here too
    const projectId = parseInt(id);

    // Validate ID parameter
    if (!id || isNaN(projectId) || projectId <= 0) {
      return NextResponse.json(
        {
          error: "Valid project ID is required",
          code: "INVALID_ID",
        },
        { status: 400 }
      );
    }

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

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
        deletedId: projectId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE project error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Project not found",
          code: "PROJECT_NOT_FOUND",
        },
        { status: 404 }
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
}
