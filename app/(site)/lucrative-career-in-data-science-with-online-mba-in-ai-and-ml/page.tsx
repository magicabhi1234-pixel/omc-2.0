import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostView from "@/components/blog/blog-post-view";
import { getBlogPostBySlug } from "@/data/registry";
import { blogPostMetadata } from "@/lib/blog-metadata";

const SLUG = "lucrative-career-in-data-science-with-online-mba-in-ai-and-ml";

export async function generateMetadata(): Promise<Metadata> {
  const post = await getBlogPostBySlug(SLUG);
  return post ? blogPostMetadata(post) : {};
}

export default async function DataScienceAiMlOnlineMbaPage() {
  const post = await getBlogPostBySlug(SLUG);
  if (!post) notFound();

  return <BlogPostView post={post} />;
}
