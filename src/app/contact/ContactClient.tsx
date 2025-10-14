"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const ContactClient = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.status === 401) {
        toast.error("Email service unavailable. Opening your email client…");
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name || ""}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:rashedulislam.edge@gmail.com?subject=${subject}&body=${body}`;
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message");
      }
      toast.success("Message sent! I'll get back to you shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/rashedul-dev",
      label: "GitHub",
      color: "hover:text-gray-700 dark:hover:text-gray-300",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/rashedul-dev",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/rashedul_dev",
      label: "Twitter",
      color: "hover:text-sky-500",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      text: "rashedulislam.edge@gmail.com",
      href: "mailto:rashedulislam.edge@gmail.com",
    },
    {
      icon: Phone,
      text: `+880 19035-64290`,
      href: "tel:+8801903564290",
    },
    {
      icon: MapPin,
      text: "Dhaka, Bangladesh",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4"
          >
            Let&apos;s Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Ready to bring your ideas to life? Let&apos;s create something amazing together.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <section id="contact" className="">
            <div className="mx-auto max-w-3xl px-4 bg-background">
              <div className="bg-muted/20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={onSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={submitting}
                            className="dark:bg-muted/20"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={submitting}
                            className="dark:bg-muted/20"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="message" className="text-sm font-medium">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Hi Rashedul, I'd love to talk about…"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            disabled={submitting}
                            className="dark:bg-muted/20"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">Sends directly to my inbox</span>
                          <Button type="submit" disabled={submitting}>
                            {submitting ? "Sending…" : "Send"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {/* Contact Info Cards */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground group-hover:text-primary transition-colors">{item.text}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-semibold">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full border border-border bg-card/50 hover:bg-card/80 transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
