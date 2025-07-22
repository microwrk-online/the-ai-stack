// app/blog/[slug]/page.tsx
import { getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // disables cache

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose dark:prose-invert">
      <h1>{post.title}</h1>
      <p className="text-gray-500 text-sm">
        {new Date(post.date).toLocaleDateString()} ·{" "}
        {post.author ?? "Anonymous"}
      </p>
      <hr />
      <MDXRemote source={post.content} />
    </div>
  );
}
