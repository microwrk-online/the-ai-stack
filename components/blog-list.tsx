"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";
import { Button } from "./ui/button";
import { format, isValid, parseISO } from "date-fns";

interface BlogListProps {
  posts: BlogPost[];
}

function safeParseDate(dateString: any): Date | null {
  if (!dateString) return null;

  const iso = parseISO(dateString);
  if (isValid(iso)) return iso;

  const fallback = new Date(dateString);
  return isValid(fallback) ? fallback : null;
}

function formatDate(dateString: any): string {
  const date = safeParseDate(dateString);
  return date ? format(date, "dd/MM/yyyy") : "Invalid Date";
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Latest AI Insights
            </h2>
            <p className="text-foreground/70">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="blog-list"
      className="relative overflow-hidden bg-gray-300 dark:bg-black from-background via-background to-primary/5 py-20 sm:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Latest Insights
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">
            Stay on top of AI breakthroughs, job-ready skills, and practical use
            cases—minus the hype.
          </p>
        </motion.div>

        {/* <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-foreground/60">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(post.date), "dd/MM/yyyy")}</span>
                      </div>
                      <Clock className="h-4 w-4 text-foreground/40" />
                    </div>
                    <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-1" />
                    </div>
                    {post.author && (
                      <div className="mt-4 text-sm text-foreground/60">
                        By {post.author}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div> */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-foreground/60">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <Clock className="h-4 w-4 text-foreground/40" />
                    </div>
                    <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-1" />
                    </div>
                    {post.author && (
                      <div className="mt-4 text-sm text-foreground/60">
                        By {post.author}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex justify-center items-center gap-4"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 px-8 text-base transform transition-transform hover:scale-105 hover:shadow-lg"
            onClick={() => {
              window.location.href = "/blog";
            }}
          >
            All Posts
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
