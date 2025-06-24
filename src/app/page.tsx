// src/app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function getPostsFromMarkdown(): any[] {
  const blogDir = path.join(process.cwd(), "src/content/blog");
  const files = fs.readdirSync(blogDir);

  return files.map((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    return {
      title: data.title,
      slug: data.slug || filename.replace(/\.mdx?$/, ""),
      summary: data.summary,
      createdAt: data.createdAt,
    };
  });
}

export default function Home() {
  const posts = getPostsFromMarkdown();

  return (
    <>
      <main>
        <Hero />
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white mb-8">
            Latest AI Blog Posts
          </h2>
          <BlogList posts={posts} />
        </section>
        <Features />

        <Footer />
      </main>
    </>
  );
}
