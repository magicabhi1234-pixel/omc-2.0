import Container from "@/components/common/container";
import BlogHero from "@/components/blog/hero";
import FeaturedBlog from "@/components/blog/featured-blog";
import BlogGrid from "@/components/blog/blog-grid";
import { getBlogPostsByDate } from "@/data/registry";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "MBA admissions guides, university comparisons, career insights and specialization advice from Online MBA Colleges.",
  path: "/blog",
});

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();

  const allPosts = await getBlogPostsByDate();
  const posts = normalizedQuery
    ? allPosts.filter((post) =>
        `${post.title} ${post.excerpt}`.toLowerCase().includes(normalizedQuery)
      )
    : allPosts;

  return (
    <>
      <BlogHero query={query} />

      {posts.length === 0 ? (
        <section className="bg-white py-20">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                No articles found for &ldquo;{query}&rdquo;
              </h2>
              <p className="mt-3 text-slate-600">
                Try a different search term, or browse all of our latest MBA resources below.
              </p>
            </div>
          </Container>
        </section>
      ) : (
        <>
          <FeaturedBlog posts={posts.slice(0, 1)} />
          <BlogGrid posts={posts.slice(1)} />
        </>
      )}
    </>
  );
}
