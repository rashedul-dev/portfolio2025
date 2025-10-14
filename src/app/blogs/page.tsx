import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog — Rashedul Islam",
  description: "Read articles and insights about web development, software engineering, and technology.",
  openGraph: {
    title: "Blog - Rashedul Islam",
    description: "Read articles and insights about web development and software engineering.",
    url: "/blogs",
  },
  alternates: {
    canonical: "/blogs",
  },
};

export default function blogPage() {
  return <BlogClient />;
}
