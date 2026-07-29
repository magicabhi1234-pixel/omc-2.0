import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/container";
import { blogPostsByDate } from "@/data/registry";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });
}

export default function BlogGrid() {
  const posts = blogPostsByDate.slice(1);

  if (posts.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            More Articles
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            All MBA Resources
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-[#F47C45]">
                  {post.category ?? "Online MBA"}
                </span>

                <h3 className="mt-4 min-h-[60px] text-xl font-bold text-slate-900 group-hover:text-[#0B3B68]">
                  {post.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                  {post.excerpt}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>📅 {formatDate(post.publishedDate)}</span>
                  {post.readingTime && <span>⏱ {post.readingTime} Read</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
