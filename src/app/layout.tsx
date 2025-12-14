import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout";
import { Bricolage_Grotesque } from "next/font/google";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

// Get base URL from environment variable with fallback
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rashedulislam.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl), // Add this line - it's the key!
  title: "Rashedul Islam — Full Stack Developer",
  description:
    "Portfolio of Rashedul Islam, Full Stack Developer specializing in scalable platforms and delightful UX.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Rashedul Islam — Full Stack Developer",
    description:
      "Portfolio of Rashedul Islam, Full Stack Developer specializing in scalable platforms and delightful UX.",
    url: baseUrl,
    siteName: "Rashedul Islam Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rashedul Islam - Full Stack Developer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rashedul Islam — Full Stack Developer",
    description: "Portfolio of Rashedul Islam, Full Stack Developer",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body className="antialiased">
        {/* <ErrorReporter /> */}
        <Toaster position="top-right" />
        {/* <SmoothCursor /> */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
