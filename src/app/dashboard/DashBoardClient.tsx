"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, FolderKanban, Plus, Loader2, Edit, Trash2, Home, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function DashboardClient() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    // Verify token with backend
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid token");
        }
        setAuthChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("jwt_token");
        router.push("/login?redirect=/dashboard");
      });
  }, [router]);

  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    try {
      const res = await fetch("/api/blogs");

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();
      setBlogs(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load blogs");
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await res.json();
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecking) {
      fetchBlogs();
      fetchProjects();
    }
  }, [authChecking, fetchBlogs, fetchProjects]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleDeleteBlog = async (id: number) => {
    // if (!confirm("Are you sure you want to delete this blog post?")) return;

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete blog");
      }

      toast.success("Blog post deleted successfully");
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteProject = async (id: number) => {
    // if (!confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete project");
      }

      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      {/* Header */}
      <header className=" bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <Home className="mr-2 size-4" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blogs">
                  <FileText className="mr-2 size-4" />
                  View Blog
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{blogs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{blogs.filter((b) => b.published).length} published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{projects.filter((p) => p.featured).length} featured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Admin</div>
              <p className="text-xs text-muted-foreground mt-1">Full Access</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blogs">
              <FileText className="mr-2 size-4" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderKanban className="mr-2 size-4" />
              Projects
            </TabsTrigger>
          </TabsList>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Blog Posts</h2>
                <p className="text-sm text-muted-foreground">Manage your blog content</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/blogs/new">
                  <Plus className="mr-2 size-4" />
                  New Blog Post
                </Link>
              </Button>
            </div>

            {blogsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : blogs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <FileText className="size-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first blog post to get started</p>
                  <Button asChild>
                    <Link href="/dashboard/blogs/new">
                      <Plus className="mr-2 size-4" />
                      Create Blog Post
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {blogs.map((blog) => (
                  <Card key={blog.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <Badge variant={blog.published ? "default" : "secondary"}>
                              {blog.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          {blog.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created: {formatDate(blog.createdAt)}</span>
                            <span>•</span>
                            <span>Updated: {formatDate(blog.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                              <Edit className="mr-2 size-4" />
                              Edit
                            </Link>
                          </Button>
                          <DeleteAlertDialog
                            onConfirm={() => handleDeleteBlog(blog.id)}
                            disabled={deletingId === blog.id}
                            title="Delete this blog post?"
                            description={`This will permanently delete "${blog.title}" from your database.`}
                          >
                            {deletingId === blog.id ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 size-4 " />
                            )}
                            Delete
                          </DeleteAlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Projects</h2>
                <p className="text-sm text-muted-foreground">Manage your portfolio projects</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 size-4" />
                  New Project
                </Link>
              </Button>
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <FolderKanban className="size-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first project to showcase your work</p>
                  <Button asChild>
                    <Link href="/dashboard/projects/new">
                      <Plus className="mr-2 size-4" />
                      Add Project
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            {project.featured && <Badge variant="default">Featured</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="secondary" className="rounded-md">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created: {formatDate(project.createdAt)}</span>
                            <span>•</span>
                            <span>Updated: {formatDate(project.updatedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/projects/edit/${project.id}`}>
                              <Edit className="mr-2 size-4" />
                              Edit
                            </Link>
                          </Button>
                          <DeleteAlertDialog
                            onConfirm={() => handleDeleteProject(project.id)}
                            disabled={deletingId === project.id}
                            title="Delete this project post?"
                            description={`This will permanently delete "${project.title}" from your database.`}
                          >
                            {deletingId === project.id ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 size-4" />
                            )}
                            Delete
                          </DeleteAlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
