import LeadForm from "@/components/common/lead-form";

export default function Hero() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-2 items-center">

          <div>
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm text-[#F47C45]">
              Admissions Open 2026
            </span>

            <h1 className="mt-6 text-5xl font-bold text-slate-900">
              Top Distance MBA Colleges & Universities in North Zone
            </h1>

            <p className="mt-5 text-lg text-slate-600">
              Compare fees, rankings, accreditation, placements and admission process.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="rounded-xl bg-[#0B3B68] px-6 py-3 text-white">
                Compare Universities
              </button>

              <button className="rounded-xl border px-6 py-3">
                Free Counselling
              </button>
            </div>
          </div>

          <div>
            <LeadForm />
          </div>

        </div>
      </div>
    </section>
  );
}