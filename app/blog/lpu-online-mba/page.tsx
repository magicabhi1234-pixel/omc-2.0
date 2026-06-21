"use client";

import Image from "next/image";
import Container from "@/components/common/container";

export default function LPUBlogPage() {
  return (
    <article className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-[#F47C45]">
              Online MBA
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
              LPU Online MBA: Fees, Specializations &
              Admission Guide 2026
            </h1>

            <p className="mt-6 text-lg text-slate-600">
              Explore LPU Online MBA fees, eligibility,
              admission process, specializations, placements,
              LMS platform and career opportunities.
            </p>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
              <span>📅 June 2026</span>
              <span>⏱ 10 Min Read</span>
              <span>🎓 MBA Admissions</span>
            </div>

          </div>
        </Container>
      </section>

      {/* Featured Image */}
      <section className="py-10">
        <Container>
          <div className="relative mx-auto h-[500px] max-w-5xl overflow-hidden rounded-3xl">
            <Image
              src="/universities/lpu_blog.jpg"
              alt="LPU Online MBA"
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

            {/* TOC */}
            <div className="mb-12 rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-xl font-bold text-slate-900">
                Table Of Contents
              </h2>

              <ul className="mt-5 space-y-3 text-[#0B3B68]">
                <li>1. About LPU Online MBA</li>
                <li>2. Key Highlights</li>
                <li>3. MBA Specializations</li>
                <li>4. Eligibility Criteria</li>
                <li>5. Fee Structure</li>
                <li>6. LPU e-Connect LMS</li>
                <li>7. Admission Process</li>
                <li>8. Career Opportunities</li>
                <li>9. Pros & Cons</li>
                <li>10. FAQs</li>
              </ul>
            </div>

            {/* Intro */}
            <h2 className="text-3xl font-bold text-slate-900">
              About LPU Online MBA
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Lovely Professional University (LPU) is among
              India's leading private universities offering
              UGC-entitled Online MBA programs. The program is
              designed for students and working professionals
              who want flexibility while pursuing management
              education.
            </p>

            <p className="mt-5 leading-8 text-slate-700">
              The curriculum focuses on practical business
              skills, leadership development, strategic
              management and industry-relevant learning.
            </p>

            {/* Highlights */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              Key Highlights
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border p-5">
                ✓ UGC Entitled Degree
              </div>

              <div className="rounded-2xl border p-5">
                ✓ Flexible Online Learning
              </div>

              <div className="rounded-2xl border p-5">
                ✓ Industry-Oriented Curriculum
              </div>

              <div className="rounded-2xl border p-5">
                ✓ Career Support Services
              </div>

              <div className="rounded-2xl border p-5">
                ✓ Placement Assistance
              </div>

              <div className="rounded-2xl border p-5">
                ✓ Live & Recorded Classes
              </div>
            </div>

            {/* Specializations */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              MBA Specializations Offered
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                Finance
              </div>

              <div className="rounded-xl border p-4">
                Marketing
              </div>

              <div className="rounded-xl border p-4">
                Human Resource Management
              </div>

              <div className="rounded-xl border p-4">
                Information Technology
              </div>

              <div className="rounded-xl border p-4">
                International Business
              </div>

              <div className="rounded-xl border p-4">
                Operations Management
              </div>
            </div>

            {/* Eligibility */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              Eligibility Criteria
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Candidates must possess a bachelor's degree from
              a recognized university. Specific eligibility
              requirements may vary according to university
              guidelines and admission policies.
            </p>

            {/* Fees */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              Fee Structure
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">
                      Program Duration
                    </td>
                    <td className="p-4">
                      2 Years
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">
                      Fee
                    </td>
                    <td className="p-4">
                      As Per University Guidelines
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* LMS */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              LPU e-Connect LMS
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              LPU e-Connect is the university's digital
              learning platform that allows students to access
              study materials, assignments, recorded lectures,
              examination updates and academic resources.
            </p>

            <div className="mt-6 rounded-2xl bg-blue-50 p-6">
              <h3 className="font-semibold text-[#0B3B68]">
                Features
              </h3>

              <ul className="mt-4 space-y-2">
                <li>• Digital Learning Resources</li>
                <li>• Assignment Submission</li>
                <li>• Student Dashboard</li>
                <li>• Online Fee Payment</li>
                <li>• Examination Updates</li>
                <li>• Academic Notifications</li>
              </ul>
            </div>

            {/* Admission Process */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              Admission Process
            </h2>

            <ol className="mt-6 space-y-4 text-slate-700">
              <li>1. Register Online</li>
              <li>2. Complete Application Form</li>
              <li>3. Upload Required Documents</li>
              <li>4. Pay Course Fee</li>
              <li>5. Receive Enrollment Confirmation</li>
            </ol>

            {/* Career */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              Career Opportunities
            </h2>

            <p className="mt-5 leading-8 text-slate-700">
              Graduates can pursue opportunities in banking,
              finance, marketing, consulting, operations,
              business analytics and management roles across
              various industries.
            </p>

            {/* FAQ */}
            <h2 className="mt-14 text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>

            <div className="mt-8 space-y-5">

              <div className="rounded-2xl border p-5">
                <h3 className="font-semibold">
                  Is LPU Online MBA UGC Approved?
                </h3>

                <p className="mt-2 text-slate-600">
                  Yes, the university offers UGC-entitled
                  online programs.
                </p>
              </div>

              <div className="rounded-2xl border p-5">
                <h3 className="font-semibold">
                  Can Working Professionals Apply?
                </h3>

                <p className="mt-2 text-slate-600">
                  Yes, the program is designed for both
                  students and working professionals.
                </p>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-16 rounded-3xl bg-[#0B3B68] p-10 text-center text-white">
              <h2 className="text-3xl font-bold">
                Need Help Choosing The Right MBA?
              </h2>

              <p className="mt-4 text-slate-200">
                Get free counselling and university comparison
                from our admission experts.
              </p>

              <button
                onClick={() =>
                  window.dispatchEvent(
                    new Event("openLeadPopup")
                  )
                }
                className="mt-6 cursor-pointer rounded-xl bg-[#F47C45] px-6 py-3 font-semibold text-white"
              >
                Get Free Counselling
              </button>
            </div>

          </div>
        </Container>
      </section>

    </article>
  );
}