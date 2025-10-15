"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Download,
  Mail,
  MapPin,
  Calendar,
  Award,
  Code,
  Palette,
  Rocket,
  ArrowBigLeft,
  Star,
  Target,
  Users,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import toast from "react-hot-toast";

const AboutClient = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const technicalSkills = [
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "Express",
    "Mongoose ",
    "Prisma",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Redux",
    // "tRPC",
    // "GraphQL",
    // "Docker",
    // "AWS",
    // "CI/CD",
    "Git",
    "Tailwind",
    "Testing",
  ];
  const previousWork = [
    "Full-stack web application development",
    "TypeScript-based scalable applications",
    "Database design and optimization",
    "RESTful API development and integration",
    "E-commerce and marketplace solutions",
    "Competitive programming and algorithm design",
    "Machine Learning and NLP projects",
    "Enterprise-grade SaaS platforms",
    "Real-time data processing systems",
  ];
  const skillAreas = [
    { name: "Frontend Development", level: 95, icon: Code, color: "bg-blue-500" },
    { name: "UI/UX Design", level: 85, icon: Palette, color: "bg-purple-500" },
    { name: "React/Next.js", level: 98, icon: Rocket, color: "bg-cyan-500" },
    { name: "Backend & DevOps", level: 88, icon: Code, color: "bg-green-500" },
  ];

  const stats = [
    { number: "200+", label: "Students Mentored", icon: Users },
    { number: "7th", label: "Semester Ongoing", icon: GraduationCap },
    { number: "100%", label: "Learning Focus", icon: Target },
    { number: "15+", label: "Skills Mastered", icon: Star },
  ];

  const timeline = [
    {
      year: "2004",
      event: "Came into this world with a natural curiosity and passion for learning new things",
    },
    {
      year: "2013",
      event: "Achieved perfect result in PSC exam, setting an early standard for academic excellence",
    },
    {
      year: "2016",
      event:
        "Began competitive cricket journey, playing across U-13, U-14, and U-16 teams while developing discipline and teamwork",
    },
    {
      year: "2019",
      event:
        "Made the tough but mature decision to leave professional cricket, prioritizing family and long-term future goals",
    },
    {
      year: "2019",
      event:
        "Explore creativity into video production, learning storytelling, script writting, Shooting and editing skills with friends",
    },
    {
      year: "2020",
      event:
        "COVID lockdown revealed my true calling: discovered the magic of building digital solutions through programming",
    },
    {
      year: "2021",
      event:
        "Started private tutoring career, successfully teaching 200+ students and mastering the art of explaining complex concepts",
    },
    {
      year: "2022",
      event: "Formally began Computer Science degree, laying the foundation for my software engineering career",
    },
    {
      year: "Present",
      event:
        "Actively building technical skills through projects and coursework, preparing for a future in software development",
    },
    {
      year: "2026",
      event:
        "Expected to graduate with Computer Science degree, ready to embark on professional engineering journey, Inshallah",
    },
  ];
  const keyLearings = [
    "Discipline and consistency beat raw talent every time",
    "Teamwork amplifies individual capabilities",
    "Adaptability is the key to surviving change",
    "Complex problems break down into simple steps",
    "Continuous learning is non-negotiable in tech",
    "User experience should drive technical decisions",
    "Building takes courage, shipping takes discipline",
  ];

  const interests = [
    "Open Source",
    "Web3 & Blockchain",
    "AI & Machine Learning",
    "Mobile Development",
    "Cloud Architecture",
    "DevOps & CI/CD",
    "Creative Coding",
    "Technical Writing",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowBigLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            My Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From cricket fields to code editors - a story of passion, transition, and continuous growth
          </p>
        </motion.header>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 gap-8 lg:gap-12 mb-16 items-stretch">
          {/* Left Column - Story & Timeline */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 h-full">
            {/* Introduction Card */}
            <motion.section variants={itemVariants}>
              <Card className="border-l-4 border-l-primary bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    I'm a computer science student who's excited about becoming a software engineer. My journey to get
                    here has been different—I've been involved in sports, creative projects, and academics. This has
                    taught me to be adaptable, to push through challenges, and to always be ready to learn something
                    new.
                  </p>
                </CardContent>
              </Card>
            </motion.section>

            {/* Timeline */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Journey Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                        {index < timeline.length - 1 && <div className="w-0.5 h-[80%] bg-border mt-2 " />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="font-semibold text-primary mb-1">{item.year}</div>
                        <p className="text-muted-foreground hover:cursor-pointer hover:text-primary">{item.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            {/* Key Learnings */}
            <motion.section variants={itemVariants}>
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Learnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {keyLearings.map((learning, index) => (
                    <motion.div
                      key={learning}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{learning}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          </motion.div>

          {/* Right Column - Skills & Stats */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 h-full">
            {/* Previous Work */}
            <motion.section variants={itemVariants} className="bg-muted/20 border-1 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Previously Contributed To</h3>
              <ul className="space-y-3 list-disc">
                {previousWork.map((work, index) => (
                  <motion.li
                    key={work}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary hover:cursor-pointer"
                  >
                    <span className="text-lg scale-150 inline-block">•</span> <span>{work}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
            {/* Stats */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>By the Numbers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="text-center p-4 border bg-card/50 hover:bg-accent/20 transition-colors">
                          <CardContent className="p-2">
                            <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Skills Grid */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Technologies & Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {technicalSkills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between rounded-lg border px-3 py-3 text-sm bg-card hover:bg-accent/50 transition-colors"
                      >
                        <span className="font-medium">{skill}</span>
                        <span className="text-muted-foreground">★</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Interests */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Interest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <motion.div
                        key={interest}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge
                          variant="secondary"
                          className="px-3 py-1.5 text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          {interest}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Skill Areas */}
            <motion.section variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Expertise Areas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  {skillAreas.map((area, index) => (
                    <motion.div
                      key={area.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="flex items-center gap-4 p-4 rounded-lg border-1 bg-card hover:bg-accent/50 transition-all duration-300 group border-muted-foreground/20 hover:border-foreground/30"
                    >
                      <div className="p-3 rounded-lg dark:bg-background text-foreground group-hover:scale-110 transition-transform">
                        <area.icon className="w-6 h-6 dark:text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{area.name}</h3>
                        <div className="flex items-center gap-3 mt-1"></div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>

            {/* Philosophy */}
            <motion.section variants={itemVariants}>
              <Card className="bg-muted/20 from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <blockquote className="text-lg italic text-muted-foreground leading-relaxed text-center">
                    "The same discipline that perfected my cricket shots now helps me write cleaner code. Every setback
                    is setup for a comeback, in sports and in software."
                  </blockquote>
                </CardContent>
              </Card>
            </motion.section>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12 bg-muted/20 border-1 rounded-2xl"
        >
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg text-center sm:text-left sm:px-4">
              I'm always excited to collaborate on interesting projects and learn from fellow developers.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
              <Button size="lg" className="gap-2 w-full xs:w-auto justify-center">
                <Mail className="w-4 h-4" />
                <Link href={"/contact"}>Get In Touch</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 w-full xs:w-auto justify-center"
                onClick={() => toast.error("Resume will be available soon")}
              >
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutClient;
