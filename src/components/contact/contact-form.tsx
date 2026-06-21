"use client";

import LeadForm from "@/components/common/lead-form";

export default function ContactForm() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Left Content */}
          <div className="flex flex-col justify-center">

            <span className="inline-flex w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
              Free MBA Counselling
            </span>

            <h2 className="mt-5 text-4xl font-bold text-slate-900">
              Speak With Our
              <span className="block text-[#0B3B68]">
                MBA Experts
              </span>
            </h2>

            <p className="mt-5 text-lg text-slate-600">
              Get personalized university recommendations,
              fee comparisons, admission guidance and career
              counselling from our experts.
            </p>

          </div>

          {/* Right Form */}
          <div className="rounded-3xl bg-white p-8 shadow-xl">

            <h3 className="text-2xl font-bold text-slate-900">
              Request A Callback
            </h3>

            <p className="mt-2 text-slate-600">
              Fill out the form and our experts will contact you shortly.
            </p>

            <div className="mt-8">
              <LeadForm />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}