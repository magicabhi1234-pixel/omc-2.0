import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/container";

export default function FeaturedBlog() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            Featured Article
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Latest MBA Insights
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Explore detailed university reviews, admission guides,
            fee structures and career-focused MBA resources.
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="grid lg:grid-cols-2">

            {/* Featured Image */}
            <div className="relative min-h-[350px] lg:min-h-full">
              <Image
                src="/universities/lpu_blog.jpg"
                alt="LPU Online MBA"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 lg:p-12">

              <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#F47C45]">
                Online MBA
              </span>

              <h3 className="mt-5 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                LPU Online MBA: Fees, Specializations &
                Admission Guide 2026
              </h3>

              <p className="mt-5 text-slate-600">
                Discover everything about LPU Online MBA including
                eligibility, fees, specializations, admission process,
                learning management system and career opportunities.
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
                <span>📅 June 2026</span>
                <span>⏱ 8 Min Read</span>
                <span>🎓 MBA Admissions</span>
              </div>

              <div className="mt-8">
                <Link
                  href="/blog/lpu-online-mba"
                  className="inline-flex items-center rounded-xl bg-[#0B3B68] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Read Article →
                </Link>
              </div>

            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}