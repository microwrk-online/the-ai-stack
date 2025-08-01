import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SubscribeForm } from "@/components/subscribe-form";
import { getSortedPostsData } from "@/lib/blog";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import BlogGrid from "@/components/blogGrid";

export default async function HomePage() {
  const posts = await getSortedPostsData(); // <-- await the Promise

  return (
    <>
      <Analytics />
      <main className="min-h-screen bg-gray-300 dark:bg-black text-white">
        <Header />
        <HeroSection />
        <SubscribeForm />
        <BlogGrid />
        <Footer />
      </main>
    </>
  );
}
// test