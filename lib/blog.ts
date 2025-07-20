// lib/blog.ts  (Supabase-only, zero local files)
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  author?: string;
  tags?: string[];
}

/* ---------- helper ---------- */
function safeFrontMatter(
  data: Record<string, unknown>
): Omit<BlogPost, "slug" | "content"> {
  const { title, date, author, summary, tags } = data;
  return {
    title: typeof title === "string" ? title : "Untitled",
    date: typeof date === "string" ? date : new Date().toISOString(),
    author: typeof author === "string" ? author : undefined,
    summary: typeof summary === "string" ? summary : "",
    tags: Array.isArray(tags)
      ? tags.filter((t): t is string => typeof t === "string")
      : [],
  };
}

/* ---------- getSortedPostsData ---------- */
export async function getSortedPostsData(): Promise<BlogPost[]> {
  const { data } = await supabase.storage.from("letters").list();
  if (!data) return [];

  const posts = (
    await Promise.all(
      data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map(async ({ name }) => {
          const slug = name;
          const { data: file } = await supabase.storage
            .from("letters")
            .download(name);
          if (!file) return null;

          const raw = await file.text();
          const { data: front, content } = matter(raw);
          return { slug, content, ...safeFrontMatter(front) } as BlogPost;
        })
    )
  ).filter((p): p is BlogPost => p !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/* ---------- getPostBySlug ---------- */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data: file, error } = await supabase.storage
    .from("letters")
    .download(slug);
  if (error || !file) return null;

  const raw = await file.text();
  const { data: front, content } = matter(raw);
  return { slug, content, ...safeFrontMatter(front) };
}

/* ---------- getAllPostSlugs ---------- */
// lib/blog.ts  (only the two snippets that changed)

export async function getAllPostSlugs(): Promise<string[]> {
  const { data } = await supabase.storage.from("letters").list();
  return (data ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => f.name);
}
