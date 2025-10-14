"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, X, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Dynamic import for image uploader
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

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail: "",
    projectUrl: "",
    githubUrl: "",
    featured: false,
    tags: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login?redirect=/dashboard/projects/new");
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
        router.push("/login?redirect=/dashboard/projects/new");
      });
  }, [router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // Handle image selection from ImageUploader component
  const handleImageSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, thumbnail: "" }));
      return;
    }

    setUploadingImage(true);

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
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: data.imageUrl,
      }));

      toast.success("Thumbnail uploaded successfully!");
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  // Remove thumbnail image
  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    toast.success("Thumbnail removed");
  }, []);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // In handleSubmit function:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || uploadingImage) return;

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: tags, // Already an array
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      toast.success(data.message || "Project created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter project title"
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the project"
                  rows={4}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Thumbnail Image Upload Section */}
              <div className="space-y-3">
                <Label>Project Thumbnail</Label>

                {/* Show uploaded thumbnail preview */}
                {formData.thumbnail && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Uploaded Thumbnail:</Label>
                    <div className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
                      <img
                        src={formData.thumbnail}
                        alt="Project thumbnail"
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Thumbnail Image</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.thumbnail}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(formData.thumbnail, "_blank")}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          disabled={submitting}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Uploader */}
                <ImageUploader onImageSelect={handleImageSelect} />

                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Uploading thumbnail...
                  </div>
                )}

                {!formData.thumbnail && !uploadingImage && (
                  <p className="text-xs text-muted-foreground">Upload a thumbnail image for your project</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectUrl">Live Demo URL</Label>
                <Input
                  id="projectUrl"
                  value={formData.projectUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectUrl: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/username/repo"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Technologies/Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag (press Enter)"
                    disabled={submitting}
                  />
                  <Button type="button" variant="secondary" onClick={addTag} disabled={submitting}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                          disabled={submitting}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                  disabled={submitting}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this project
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={submitting || uploadingImage}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Create Project
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
