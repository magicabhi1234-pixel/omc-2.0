import Link from "next/link";
import Container from "@/components/common/container";
import { getBlogPostsByDate } from "@/data/registry";
import { blogPostHref } from "@/lib/blog-links";

export default async function Blogs() {
  const allPosts = await getBlogPostsByDate();
  const posts = allPosts.slice(0, 3);

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-wider text-orange-700">
            Latest Articles
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#0F172A]">
            MBA Insights & Career Guidance
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Expert guides, university comparisons and career advice
            for MBA aspirants.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-xl"
            >
              <div aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                📚
              </div>

              <h3 className="text-xl font-semibold text-[#0F172A]">
                {post.title}
              </h3>

              <p className="mt-4 text-slate-600">
                {post.excerpt}
              </p>

              <Link
                href={blogPostHref(post.slug)}
                className="mt-6 inline-block font-semibold text-[#0B3B68] transition hover:text-[#F47C45]"
              >
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
