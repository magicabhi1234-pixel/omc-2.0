import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/container";
import PortableTextContent from "@/components/blog/portable-text-content";
import BlogCTAButton from "@/components/blog/blog-cta-button";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/data/registry";
import { SITE } from "@/constants/site";
import type { BlogPost } from "@/types/blog";

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

  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: {
      canonical: post.seo.canonical,
    },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      type: "article",
      images: post.seo.ogImage ? [post.seo.ogImage] : [post.featuredImage.src],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogPostJsonLd({ post }: { post: BlogPost }) {
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white">
      <BlogPostJsonLd post={post} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#F47C45]">
              {post.category ?? "Online MBA"}
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
              {post.h1}
            </h1>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
              <span><span aria-hidden="true">📅</span> {formatDate(post.publishedDate)}</span>
              {post.readingTime && <span><span aria-hidden="true">⏱</span> {post.readingTime} Read</span>}
              <span><span aria-hidden="true">🎓</span> {post.author}</span>
            </div>

          </div>
        </Container>
      </section>

      {/* Featured Image */}
      <section className="py-10">
        <Container>
          <div className="relative mx-auto h-[500px] max-w-5xl overflow-hidden rounded-3xl">
            <Image
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="pb-20">
        <Container>
          <div className="mx-auto max-w-4xl">

            <PortableTextContent content={post.content} />

            {post.faqs && post.faqs.length > 0 && (
              <>
                <h2 className="mt-14 text-3xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h2>

                <div className="mt-8 space-y-5">
                  {post.faqs.map((faq) => (
                    <div key={faq.question} className="rounded-2xl border p-5">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <p className="mt-2 text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <>
                <h2 className="mt-14 text-3xl font-bold text-slate-900">
                  Related Articles
                </h2>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {post.relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={related.featuredImage.src}
                          alt={related.featuredImage.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-slate-900 group-hover:text-[#0B3B68]">
                          {related.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* CTA */}
            <div className="mt-16 rounded-3xl bg-[#0B3B68] p-10 text-center text-white">
              <h2 className="text-3xl font-bold">
                Need Help Choosing The Right MBA?
              </h2>

              <p className="mt-4 text-slate-200">
                Get free counselling and university comparison
                from our admission experts.
              </p>

              <BlogCTAButton />
            </div>

          </div>
        </Container>
      </section>

    </article>
  );
}
