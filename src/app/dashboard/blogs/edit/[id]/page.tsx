"use client";
import type { RichTextEditorHandle } from "@/app/dashboard/richTextEditor/RichTextEditor";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  content: string;
  published: boolean;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  content: string;
  published: boolean;
}

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

// Import the image uploader component
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

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [state, setState] = useState({
    loading: true,
    submitting: false,
    authChecking: true,
    uploadingImage: false,
    hasExistingImage: false,
  });

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: null,
    published: false,
  });

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push(`/login?redirect=/dashboard/blogs/edit/${id}`);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        setState((prev) => ({ ...prev, authChecking: false }));
      })
      .catch(() => {
        localStorage.removeItem("jwt_token");
        router.push(`/login?redirect=/dashboard/blogs/edit/${id}`);
      });
  }, [router, id]);

  // Fetch blog data
  useEffect(() => {
    if (state.authChecking) return;

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        console.log("Fetching blog with ID:", id);

        const res = await fetch(`/api/blogs/${id}?admin=true`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Blog not found");
        }

        const blog: Blog = await res.json();
        console.log("Fetched blog data:", blog);

        const blogData = {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || "",
          coverImage: blog.coverImage,
          content: blog.content,
          published: blog.published,
        };

        setFormData(blogData);
        setState((prev) => ({ ...prev, hasExistingImage: !!blog.coverImage }));

        console.log("Form data set:", blogData);
      } catch (error: any) {
        console.error("Error fetching blog:", error);
        toast.error(error.message || "Failed to load blog");
        router.push("/dashboard");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchBlog();
  }, [state.authChecking, id, router]);

  const handleImageSelect = useCallback(async (file: File | null) => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, JPG, GIF, WEBP, and SVG are allowed.");
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 2MB.");
      return;
    }

    setState((prev) => ({ ...prev, uploadingImage: true }));

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Upload failed with status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setFormData((prev) => ({
        ...prev,
        coverImage: data.imageUrl,
      }));
      setState((prev) => ({ ...prev, hasExistingImage: true }));

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setState((prev) => ({ ...prev, uploadingImage: false }));
    }
  }, []);

  // Remove cover image
  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    setState((prev) => ({ ...prev, hasExistingImage: false }));
    toast.success("Cover image removed");
  }, []);

  // Get editor content
  const getEditorContent = useCallback(() => {
    return editorRef.current?.getContent() || "";
  }, []);

  // Validate form
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

  // Update form field
  const updateFormField = useCallback((field: keyof BlogFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state.submitting || state.uploadingImage) return;

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

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      // Get the latest content from the editor
      const editorContent = getEditorContent();

      const submissionData = {
        ...formData,
        content: editorContent,
      };

      console.log("Updating blog data:", submissionData);

      const res = await fetch(`/api/blogs/update?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update blog post");
      }

      toast.success("Blog post updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Blog update error:", error);
      toast.error(error.message || "Failed to update blog post");
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Loading state
  if (state.authChecking || state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className=" bg-background">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          <p className="text-sm text-muted-foreground mt-1">Editing: {formData.title}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Blog Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  className="dark:bg-muted/30"
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormField("title", e.target.value)}
                  placeholder="Enter blog post title"
                  required
                  disabled={state.submitting}
                />
              </div>

              {/* Slug Field */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  className="dark:bg-muted/30"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateFormField("slug", e.target.value)}
                  placeholder="blog-post-slug"
                  disabled={state.submitting}
                />
                <p className="text-xs text-muted-foreground">URL-friendly version of the title</p>
              </div>

              {/* Cover Image Field */}
              <div className="space-y-3">
                <Label>Cover Image</Label>

                {/* Show existing image if available */}
                {state.hasExistingImage && formData.coverImage && (
                  <div className="space-y-3 mb-4">
                    <Label className="text-sm text-muted-foreground">Current Cover Image:</Label>
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                      <img
                        src={formData.coverImage}
                        alt="Current cover"
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Current Image</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.coverImage}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(formData.coverImage!, "_blank")}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          disabled={state.submitting}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Upload a new image below to replace the current one</p>
                  </div>
                )}

                {/* Image Uploader - Only show if no image or we want to replace */}
                <div className={state.hasExistingImage ? "border-t pt-4 mt-2" : ""}>
                  <Label className="text-sm mb-2 block">
                    {state.hasExistingImage ? "Replace Image" : "Upload Cover Image"}
                  </Label>
                  <ImageUploader onImageSelect={handleImageSelect} />

                  {state.uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Loader2 className="size-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}

                  {!state.hasExistingImage && !state.uploadingImage && (
                    <p className="text-xs text-muted-foreground mt-2">Upload a cover image for your blog post</p>
                  )}
                </div>
              </div>

              {/* Excerpt Field */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  className="dark:bg-muted/30"
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => updateFormField("excerpt", e.target.value)}
                  placeholder="Brief summary of the blog post"
                  rows={3}
                  disabled={state.submitting}
                />
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  ref={editorRef}
                  initialHtml={formData.content}
                  height={500}
                  key={`editor-${id}`} // Force re-render when blog changes
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Content length:{" "}
                    {
                      getEditorContent()
                        .replace(/<[^>]*>/g, "")
                        .trim().length
                    }{" "}
                    characters
                  </span>
                </div>
              </div>

              {/* Publish Switch */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => updateFormField("published", checked)}
                  disabled={state.submitting}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  {formData.published ? "Published" : "Draft"}
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" disabled={state.submitting || state.uploadingImage} className="min-w-[160px]">
                  {state.submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={state.submitting}
                >
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
