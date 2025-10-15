"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Moon, Sun, Github, Linkedin } from "lucide-react";

interface NavbarProps {
  dark: boolean;
  setDark: (dark: boolean) => void;
  mounted: boolean;
}

export function Navbar({ dark, setDark, mounted }: NavbarProps) {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary/10 grid place-items-center text-primary font-bold">RI</div>
            <span className="text-lg font-medium text-muted-foreground hidden sm:inline">Rashedul Islam</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/blogs"
              className="px-3 py-2 rounded-md text-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
            >
              Blog
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92, rotate: -8 }}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setDark(!dark)}
                disabled={!mounted}
              >
                <motion.span
                  key={dark ? "sun" : "moon"}
                  initial={{ rotate: -90, opacity: 0, y: -2 }}
                  animate={{ rotate: 0, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="grid place-items-center"
                >
                  {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </motion.span>
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="mt-8 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-3 py-2 rounded-md text-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Link
                    href="/blogs"
                    className="px-3 py-2 rounded-md text-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
                  >
                    Blog
                  </Link>
                  <Separator className="my-2" />
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md text-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
                  >
                    Dashboard
                  </Link>
                  <Separator className="my-2" />
                  <div className="flex gap-2 pl-2">
                    <Link
                      href="https://github.com/rashedul-dev"
                      className="inline-flex items-center gap-1 text-lg hover:underline"
                    >
                      <Github className="size-4" /> GitHub
                    </Link>
                    <Link
                      href="https://linkedin.com/in/yourname"
                      className="inline-flex items-center gap-1 text-lg hover:underline"
                    >
                      <Linkedin className="size-4" /> LinkedIn
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
