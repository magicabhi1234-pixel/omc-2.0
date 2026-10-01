"use client";

import { useMemo, useState } from "react";
import Container from "@/components/common/container";
import type { FinderUniversity } from "@/lib/db/queries";

const BUDGETS = [
  { id: "1", label: "Under ₹1 Lakh", max: 100000 },
  { id: "2", label: "Up to ₹2 Lakhs", max: 200000 },
  { id: "3", label: "Up to ₹3 Lakhs", max: 300000 },
  { id: "any", label: "Any budget", max: Infinity },
] as const;

const MODES = [
  { id: "any", label: "Online or distance" },
  { id: "online", label: "Online" },
  { id: "distance", label: "Distance" },
] as const;

/** NAAC A++ > A+ > A > others: a transparent, explainable ranking (no invented "match %"). */
function naacRank(approvals: string[]) {
  const naac = approvals.find((a) => /naac/i.test(a))?.toUpperCase() ?? "";
  if (naac.includes("A++")) return 3;
  if (naac.includes("A+")) return 2;
  if (/NAAC\s*A\b/.test(naac)) return 1;
  return 0;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function AIMatchFinder({ universities }: { universities: FinderUniversity[] }) {
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]["id"]>("2");
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("any");
  const [submitted, setSubmitted] = useState<{ budget: string; mode: string } | null>(null);

  const results = useMemo(() => {
    if (!submitted) return [];
    const max = BUDGETS.find((b) => b.id === submitted.budget)?.max ?? Infinity;
    return universities
      .filter((u) => u.fee <= max)
      .filter((u) => submitted.mode === "any" || u.studyMode.toLowerCase().includes(submitted.mode))
      .filter((u) => u.approvals.some((a) => /ugc/i.test(a)))
      .sort((a, b) => naacRank(b.approvals) - naacRank(a.approvals) || a.fee - b.fee)
      .slice(0, 6);
  }, [submitted, universities]);

  if (universities.length === 0) return null;

  return (
    <section aria-labelledby="finder-heading" className="bg-slate-50 py-16 md:py-20">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold tracking-wider text-orange-800 uppercase">University Finder</span>
          <h2 id="finder-heading" className="mt-3 text-3xl font-bold text-[#0F172A] md:text-4xl">
            Find online MBA universities within your budget
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Filters {universities.length} UGC-listed universities by total fee and study mode, then ranks them by NAAC grade and fee.
          </p>
        </div>

        <form
          className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-5 shadow-lg md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted({ budget, mode });
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="finder-budget" className="mb-2 block font-medium text-slate-700">
                Total fee budget
              </label>
              <select id="finder-budget" value={budget} onChange={(e) => setBudget(e.target.value as typeof budget)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]">
                {BUDGETS.map((b) => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="finder-mode" className="mb-2 block font-medium text-slate-700">
                Study mode
              </label>
              <select id="finder-mode" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]">
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button type="submit" className="cursor-pointer rounded-xl bg-[#0B3B68] px-8 py-4 font-semibold text-white transition hover:opacity-90">
              Show matching universities
            </button>
          </div>

          <div aria-live="polite">
            {submitted && (
              <div className="mt-10">
                <h3 className="text-center text-2xl font-bold text-[#0F172A]">
                  {results.length > 0 ? `${results.length} universities match` : "No universities match those filters"}
                </h3>
                {results.length > 0 ? (
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((u) => (
                      <li key={u.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="font-bold text-[#0F172A]">{u.name}</p>
                        <p className="mt-2 text-sm text-slate-700">
                          Fee from <strong>{inr(u.fee)}</strong> · {u.duration}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">{u.approvals.join(" · ")}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-center text-slate-600">Try a higher budget or any study mode.</p>
                )}
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("openLeadPopup"))}
                    className="cursor-pointer rounded-xl bg-[#C2410C] px-8 py-4 font-semibold text-white transition hover:opacity-90"
                  >
                    Get a free personalised shortlist
                  </button>
                  <p className="mt-2 text-xs text-slate-500">Fees are the listed starting fee for the full programme; confirm with the university before applying.</p>
                </div>
              </div>
            )}
          </div>
        </form>
      </Container>
    </section>
  );
}
