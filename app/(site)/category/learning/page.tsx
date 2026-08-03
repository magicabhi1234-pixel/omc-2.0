import Container from "@/components/common/container";
import FeaturedBlog from "@/components/blog/featured-blog";
import BlogGrid from "@/components/blog/blog-grid";
import { getBlogPostsByDate } from "@/data/registry";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Learning",
  description:
    "MBA admissions guides, university comparisons, career insights and specialization advice from Online MBA Colleges.",
  path: "/category/learning",
});

export default async function LearningCategoryPage() {
  const posts = await getBlogPostsByDate();

  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
              Category
            </span>

            <h1 className="mt-3 text-4xl font-bold text-slate-900 lg:text-5xl">
              Learning
            </h1>

            <p className="mt-4 text-slate-600">
              Expert guides, university comparisons and career advice
              for MBA aspirants.
            </p>
          </div>
        </Container>
      </section>

      <FeaturedBlog posts={posts.slice(0, 1)} />
      <BlogGrid posts={posts.slice(1)} />
    </>
  );
}
