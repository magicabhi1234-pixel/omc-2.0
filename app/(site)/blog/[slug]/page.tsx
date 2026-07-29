import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/common/container";
import BlogContent from "@/components/blog/blog-content";
import BlogCTAButton from "@/components/blog/blog-cta-button";
import { blogPosts, allBlogSlugs } from "@/data/registry";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return allBlogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) return {};

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    alternates: {
      canonical: post.seo.canonical,
    },
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: "article",
      images: [post.featuredImage.src],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white">

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
              <span>📅 {formatDate(post.publishedDate)}</span>
              {post.readingTime && <span>⏱ {post.readingTime} Read</span>}
              <span>🎓 {post.author}</span>
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
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="pb-20">
        <Container>
          <div className="mx-auto max-w-4xl">

            <BlogContent content={post.content} />

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
