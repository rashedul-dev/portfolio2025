// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");
    const published = searchParams.get("published");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Published filter
    if (published !== null && published !== undefined) {
      where.published = published === "true";
    }

    // Sorting
    const orderBy: any = {};
    if (sort === "title") {
      orderBy.title = order;
    } else if (sort === "updatedAt") {
      orderBy.updatedAt = order;
    } else {
      orderBy.createdAt = order;
    }

    const blogs = await prisma.blog.findMany({
      where:published==='true'?{published:true}:{},
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        content: true,
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET blogs error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
