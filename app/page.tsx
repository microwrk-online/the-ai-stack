import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SubscribeForm } from "@/components/subscribe-form";
import { BlogList } from "@/components/blog-list";
import { getSortedPostsData } from "@/lib/blog";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

export default function HomePage() {
  const posts = getSortedPostsData();

  return (
    <>
      <Analytics />
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <SubscribeForm />
        <BlogList posts={posts} />
        <Footer />
      </main>
    </>
  );
}
