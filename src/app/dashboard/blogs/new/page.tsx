"use client";
import type { RichTextEditorHandle } from "@/app/dashboard/richTextEditor/RichTextEditor";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamic import for RichTextEditor
const RichTextEditor = dynamic(() => import("@/app/dashboard/richTextEditor/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-lg flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <Loader2 className="size-6 animate-spin mb-2" />
        <div>Loading editor...</div>
      </div>
    </div>
  ),
});

// Import the image uploader component with proper typing
const ImageUploader = dynamic(() => import("@/components/AddImg"), {
  ssr: false,
  loading: () => (
    <div className="border-input flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed p-4">
      <div className="text-center">
        <Loader2 className="size-6 animate-spin mb-2 mx-auto" />
        <div>Loading image uploader...</div>
      </div>
    </div>
  ),
});

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  coverImage?: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [submitting, setSubmitting] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
    coverImage: "",
  });

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      router.push("/login?redirect=/dashboard/blogs/new");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        setAuthChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("jwt_token");
        router.push("/login?redirect=/dashboard/blogs/new");
      });
  }, [router]);

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleTitleChange = useCallback(
    (title: string) => {
      setFormData((prev) => ({
        ...prev,
        title,
        slug: generateSlug(title),
      }));
    },
    [generateSlug]
  );

  // Handle image selection from ImageUploader component
  const handleImageSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, coverImage: "" }));
      return;
    }

    setUploadingImage(true);

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      // Create form data for upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      // Upload via our API route - FIXED: Use /api/upload instead of direct Cloudinary
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((prev) => ({
        ...prev,
        coverImage: data.imageUrl,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  // Get editor content and update form data
  const getEditorContent = useCallback(() => {
    return editorRef.current?.getContent() || "";
  }, []);

  // Validate form including editor content
  const validateForm = useCallback(() => {
    const editorContent = getEditorContent();
    const textContent = editorContent.replace(/<[^>]*>/g, "").trim();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (textContent.length === 0) {
      toast.error("Please add some content before saving");
      return false;
    }

    return true;
  }, [formData.title, getEditorContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting || uploadingImage) return;

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    // Validate form including editor content
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Get the latest content from the editor
      const editorContent = getEditorContent();

      const submissionData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: editorContent,
        published: formData.published,
        coverImage:
          formData.coverImage || "https://res.cloudinary.com/dstomc5an/image/upload/v1760087279/600x400_3x_avkkgw.png",
      };

      console.log("Submitting blog data:", submissionData);

      const res = await fetch("/api/blogs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      toast.success("Blog post created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Blog creation error:", error);
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setSubmitting(false);
    }
  };

  // Update form data when editor content changes
  const handleEditorChange = useCallback(() => {
    const content = getEditorContent();
    setFormData((prev) => ({ ...prev, content }));
  }, [getEditorContent]);

  // Add event listener to detect editor changes
  useEffect(() => {
    const checkEditorChanges = setInterval(() => {
      if (editorRef.current) {
        handleEditorChange();
      }
    }, 1000);

    return () => clearInterval(checkEditorChanges);
  }, [handleEditorChange]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="auto-generated-from-title"
                  disabled={submitting}
                />
                <p className="text-xs text-muted-foreground">Auto-generated from title. Customize if needed.</p>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUploader onImageSelect={handleImageSelect} />
                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Uploading image...
                  </div>
                )}
                {formData.coverImage && !uploadingImage && (
                  <p className="text-xs text-green-600">Cover image uploaded successfully!</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary of the blog post"
                  rows={3}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor ref={editorRef} initialHtml={formData.content} height={500} />
                <p className="text-xs text-muted-foreground">
                  Current content length:{" "}
                  {
                    getEditorContent()
                      .replace(/<[^>]*>/g, "")
                      .trim().length
                  }{" "}
                  characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
                  disabled={submitting}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" disabled={submitting || uploadingImage} className="min-w-[160px]">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      {formData.published ? "Publish Blog Post" : "Save as Draft"}
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={submitting}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
