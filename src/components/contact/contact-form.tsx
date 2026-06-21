"use client";
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
  
              <div className="mt-8 space-y-4">
  
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>50+ UGC Approved Universities</span>
                </div>
  
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>AI Based University Comparison</span>
                </div>
  
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Free Admission Guidance</span>
                </div>
  
                <div className="flex items-center gap-3">
                  <span className="text-green-600">✓</span>
                  <span>Placement & Career Insights</span>
                </div>
  
              </div>
  
            </div>
  
            {/* Right Form */}
            <div className="rounded-3xl bg-white p-8 shadow-xl">
  
              <h3 className="text-2xl font-bold text-slate-900">
                Request A Callback
              </h3>
  
              <p className="mt-2 text-slate-600">
                Fill out the form and our experts will contact you shortly.
              </p>
  
              <form className="mt-8 space-y-4">
  
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B3B68]"
                />
  
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B3B68]"
                />
  
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B3B68]"
                />
  
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B3B68]"
                >
                  <option>Select Program</option>
                  <option>Online MBA</option>
                  <option>Online MCA</option>
                  <option>Online BBA</option>
                  <option>Online BCA</option>
                </select>
  
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B3B68]"
                />
  
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new Event("openLeadPopup")
                    )
                  }
                  className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-4 font-semibold text-white transition hover:opacity-90"
                >
                  Get Free Counselling
                </button>
  
              </form>
  
            </div>
  
          </div>
  
        </div>
      </section>
    );
  }