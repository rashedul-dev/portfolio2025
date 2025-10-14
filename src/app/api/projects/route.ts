// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const tagsParam = searchParams.get("tags");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const where: any = {};

    // Search by title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by featured status
    if (featured !== null && featured !== undefined) {
      where.featured = featured.toLowerCase() === "true";
    }

    // Filter by tags
    if (tagsParam) {
      const tagList = tagsParam.split(",").map((tag) => tag.trim());
      where.tags = {
        hasSome: tagList,
      };
    }

    // Apply sorting
    const orderBy: any = {};
    if (sort === "title") {
      orderBy.title = order;
    } else if (sort === "updatedAt") {
      orderBy.updatedAt = order;
    } else {
      orderBy.createdAt = order;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
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

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
