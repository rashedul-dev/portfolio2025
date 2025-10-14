import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me - Rashedul Islam",
  description:
    "Learn about my journey from cricket to code. Computer science student passionate about software engineering, with experience in mentoring and full-stack development.",
  keywords: [
    "Rashedul Islam",
    "software engineer",
    "computer science student",
    "full-stack developer",
    "about me",
    "portfolio",
    "web development",
  ],
  authors: [{ name: "Rashedul Islam" }],
  openGraph: {
    title: "About Me - Rashedul Islam",
    description:
      "Learn about my journey from cricket to code. Computer science student passionate about software engineering.",
    type: "website",
    url: "https://yourportfolio.com/about",
    siteName: "Rashedul Islam Portfolio",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Rashedul Islam - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me - Rashedul Islam",
    description:
      "Learn about my journey from cricket to code. Computer science student passionate about software engineering.",
    images: ["/og-about.jpg"],
  },
  alternates: {
    canonical: "https://yourportfolio.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
