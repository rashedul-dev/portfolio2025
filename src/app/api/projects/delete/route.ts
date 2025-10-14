// app/api/projects/delete/route.ts
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

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(id) },
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

      const deletedProject = await prisma.project.delete({
        where: { id: parseInt(id) },
      });

      return NextResponse.json({
        message: "Project deleted successfully",
        project: deletedProject,
      });
    } catch (error) {
      console.error("DELETE project error:", error);
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
