import Image from "next/image";
import { University } from "@/types/landing";

type UniversityCardProps = {
  university: University;
};

const openPopup = () => {
  window.dispatchEvent(new Event("openLeadPopup"));
};

export default function UniversityCard({ university }: UniversityCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B3B68] to-[#123f6d] p-5">
        <div className="rounded-xl bg-white p-4">
          <Image
            src={university.logo}
            alt={university.name}
            width={220}
            height={100}
            className="mx-auto h-16 w-auto object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Approvals badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {university.approvals.map((approval) => (
            <span
              key={approval.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                approval.id === "naac"
                  ? "bg-green-100 text-green-700"
                  : approval.id === "ugc"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
              }`}
            >
              {approval.label}
            </span>
          ))}
          {university.rankings && university.rankings.length > 0 && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              {university.rankings[0].source} {university.rankings[0].value}
            </span>
          )}
        </div>

        <h3 className="min-h-[48px] text-xl font-bold text-slate-900">
          {university.name}
        </h3>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-slate-500">Fees</span>
            <span className="font-bold text-[#0B3B68]">
              {university.startingFee}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-slate-500">Duration</span>
            <span className="font-semibold">{university.duration}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-slate-500">Study Mode</span>
            <span className="font-semibold">{university.studyMode}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Placement Support</span>
            <span className="font-semibold text-green-600">
              {university.placementSupport || "No"}
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

          <button
            onClick={openPopup}
            className="w-full cursor-pointer rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-50"
          >
            Download Brochure
          </button>
        </div>
      </div>
    </div>
  );
}

