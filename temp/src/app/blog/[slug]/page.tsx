import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "src/content/blog"));
  return files.map((filename) => ({
    slug: filename.replace(/\.mdx?$/, ""),
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  // ⛏️ Fix: await the params
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-white mb-4">{data.title}</h1>
      <p className="text-gray-400 mb-4">{data.summary}</p>
      <article className="prose prose-invert">
        <MDXRemote source={content} />
      </article>
    </main>
  );
}
