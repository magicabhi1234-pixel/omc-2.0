import { SITE } from "@/constants/site";
import type { BlogPost } from "@/types/blog";

export default function BlogPostJsonLd({ post }: { post: BlogPost }) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": post.seo.canonical,
      headline: post.h1,
      description: post.seo.description,
      image: post.featuredImage.src,
      datePublished: post.publishedDate,
      dateModified: post.lastModifiedDate ?? post.publishedDate,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
      },
      mainEntityOfPage: post.seo.canonical,
    },
  ];

  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
