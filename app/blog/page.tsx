import { Header } from '@/components/header';
import { BlogList } from '@/components/blog-list';
import { getSortedPostsData } from '@/lib/blog';

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
              AI Blog
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Explore our comprehensive collection of articles on artificial intelligence, 
              machine learning, and emerging technologies.
            </p>
          </div>
        </div>
      </div>
      <BlogList posts={posts} />
    </main>
  );
}