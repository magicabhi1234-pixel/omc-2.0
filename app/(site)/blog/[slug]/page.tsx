import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostView from "@/components/blog/blog-post-view";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/data/registry";
import { blogPostHref, isFlatSlugPost } from "@/lib/blog-links";
import { SITE } from "@/constants/site";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return {};

  const ogImage = post.seo.ogImage ?? post.featuredImage.src;

  // Posts migrated to an exact-slug alias route are canonicalized to that
  // alias (the source-parity URL); this route stays live (no redirect) but
  // signals the alias as primary to avoid a duplicate-content penalty.
  const canonical = isFlatSlugPost(slug)
    ? `${SITE.url}${blogPostHref(slug)}`
    : post.seo.canonical;

  return {
    title: post.seo.title,
    description: post.seo.description,
    robots: post.seo.robots,
    alternates: {
      canonical,
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostView post={post} />;
}
