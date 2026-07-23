"use client";

import React from "react";
import Image from "next/image";
import { UniversitySection } from "@/types/landing";
import { northZoneUniversities } from "@/constants/north-zone-universities";

type Props = Partial<UniversitySection>;

export default function UniversityGrid(props: Props) {
  const {
    badge = "Top Universities",
    heading = "Top Distance MBA Universities",
    description = "Compare NAAC grades, fees, approvals, placements and admission process from India's leading distance MBA universities.",
  } = props;

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  const defaultUniversities = northZoneUniversities;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-14 text-center">

          {badge && (
            <span className="inline-block rounded-full border border-orange-200/50 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F47C45] shadow-sm">
              {badge}
            </span>
          )}

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {heading}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            {description}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {defaultUniversities.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
            >

              {/* Header */}
              <div className="bg-gradient-to-r from-[#0B3B68] to-[#123f6d] p-5">

                <div className="rounded-xl bg-white p-4 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={220}
                    height={100}
                    className="mx-auto h-16 object-contain"
                  />
                </div>

              </div>

              {/* Content */}
              <div className="p-6">

                <div className="mb-4 flex items-center justify-between gap-2">

                  <span className="inline-block rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700 shadow-xs">
                    {item.grade}
                  </span>

                  <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700 shadow-xs">
                    UGC Approved
                  </span>

                </div>

                <h3 className="min-h-[56px] text-lg font-extrabold tracking-tight text-slate-900 line-clamp-2">
                  {item.name}
                </h3>

                <div className="mt-5 space-y-3 text-sm">

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                    <span className="text-slate-500 font-medium">
                      MBA Fees
                    </span>

                    <span className="font-extrabold text-[#0B3B68]">
                      {item.fees}
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                    <span className="text-slate-500 font-medium">
                      Duration
                    </span>

                    <span className="font-semibold text-slate-800">
                      2 Years
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                    <span className="text-slate-500 font-medium">
                      EMI Available
                    </span>

                    <span className="font-semibold text-green-600">
                      Yes
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-slate-500 font-medium">
                      Placement Support
                    </span>

                    <span className="font-semibold text-green-600">
                      Available
                    </span>

                  </div>

                </div>

                <div className="mt-6 grid gap-2.5">

                  <button
                    onClick={openPopup}
                    aria-label={`Apply Now to ${item.name}`}
                    className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:opacity-95 hover:shadow-[#F47C45]/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47C45] focus-visible:ring-offset-2"
                  >
                    Apply Now
                  </button>

                  <button
                    onClick={openPopup}
                    aria-label={`Download Brochure for ${item.name}`}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-transparent py-3 text-sm font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
                  >
                    Download Brochure
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
