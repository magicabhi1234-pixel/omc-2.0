import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/container";
import PortableTextContent from "@/components/blog/portable-text-content";
import BlogCTAButton from "@/components/blog/blog-cta-button";
import BlogPostJsonLd from "@/components/blog/blog-post-json-ld";
import { blogPostHref } from "@/lib/blog-links";
import type { BlogPost } from "@/types/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Full blog post render, shared by /blog/[slug] and any exact-slug alias routes. */
export default function BlogPostView({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white">
      <BlogPostJsonLd post={post} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
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
                      href={blogPostHref(related.slug)}
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
