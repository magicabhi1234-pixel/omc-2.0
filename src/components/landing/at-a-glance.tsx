import type { University } from "@/types/landing";

/** "₹1,20,000" -> 120000; anything without digits ("Contact for fee") -> null. */
export function parseFee(fee: string | undefined): number | null {
  const digits = fee?.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function approvalLabels(u: University) {
  return (u.approvals ?? []).map((a) => a?.label).filter(Boolean) as string[];
}

/**
 * Answer-first summary + a crawlable comparison table, derived only from the
 * universities on the page - so the facts can't drift from what's listed.
 * Gives search snippets / AI Overviews a direct, quotable answer, and makes
 * the comparison available without the interactive compare widget.
 */
export default function AtAGlance({
  title,
  category,
  universities,
  updatedAt,
}: {
  title: string;
  category: string;
  universities: University[];
  updatedAt?: string;
}) {
  if (universities.length === 0) return null;

  const fees = universities.map((u) => parseFee(u.startingFee)).filter((n): n is number => n !== null && n > 0);
  const minFee = fees.length ? Math.min(...fees) : null;
  const maxFee = fees.length ? Math.max(...fees) : null;
  const ugc = universities.filter((u) => approvalLabels(u).some((l) => /ugc/i.test(l))).length;
  const naac = universities.filter((u) => approvalLabels(u).some((l) => /naac/i.test(l))).length;
  const durations = [...new Set(universities.map((u) => u.duration?.toLowerCase().replace(/\s+/g, " ").trim()).filter(Boolean))];
  const cheapest = minFee !== null ? universities.find((u) => parseFee(u.startingFee) === minFee) : undefined;
  const programme = category.replace(/s$/, "");
  const updated = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })
    : null;

  return (
    <section aria-labelledby="at-a-glance-heading" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-8">
          <h2 id="at-a-glance-heading" className="text-2xl font-bold text-slate-900 md:text-3xl">
            {title}: at a glance
          </h2>
          <p className="mt-3 leading-7 text-slate-700">
            <strong>{universities.length} universities</strong> are compared on this page for {programme} programmes.
            {minFee !== null && maxFee !== null && (
              <>
                {" "}Listed fees range from <strong>{inr(minFee)}</strong> to <strong>{inr(maxFee)}</strong> for the full programme
                {cheapest ? <> ({cheapest.name} has the lowest listed fee)</> : null}.
              </>
            )}
            {ugc > 0 && (
              <>
                {" "}<strong>{ugc} of {universities.length}</strong> list UGC approval
                {naac > 0 ? <> and {naac} hold a NAAC accreditation</> : null}.
              </>
            )}
            {durations.length > 0 && <> Typical duration: {durations.join(" / ")}.</>}
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li>✓ Check UGC-DEB entitlement for the exact programme and session before paying.</li>
            <li>✓ Compare the total fee, not the first-semester fee or EMI.</li>
            <li>✓ Online and distance MBAs from UGC-entitled universities are valid for jobs and higher studies.</li>
            <li>✓ Free counselling is available to shortlist universities for your budget.</li>
          </ul>
          {updated && <p className="mt-4 text-xs text-slate-500">Last updated {updated}</p>}
        </div>

        <h2 className="mt-10 text-xl font-bold text-slate-900 md:text-2xl">Quick comparison: fees, duration and approvals</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Comparison of universities listed on this page</caption>
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">University</th>
                <th scope="col" className="px-4 py-3 font-semibold">Mode</th>
                <th scope="col" className="px-4 py-3 font-semibold">Duration</th>
                <th scope="col" className="px-4 py-3 font-semibold">Starting fee</th>
                <th scope="col" className="px-4 py-3 font-semibold">Approvals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {universities.map((u) => (
                <tr key={u.id}>
                  <th scope="row" className="px-4 py-3 font-medium text-slate-900">{u.name}</th>
                  <td className="px-4 py-3 text-slate-700">{u.studyMode}</td>
                  <td className="px-4 py-3 text-slate-700">{u.duration}</td>
                  <td className="px-4 py-3 text-slate-700">{u.startingFee}</td>
                  <td className="px-4 py-3 text-slate-700">{approvalLabels(u).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
