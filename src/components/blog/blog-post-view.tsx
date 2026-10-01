import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/container";
import PortableTextContent from "@/components/blog/portable-text-content";
import BlogCTAButton from "@/components/blog/blog-cta-button";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema, webPageSchema, type Crumb } from "@/lib/structured-data";
import { blogPostHref } from "@/lib/blog-links";
import type { BlogPost } from "@/types/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/** Shown only when the post was meaningfully edited after publishing (not same-day saves). */
function wasUpdated(post: BlogPost) {
  if (!post.lastModifiedDate) return false;
  return Date.parse(post.lastModifiedDate) - Date.parse(post.publishedDate) > 24 * 60 * 60 * 1000;
}

/** Full blog post render, shared by /blog/[slug] and any exact-slug alias routes. */
export default function BlogPostView({ post }: { post: BlogPost }) {
  const path = blogPostHref(post.slug);
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.h1, path },
  ];
  const graph = [
    webPageSchema({ path, name: post.seo.title, description: post.seo.description, image: post.featuredImage.src, dateModified: post.lastModifiedDate, hasBreadcrumb: true }),
    articleSchema({
      path,
      headline: post.h1,
      description: post.seo.description || post.excerpt,
      image: post.seo.ogImage || post.featuredImage.src,
      datePublished: post.publishedDate,
      dateModified: post.lastModifiedDate,
      author: post.author,
      keywords: post.tags,
      section: post.category,
    }),
    breadcrumbSchema(crumbs, path),
    post.faqs ? faqSchema(post.faqs, path) : null,
  ].filter((node): node is Record<string, unknown> => node !== null);

  return (
    <article className="bg-white">
      <JsonLd data={graph} />
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-10 md:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              {post.category ?? "Online MBA"}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-6xl">
              {post.h1}
            </h1>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
              <span>
                <span aria-hidden="true">📅</span> Published <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
              </span>
              {wasUpdated(post) && (
                <span>
                  <span aria-hidden="true">🔄</span> Updated <time dateTime={post.lastModifiedDate}>{formatDate(post.lastModifiedDate!)}</time>
                </span>
              )}
              {post.readingTime && <span><span aria-hidden="true">⏱</span> {post.readingTime} Read</span>}
              <span><span aria-hidden="true">🎓</span> {post.author}</span>
            </div>

          </div>
        </Container>
      </section>

      {/* Featured Image */}
      <section className="py-10">
        <Container>
          <div className="relative mx-auto aspect-[16/9] max-h-[500px] w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-100">
            {post.featuredImage.src && <Image
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />}
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
                      href={blogPostHref(related.slug)}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={related.featuredImage.src}
                          alt="" // decorative: the card's link text is the post title
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
