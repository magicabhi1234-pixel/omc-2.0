"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CompareSection } from "@/types/landing";
import { northZoneUniversities } from "@/constants/north-zone-universities";

type University = (typeof northZoneUniversities)[number];

type Props = Partial<CompareSection>;

const comparisonRows = [
  ["Total fees", "fees"],
  ["Accreditation", "grade"],
  ["Duration", "2 years"],
  ["Study mode", "Online / Distance"],
  ["Placement support", "Available"]
] as const;

export default function CompareUniversities(props: Props) {
  const {
    heading = "Compare universities with confidence",
    description = "Shortlist up to three universities and compare fees, accreditation, and study support side by side.",
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<University[]>([]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const results = useMemo(
    () =>
      northZoneUniversities.filter(({ name }) =>
        name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const toggleUniversity = (university: University) => {
    setSelected((current) => {
      if (current.some(({ name }) => name === university.name)) {
        return current.filter(({ name }) => name !== university.name);
      }
      return current.length < 3 ? [...current, university] : current;
    });
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Callout Banner Box */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0B3B68] via-[#123f6d] to-[#0F172A] px-6 py-12 text-center text-white shadow-xl sm:px-10 md:py-16">
          {/* Background Glows */}
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[#F47C45]/15 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-200 shadow-sm backdrop-blur-md">
              🔍 Find your best fit
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl lg:leading-[1.15]">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
              {description}
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open university comparison selector"
              className="mt-8 cursor-pointer rounded-2xl bg-[#F47C45] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#F47C45]/15 transition-all duration-300 hover:scale-[1.03] hover:shadow-[#F47C45]/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47C45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f6d]"
            >
              Compare Universities {selected.length > 0 && `(${selected.length})`}
            </button>
          </div>
        </div>

        {/* Selected comparison Table */}
        {selected.length > 0 && (
          <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-lg">
            <table className="min-w-[680px] w-full text-left border-collapse">
              <caption className="sr-only">Selected university comparison</caption>
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-sm font-bold uppercase tracking-wider text-slate-500">Compare</th>
                  {selected.map((university) => (
                    <th key={university.name} className="min-w-48 p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-slate-100 bg-white p-2 shadow-xs">
                          <Image
                            src={university.logo}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 object-contain"
                          />
                        </div>
                        <span className="font-extrabold text-slate-900 text-base">{university.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-100">
                {comparisonRows.map(([label, key]) => (
                  <tr key={label} className="transition-colors hover:bg-slate-50/50">
                    <th className="p-6 font-semibold text-slate-900 text-sm">{label}</th>
                    {selected.map((university) => (
                      <td key={university.name} className="p-6 text-sm font-medium">
                        {key === "fees" || key === "grade" ? (
                          key === "fees" ? (
                            <span className="font-extrabold text-[#0B3B68]">{university[key]}</span>
                          ) : (
                            <span className="inline-block rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-bold text-green-700 shadow-xs">
                              {university[key]}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-700">{key}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-slate-100 px-6 py-5 text-center bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="cursor-pointer font-bold text-[#0B3B68] hover:text-[#F47C45] transition-colors duration-300 underline underline-offset-4"
              >
                Change selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Select comparison dialog modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 sm:p-8">
              <div>
                <h2 id="compare-title" className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Select universities to compare
                </h2>
                <p className="mt-1.5 text-sm font-semibold text-slate-500">
                  Choose up to three universities ({selected.length}/3 selected).
                </p>
              </div>
              <button
                type="button"
                aria-label="Close comparison"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-2xl leading-none text-slate-500 transition-all duration-300 hover:bg-slate-200 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              <div>
                <label htmlFor="university-search" className="sr-only">
                  Search universities
                </label>
                <input
                  id="university-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search universities..."
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition-all duration-300 focus:border-[#F47C45] focus:ring-2 focus:ring-[#F47C45]/15 focus:shadow-md"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((university) => {
                  const active = selected.some(({ name }) => name === university.name);
                  return (
                    <button
                      type="button"
                      key={university.name}
                      aria-pressed={active}
                      onClick={() => toggleUniversity(university)}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 hover:scale-[1.01] ${
                        active
                          ? "border-[#F47C45] bg-orange-50 ring-1 ring-[#F47C45] shadow-sm shadow-[#F47C45]/10"
                          : "border-slate-100 bg-white hover:border-[#0B3B68] hover:shadow-md"
                      }`}
                    >
                      <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-xs">
                        <Image
                          src={university.logo}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 object-contain"
                        />
                      </div>
                      <span className="flex-1">
                        <b className="block font-bold text-slate-900 text-sm leading-tight">{university.name}</b>
                        <small className="block mt-1 text-xs font-semibold text-slate-500">
                          {university.grade} · <span className="text-[#0B3B68]">{university.fees}</span>
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelected([])}
                className="cursor-pointer rounded-xl px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors duration-300"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-xl bg-[#F47C45] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#F47C45]/15 transition-all duration-300 hover:opacity-95 active:scale-[0.98]"
              >
                View Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
