"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  tags: string[];
  featured: boolean;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [state, setState] = useState({
    loading: true,
    submitting: false,
    authChecking: true,
    uploadingImage: false,
    hasExistingImage: false,
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail: "",
    projectUrl: "",
    githubUrl: "",
    featured: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push(`/login?redirect=/dashboard/projects/edit/${id}`);
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
        router.push(`/login?redirect=/dashboard/projects/edit/${id}`);
      });
  }, [router, id]);

  useEffect(() => {
    if (state.authChecking) return;

    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await fetch(`/api/projects/${id}?admin=true`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Project not found");
        }

        const project: Project = await res.json();
        setFormData({
          title: project.title,
          slug: project.slug,
          description: project.description,
          thumbnail: project.thumbnail || "",
          projectUrl: project.projectUrl || "",
          githubUrl: project.githubUrl || "",
          featured: project.featured,
        });

        setTags(Array.isArray(project.tags) ? project.tags : []);
        setState((prev) => ({ ...prev, hasExistingImage: !!project.thumbnail }));
        
        console.log("Project data loaded:", project);
      } catch (error: any) {
        console.error("Error fetching project:", error);
        toast.error(error.message || "Failed to load project");
        router.push("/dashboard");
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchProject();
  }, [state.authChecking, id, router]);

  // Handle image selection from ImageUploader component
  const handleImageSelect = useCallback(async (file: File | null) => {
    if (!file) {
      return; // Don't remove existing image when file is null
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
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData(prev => ({ 
        ...prev, 
        thumbnail: data.imageUrl 
      }));
      setState((prev) => ({ ...prev, hasExistingImage: true }));
      
      toast.success("Thumbnail uploaded successfully!");
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setState((prev) => ({ ...prev, uploadingImage: false }));
    }
  }, []);

  // Remove thumbnail image
  const handleRemoveImage = useCallback(() => {
    setFormData(prev => ({ ...prev, thumbnail: "" }));
    setState((prev) => ({ ...prev, hasExistingImage: false }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.submitting || state.uploadingImage) return;

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

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const res = await fetch(`/api/projects/update?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update project");
      }

      toast.success("Project updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  if (state.authChecking || state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
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
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-sm text-muted-foreground mt-1">Editing: {formData.title}</p>
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  required
                  disabled={state.submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="project-slug"
                  disabled={state.submitting}
                />
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
                  disabled={state.submitting}
                />
              </div>

              {/* Thumbnail Image Section */}
              <div className="space-y-3">
                <Label>Project Thumbnail</Label>
                
                {/* Show existing thumbnail if available */}
                {state.hasExistingImage && formData.thumbnail && (
                  <div className="space-y-3 mb-4">
                    <Label className="text-sm text-muted-foreground">Current Thumbnail:</Label>
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                      <img 
                        src={formData.thumbnail} 
                        alt="Current thumbnail" 
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Current Thumbnail</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {formData.thumbnail}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(formData.thumbnail!, '_blank')}
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
                    <p className="text-xs text-muted-foreground">
                      Upload a new image below to replace the current thumbnail
                    </p>
                  </div>
                )}

                {/* Image Uploader */}
                <div className={state.hasExistingImage ? "border-t pt-4 mt-2" : ""}>
                  <Label className="text-sm mb-2 block">
                    {state.hasExistingImage ? "Replace Thumbnail" : "Upload Thumbnail"}
                  </Label>
                  <ImageUploader onImageSelect={handleImageSelect} />
                  
                  {state.uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Loader2 className="size-4 animate-spin" />
                      Uploading thumbnail...
                    </div>
                  )}
                  
                  {!state.hasExistingImage && !state.uploadingImage && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload a thumbnail image for your project
                    </p>
                  )}
                </div>
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
                  disabled={state.submitting}
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
                  disabled={state.submitting}
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
                    disabled={state.submitting}
                  />
                  <Button type="button" variant="secondary" onClick={addTag} disabled={state.submitting}>
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
                          disabled={state.submitting}
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
                  disabled={state.submitting}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this project
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={state.submitting || state.uploadingImage}
                >
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
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={state.submitting}>
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