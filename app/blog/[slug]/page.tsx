import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <article className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Back Button */}
            <Link href="/blog" className="mb-8 inline-block">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
                {post.title}
              </h1>
              
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                {post.author && (
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {post.author}
                  </div>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-lg text-foreground/70">
                {post.summary}
              </p>

              <Separator className="mt-8" />
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <MDXRemote source={post.content} />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}