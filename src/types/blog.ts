// =============================================
// Blog Link
// =============================================

export interface BlogLink {
  label: string;
  url: string;
}

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
  metaTitle: string;
  metaDescription: string;
  canonical: string;
}

// =============================================
// Blog Post
// =============================================

export interface BlogPost {
  slug: string;

  title: string;

  h1: string;

  seo: BlogSEO;

  featuredImage: BlogImage;

  author: string;

  publishedDate: string;

  lastModifiedDate?: string;

  category?: string;

  tags?: string[];

  excerpt: string;

  /** Raw source content in Markdown, rendered via <BlogContent />. */
  content: string;

  wordCount?: number;

  readingTime?: string;

  internalLinks?: BlogLink[];

  externalLinks?: BlogLink[];

  faqs?: BlogFAQItem[];
}
