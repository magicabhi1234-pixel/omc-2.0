"use client";

export default function CTA() {

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0B3B68] via-[#123f6d] to-[#0F172A] py-24 text-white">

      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#F47C45]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center">

        <span className="rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur">
          🎓 Admissions Open 2026
        </span>

        <h2 className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
          Still Confused About
          <span className="block text-[#F47C45]">
            Choosing the Right MBA?
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
          Get personalized guidance from our MBA experts.
          Compare universities, fees, placements and
          specializations before taking admission.
        </p>

        {/* Benefits */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <div className="rounded-full bg-white/10 px-5 py-3 backdrop-blur">
            ✅ Free Counselling
          </div>

          <div className="rounded-full bg-white/10 px-5 py-3 backdrop-blur">
            ✅ Scholarship Guidance
          </div>

          <div className="rounded-full bg-white/10 px-5 py-3 backdrop-blur">
            ✅ Admission Support
          </div>

          <div className="rounded-full bg-white/10 px-5 py-3 backdrop-blur">
            ✅ Career Guidance
          </div>

        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <button
            onClick={openPopup}
            className="cursor-pointer rounded-xl bg-[#F47C45] px-10 py-4 text-lg font-semibold text-white transition hover:scale-105"
          >
            Apply Now
          </button>

          <button
            onClick={openPopup}
            className="cursor-pointer rounded-xl border border-white px-10 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-[#0B3B68]"
          >
            Get Free Counselling
          </button>

        </div>

        {/* Trust Stats */}
        <div className="mt-14 grid gap-6 md:grid-cols-4">

          <div>
            <h3 className="text-3xl font-bold">50+</h3>
            <p className="text-slate-300">Universities</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="text-slate-300">MBA Courses</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">10,000+</h3>
            <p className="text-slate-300">Students Guided</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold">98%</h3>
            <p className="text-slate-300">Satisfaction Rate</p>
          </div>

        </div>

      </div>

    </section>
  );
}