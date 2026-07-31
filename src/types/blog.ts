import type { PortableTextBlock } from "@portabletext/react";

// =============================================
// Blog Image
// =============================================

export interface BlogImage {
  src: string;
  alt: string;
}

// =============================================
// Blog FAQ
// =============================================

export interface BlogFAQItem {
  question: string;
  answer: string;
}

// =============================================
// Blog SEO
// =============================================

export interface BlogSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  robots?: string;
}

// =============================================
// Blog Post Summary (listing cards, related posts)
// =============================================

export interface BlogPostSummary {
  slug: string;
  title: string;
  h1: string;
  featuredImage: BlogImage;
  author: string;
  publishedDate: string;
  category?: string;
  excerpt: string;
  readingTime?: string;
}

// =============================================
// Blog Post
// =============================================

export interface BlogPost extends BlogPostSummary {
  seo: BlogSEO;

  lastModifiedDate?: string;

  tags?: string[];

  /** Portable Text blocks, rendered via <BlogContent />. */
  content: PortableTextBlock[];

  wordCount?: number;

  faqs?: BlogFAQItem[];

  relatedPosts?: BlogPostSummary[];
}
