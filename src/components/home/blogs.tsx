import Link from "next/link";
import Container from "@/components/common/container";

const blogs = [
  {
    title: "LPU Online MBA: Fees, Specializations & Admission Guide 2026",
    description:
      "Explore LPU Online MBA fees, eligibility, admission process, specializations and career opportunities.",
    link: "/blog/lpu-online-mba",
  },
  {
    title: "Top Online MBA Universities In India",
    description:
      "Explore the best UGC approved online MBA colleges with rankings and reviews.",
    link: "#",
  },
  {
    title: "Career Opportunities After Online MBA",
    description:
      "Discover high-paying career paths and job opportunities after completing an MBA.",
    link: "#",
  },
];

export default function Blogs() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-wider text-[#F47C45]">
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
          {blogs.map((blog) => (
            <div
              key={blog.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                📚
              </div>

              <h3 className="text-xl font-semibold text-[#0F172A]">
                {blog.title}
              </h3>

              <p className="mt-4 text-slate-600">
                {blog.description}
              </p>

              <Link
                href={blog.link}
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