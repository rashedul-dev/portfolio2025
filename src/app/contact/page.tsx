import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Rashedul Islam",
  description:
    "Get in touch with Rashedul Islam. Software engineer and computer science student available for collaborations, projects, and opportunities.",
  openGraph: {
    title: "Contact - Rashedul Islam",
    description:
      "Get in touch with Rashedul Islam. Software engineer and computer science student available for collaborations and projects.",
    url: "/contact", 
  },
  alternates: {
    canonical: "/contact", 
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
