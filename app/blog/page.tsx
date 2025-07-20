import Link from "next/link";
import matter from "gray-matter";
import { format } from "date-fns";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogPage() {
  const { data } = await supabase.storage.from("letters").list();
  const slugs = (data ?? []).map((f) => f.name);

  const posts = (
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

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">AI Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Explore our comprehensive collection of articles on artificial
            intelligence, machine learning, and emerging technologies.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{p.summary}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(p.date), "MMM dd, yyyy")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
