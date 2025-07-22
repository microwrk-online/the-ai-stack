"use client";

import Link from "next/link";
import matter from "gray-matter";
import { format, isValid, parseISO } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- SAFELY PARSE DATE ---
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

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await supabase.storage.from("letters").list();
        const slugs = (data ?? [])
          .map((f) => f.name)
          .filter(
            (name) =>
              name !== ".emptyFolderPlaceholder" && !name.startsWith(".")
          );

        const fetchedPosts = (
          await Promise.all(
            slugs.map(async (slug) => {
              const { data: file } = await supabase.storage
                .from("letters")
                .download(slug);
              if (!file) return null;
              const raw = await file.text();
              const { data: front } = matter(raw) as { data: any };
              return { slug, ...front };
            })
          )
        ).filter(Boolean);

        const sortedPosts = fetchedPosts.sort((a, b) => {
          const dateA = safeParseDate(a.date);
          const dateB = safeParseDate(b.date);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateB.getTime() - dateA.getTime();
        });

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">AI Blog</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Loading articles...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="container mx-auto max-w-8xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">AI Blog</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Explore our comprehensive collection of articles on artificial
              intelligence, machine learning, and emerging technologies.
            </p>
          </div>

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
        </div>
      </main>
    </>
  );
}
