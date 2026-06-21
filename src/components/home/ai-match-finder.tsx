"use client";

import { useState } from "react";
import Container from "@/components/common/container";

export default function AIMatchFinder() {
  const [showResults, setShowResults] = useState(false);

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            AI University Finder
          </span>

          <h2 className="mt-3 text-4xl font-bold text-[#0F172A]">
            Find Your Perfect MBA Match
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Select your preferences and discover universities that
            best match your career goals.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Budget */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Budget
              </label>

              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]">
                <option>Under ₹1 Lakh</option>
                <option>₹1 - ₹2 Lakhs</option>
                <option>₹2 - ₹3 Lakhs</option>
                <option>₹3+ Lakhs</option>
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Specialization
              </label>

              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]">
                <option>Marketing</option>
                <option>Finance</option>
                <option>HR</option>
                <option>Business Analytics</option>
                <option>Operations</option>
                <option>IT Management</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Work Experience
              </label>

              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]">
                <option>Fresher</option>
                <option>1-3 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowResults(true)}
              className="cursor-pointer rounded-xl bg-[#0B3B68] px-8 py-4 font-semibold text-white transition hover:opacity-90"
            >
              Find My University
            </button>
          </div>

          {showResults && (
            <div className="mt-10">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-[#0F172A]">
                  Your Top Matches
                </h3>

                <p className="mt-2 text-slate-600">
                  Based on your selected preferences
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-bold text-[#0F172A]">
                      Amity Online
                    </h4>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      92% Match
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    Best fit for career growth and flexibility.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-bold text-[#0F172A]">
                      Manipal Online
                    </h4>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      88% Match
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    Strong placement support and brand value.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-bold text-[#0F172A]">
                      Jain Online
                    </h4>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      85% Match
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    Excellent specialization options and affordability.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new Event("openLeadPopup")
                    )
                  }
                  className="cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:opacity-90"
                >
                  Get Detailed Comparison
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}