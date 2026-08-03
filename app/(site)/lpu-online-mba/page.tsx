import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostView from "@/components/blog/blog-post-view";
import { getBlogPostBySlug } from "@/data/registry";

const SLUG = "lpu-online-mba";

export async function generateMetadata(): Promise<Metadata> {
  const post = await getBlogPostBySlug(SLUG);
  if (!post) return {};

  const ogImage = post.seo.ogImage ?? post.featuredImage.src;

  return {
    title: post.seo.title,
    description: post.seo.description,
    robots: post.seo.robots,
    alternates: {
      canonical: `/${SLUG}`,
    },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: [ogImage],
    },
  };
}

export default async function LpuOnlineMbaPage() {
  const post = await getBlogPostBySlug(SLUG);
  if (!post) notFound();

  return <BlogPostView post={post} />;
}
