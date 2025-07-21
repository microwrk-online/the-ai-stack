import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import { Header } from "@/components/header";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Post = {
  title: string;
  date: string;
  author?: string;
  summary?: string;
  tags?: string[];
  content: string;
};

async function getRemotePost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase.storage.from("letters").download(slug);
  if (error) return null;

  const raw = await data.text();
  const parsed = matter(raw);
  const { title, date, author, summary, tags } = parsed.data as Record<
    string,
    unknown
  >;
  if (typeof title !== "string" || typeof date !== "string") return null;

  return {
    title,
    date,
    author: typeof author === "string" ? author : undefined,
    summary: typeof summary === "string" ? summary : undefined,
    tags: Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : [],
    content: parsed.content,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.storage.from("letters").list();
  return (data ?? []).map((f) => ({ slug: f.name }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getRemotePost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white">
        <article className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <Link href="/blog" className="mb-8 inline-block">
                <Button variant="ghost" className="pl-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>

              <header className="mb-8">
                <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                  {post.title}
                </h1>

                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  {post.author && (
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {post.author}
                    </div>
                  )}
                </div>

                {post.tags?.length && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-lg text-gray-300">{post.summary}</p>
                <Separator className="mt-8" />
              </header>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <MDXRemote source={post.content} />
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
