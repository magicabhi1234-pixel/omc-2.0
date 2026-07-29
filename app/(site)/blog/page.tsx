export const metadata = {
  title: "Blog",
};

import BlogHero from "@/components/blog/hero";
import FeaturedBlog from "@/components/blog/featured-blog";
import BlogGrid from "@/components/blog/blog-grid";

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <FeaturedBlog />
      <BlogGrid />
    </>
  );
}