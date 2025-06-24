import Link from "next/link";
import dayjs from "dayjs";

type BlogPost = {
  title: string;
  slug: string;
  summary: string;
  createdAt: string;
};

type Props = {
  posts: BlogPost[];
};

export default function BlogList({ posts }: Props) {
  return (
    <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group relative block h-72 rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] p-8 transition-all hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition mb-3">
                {post.title}
              </h2>
              <p className="text-gray-400 text-base line-clamp-3">
                {post.summary}
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-6">
              {dayjs(post.createdAt).format("MMMM D, YYYY")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
