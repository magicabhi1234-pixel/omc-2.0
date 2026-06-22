"use client";

import Image from "next/image";
import { northZoneUniversities } from "@/constants/north-zone-universities";

export default function UniversityGrid() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Top North Zone MBA Universities
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {northZoneUniversities.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Image
                src={item.logo}
                alt={item.name}
                width={250}
                height={120}
                className="mx-auto h-20 object-contain"
              />

              <h3 className="mt-5 text-lg font-semibold">
                {item.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {item.grade}
              </p>

              <p className="mt-2 font-bold text-[#0B3B68]">
                {item.fees}
              </p>

              <button
                onClick={() =>
                  window.dispatchEvent(
                    new Event("openLeadPopup")
                  )
                }
                className="mt-5 w-full rounded-xl bg-[#F47C45] py-3 font-medium text-white transition hover:bg-[#e56c34]"
              >
                Apply Now
              </button>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}