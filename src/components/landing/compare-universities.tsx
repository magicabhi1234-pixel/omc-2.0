"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CompareSection, CompareFeature, University } from "@/types/landing";
import { universities as universityCatalog, defaultUniversityIds } from "@/data/universities/universities";

type Props = Partial<CompareSection> & {
  universities?: string[];
};

const FALLBACK_LOGO = "/universities/omc_logo.avif";

const DEFAULT_FEATURES: CompareFeature[] = [
  { id: "fees", label: "Total Fees", key: "startingFee" },
  { id: "duration", label: "Duration", key: "duration" },
  { id: "mode", label: "Study Mode", key: "studyMode" },
  { id: "placement", label: "Placement Support", key: "placementSupport" },
];

function featureValue(university: University, key: CompareFeature["key"]): string {
  const value = university[key as keyof University];
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export default function CompareUniversities(props: Props) {
  const {
    heading = "Compare universities with confidence",
    description = "Shortlist up to three universities and compare fees, accreditation, and study support side by side.",
    features = DEFAULT_FEATURES,
    universities: universityIds = defaultUniversityIds,
  } = props;

  const pageUniversities = useMemo(
    () =>
      universityIds
        .map((id) => universityCatalog.find((university) => university.id === id))
        .filter((university): university is University => Boolean(university)),
    [universityIds]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<University[]>([]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const results = useMemo(
    () => pageUniversities.filter(({ name }) => name.toLowerCase().includes(query.toLowerCase())),
    [pageUniversities, query]
  );

  const toggleUniversity = (university: University) => {
    setSelected((current) => {
      if (current.some(({ id }) => id === university.id)) return current.filter(({ id }) => id !== university.id);
      return current.length < 3 ? [...current, university] : current;
    });
  };

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-3xl bg-[#0B3B68] px-6 py-10 text-center text-white shadow-xl sm:px-10 md:py-14">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">Find your best fit</span>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold md:text-5xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">{description}</p>
          <button type="button" onClick={() => setIsOpen(true)} className="mt-7 cursor-pointer rounded-xl bg-[#F47C45] px-7 py-3 font-semibold text-white transition hover:bg-[#e06c35] focus:outline-none focus:ring-2 focus:ring-white">
            Compare Universities {selected.length > 0 && `(${selected.length})`}
          </button>
        </div>

        {selected.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[680px] w-full text-left">
              <caption className="sr-only">Selected university comparison</caption>
              <thead className="bg-slate-50 text-slate-900"><tr><th className="p-5 font-semibold">Compare</th>{selected.map((university) => <th key={university.id} className="min-w-48 p-5"><div className="flex items-center gap-3"><Image src={university.logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" onError={(event) => { event.currentTarget.src = FALLBACK_LOGO; }} /><span>{university.name}</span></div></th>)}</tr></thead>
              <tbody className="text-slate-600">
                {features.map((feature) => <tr key={feature.id} className="border-t"><th className="p-5 font-medium text-slate-900">{feature.label}</th>{selected.map((university) => <td key={university.id} className="p-5">{featureValue(university, feature.key)}</td>)}</tr>)}
              </tbody>
            </table>
            <div className="border-t px-5 py-4 text-center"><button type="button" onClick={() => setIsOpen(true)} className="cursor-pointer font-semibold text-[#0B3B68] underline underline-offset-4">Change selection</button></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={() => setIsOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="compare-title" className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b p-5 sm:p-7"><div><h2 id="compare-title" className="text-2xl font-bold text-slate-900">Select universities to compare</h2><p className="mt-1 text-sm text-slate-600">Choose up to three universities ({selected.length}/3 selected).</p></div><button type="button" aria-label="Close comparison" onClick={() => setIsOpen(false)} className="cursor-pointer rounded-full p-2 text-2xl leading-none text-slate-500 hover:bg-slate-100">×</button></div>
            <div className="p-5 sm:p-7"><label htmlFor="university-search" className="sr-only">Search universities</label><input id="university-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search universities" className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#0B3B68] focus:ring-2 focus:ring-[#0B3B68]/20" />
              <div className="mt-5 grid max-h-[45vh] gap-3 overflow-y-auto sm:grid-cols-2">
                {results.map((university) => { const active = selected.some(({ id }) => id === university.id); return <button type="button" key={university.id} aria-pressed={active} onClick={() => toggleUniversity(university)} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition ${active ? "border-[#F47C45] bg-orange-50 ring-1 ring-[#F47C45]" : "border-slate-200 hover:border-[#0B3B68]"}`}><Image src={university.logo} alt="" width={48} height={48} className="h-12 w-12 object-contain" onError={(event) => { event.currentTarget.src = FALLBACK_LOGO; }} /><span><b className="block text-slate-900">{university.name}</b><small className="text-slate-600">{university.studyMode} · {university.startingFee}</small></span></button>; })}
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t p-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setSelected([])} className="cursor-pointer rounded-xl px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100">Clear</button><button type="button" onClick={() => setIsOpen(false)} className="cursor-pointer rounded-xl bg-[#F47C45] px-5 py-3 font-semibold text-white hover:bg-[#e06c35]">View comparison</button></div>
          </div>
        </div>
      )}
    </section>
  );
}
