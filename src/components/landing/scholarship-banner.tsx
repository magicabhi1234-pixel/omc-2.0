"use client";

export default function ScholarshipBanner() {

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#0B3B68] via-[#123f6d] to-[#0F172A] px-8 py-16 text-white md:px-16">

          {/* Background Effects */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#F47C45]/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">

            {/* Left */}
            <div>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                🎁 Limited Time Offer
              </span>

              <h2 className="mt-6 text-4xl font-bold md:text-5xl">
                Get Scholarship Up To
                <span className="block text-[#F47C45]">
                  ₹30,000
                </span>
              </h2>

              <p className="mt-5 text-lg text-slate-300">
                Apply through Online MBA Colleges and
                get exclusive scholarship benefits,
                EMI options and admission assistance.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <div className="rounded-full bg-white/10 px-4 py-3 backdrop-blur">
                  ✅ Scholarship Assistance
                </div>

                <div className="rounded-full bg-white/10 px-4 py-3 backdrop-blur">
                  ✅ Easy EMI Options
                </div>

                <div className="rounded-full bg-white/10 px-4 py-3 backdrop-blur">
                  ✅ Free Counselling
                </div>

              </div>

            </div>

            {/* Right */}
            <div className="text-center lg:text-right">

              <div className="inline-block rounded-3xl bg-white p-8 shadow-2xl">

                <h3 className="text-6xl font-bold text-[#F47C45]">
                  ₹30K
                </h3>

                <p className="mt-2 text-lg font-semibold text-slate-800">
                  Scholarship Benefit
                </p>

                <button
                  onClick={openPopup}
                  className="mt-6 cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:scale-105"
                >
                  Apply For Scholarship
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}