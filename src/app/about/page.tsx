import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Rashedul Islam",
  description:
    "Learn about my journey from cricket to code. Computer science student passionate about software engineering, with experience in mentoring and full-stack development.",
  openGraph: {
    title: "About - Rashedul Islam",
    description:
      "Learn about my journey from cricket to code. Computer science student passionate about software engineering.",
    url: "/about", // Relative URL
  },
  alternates: {
    canonical: "/about", // Relative URL
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
