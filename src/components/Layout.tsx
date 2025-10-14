// components/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { ThemeProvider } from "next-themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme ? savedTheme === "dark" : systemDark;

    setDark(initialDark);
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent("themechange", { detail: dark }));
  }, [dark, mounted]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar dark={dark} setDark={setDark} mounted={mounted}></Navbar>
      <div className="reletive mt-20">{children}</div>
    </div>
  );
}
