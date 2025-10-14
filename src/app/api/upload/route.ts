// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  console.log("=== UPLOAD API CALLED ===");

  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    console.log("Auth header present:", !!authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized - no valid auth header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Cloudinary is configured
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
    });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log(
      "File received:",
      file
        ? {
            name: file.name,
            type: file.type,
            size: file.size,
          }
        : "No file"
    );

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, JPG, GIF, WEBP, and SVG are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 2MB." }, { status: 400 });
    }

    console.log("Converting file to buffer...");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Buffer created, size:", buffer.length);

    // Upload to Cloudinary with better error handling
    console.log("Starting Cloudinary upload...");

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blog-images",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    console.log("Upload completed successfully");

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error: any) {
    console.error("=== UPLOAD API ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Check for specific Cloudinary errors
    if (error.message?.includes("Invalid credentials")) {
      return NextResponse.json(
        {
          error: "Cloudinary configuration error. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to upload image to Cloudinary: " + error.message,
      },
      { status: 500 }
    );
  }
}
