"use client";

import Image from "next/image";
import { UniversitySection, UniversityApproval } from "@/types/landing";

type Props = Partial<UniversitySection>;

const FALLBACK_LOGO = "/universities/omc_logo.avif";

function validApprovals(approvals: UniversityApproval[] | null | undefined): UniversityApproval[] {
  return (approvals ?? []).filter(
    (approval): approval is UniversityApproval => typeof approval?.id === "string"
  );
}

function getNaacBadge(approvals: UniversityApproval[] | null | undefined): string | null {
  const naac = validApprovals(approvals).find((approval) => approval.id.startsWith("naac"));
  return naac ? naac.label : null;
}

function getOtherApprovalsBadge(approvals: UniversityApproval[] | null | undefined): string | null {
  const others = validApprovals(approvals)
    .filter((approval) => !approval.id.startsWith("naac"))
    .map((approval) => approval.label);
  return others.length > 0 ? others.join(", ") : null;
}

export default function UniversityGrid(props: Props) {
  const {
    badge = "Top Universities",
    heading = "Top Distance MBA Universities",
    description = "Compare NAAC grades, fees, approvals, placements and admission process from India's leading distance MBA universities.",
    universities: defaultUniversities = [],
  } = props;

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-14 text-center">

          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            {badge}
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {heading}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            {description}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {defaultUniversities.map((item) => {
            const naacBadge = getNaacBadge(item.approvals);
            const otherApprovalsBadge = getOtherApprovalsBadge(item.approvals);

            return (
              <div
                key={item.id}
                id={`university-card-${item.id}`}
                className="group scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B3B68] to-[#123f6d] p-5">

                  <div className="rounded-xl bg-white p-4">
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={220}
                      height={100}
                      className="mx-auto h-16 object-contain"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  </div>

                </div>

                {/* Content */}
                <div className="p-6">

                  {(naacBadge || otherApprovalsBadge) && (
                    <div className="mb-4 flex items-center justify-between">

                      {naacBadge && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {naacBadge}
                        </span>
                      )}

                      {otherApprovalsBadge && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {otherApprovalsBadge}
                        </span>
                      )}

                    </div>
                  )}

                  <h3 className="min-h-[60px] text-center text-xl font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between border-b pb-2">

                      <span className="text-slate-500">
                        MBA Fees
                      </span>

                      <span className="font-bold text-[#0B3B68]">
                        {item.startingFee}
                      </span>

                    </div>

                    <div className="flex items-center justify-between border-b pb-2">

                      <span className="text-slate-500">
                        Mode
                      </span>

                      <span className="font-bold text-[#0B3B68]">
                        {item.studyMode}
                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-slate-500">
                        Duration
                      </span>

                      <span className="font-semibold">
                        {item.duration}
                      </span>

                    </div>

                  </div>

                  <div className="mt-6 grid gap-3">

                    <button
                      onClick={openPopup}
                      className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90"
                    >
                      Apply Now
                    </button>

                    {item.brochureUrl ? (
                      <a
                        href={item.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full cursor-pointer rounded-xl border border-slate-300 py-3 text-center font-semibold transition hover:bg-slate-50"
                      >
                        Download Brochure
                      </a>
                    ) : (
                      <button
                        onClick={openPopup}
                        className="w-full cursor-pointer rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-50"
                      >
                        Download Brochure
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
