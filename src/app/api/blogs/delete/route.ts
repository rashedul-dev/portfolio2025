// app/api/blogs/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware";

export async function DELETE(request: NextRequest) {
  return requireAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          {
            error: "Valid ID is required",
            code: "INVALID_ID",
          },
          { status: 400 }
        );
      }

      // Check if blog exists before deleting
      const existingBlog = await prisma.blog.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingBlog) {
        return NextResponse.json(
          {
            error: "Blog not found",
            code: "BLOG_NOT_FOUND",
          },
          { status: 404 }
        );
      }

      const deletedBlog = await prisma.blog.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json({
        message: "Blog deleted successfully",
        blog: deletedBlog,
      });
    } catch (error) {
      console.error("DELETE blog error:", error);
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
