import Image from "next/image";
import { notFound } from "next/navigation";
import { universities } from "@/constants/universities";
import LeadForm from "@/components/common/lead-form";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UniversityDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const university = universities.find(
    (item) => item.slug === slug
  );

  if (!university) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div>
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
                Admission Open 2026
              </span>

              <h1 className="mt-5 text-5xl font-bold text-slate-900">
                {university.name}
              </h1>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm">
                  {university.grade}
                </span>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm">
                  UGC Approved
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border bg-white p-5">
                  <p className="text-sm text-slate-500">
                    MBA Fees
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {university.fees}
                  </h3>
                </div>

                <div className="rounded-2xl border bg-white p-5">
                  <p className="text-sm text-slate-500">
                    Duration
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    2 Years
                  </h3>
                </div>

              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">

              <Image
                src={university.logo}
                alt={university.name}
                width={400}
                height={200}
                className="mx-auto h-auto w-full object-contain"
              />

            </div>

          </div>

        </div>
      </section>

      {/* About University */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">

          <h2 className="mb-6 text-4xl font-bold">
            About {university.name}
          </h2>

          <p className="max-w-4xl text-lg leading-8 text-slate-600">
            {university.name} offers a UGC-approved
            Online MBA program designed for working
            professionals and fresh graduates. The
            program provides flexible learning,
            industry-relevant curriculum, expert
            faculty support, and career-focused
            specializations.
          </p>

        </div>
      </section>

      {/* Specializations */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">

          <h2 className="mb-8 text-4xl font-bold">
            MBA Specializations
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {[
              "Finance Management",
              "Marketing Management",
              "Human Resource Management",
              "Operations Management",
              "Information Technology",
              "Supply Chain Management",
              "International Business",
              "Retail Management",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border bg-white p-5"
              >
                {item}
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">

          <h2 className="mb-6 text-4xl font-bold">
            Eligibility Criteria
          </h2>

          <div className="rounded-3xl border bg-white p-8">
            <ul className="space-y-3 text-slate-600">
              <li>
                ✓ Bachelor's degree from a
                recognized university.
              </li>

              <li>
                ✓ Minimum eligibility criteria as
                prescribed by the university.
              </li>

              <li>
                ✓ Working professionals and fresh
                graduates can apply.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Admission Process */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4">

          <h2 className="mb-8 text-4xl font-bold">
            Admission Process
          </h2>

          <div className="grid gap-5 md:grid-cols-4">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Step 1
              <h3 className="mt-2 font-semibold">
                Submit Application
              </h3>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Step 2
              <h3 className="mt-2 font-semibold">
                Document Verification
              </h3>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Step 3
              <h3 className="mt-2 font-semibold">
                Fee Payment
              </h3>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Step 4
              <h3 className="mt-2 font-semibold">
                Admission Confirmation
              </h3>
            </div>

          </div>

        </div>
      </section>

      {/* Lead Form */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Get Free Admission Counselling
            </h2>

            <LeadForm />
          </div>

        </div>
      </section>
    </>
  );
}