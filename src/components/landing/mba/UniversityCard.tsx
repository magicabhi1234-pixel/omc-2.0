import Image from "next/image";

type University = {
  _id: string;
  name: string;
  studyMode?: string;
  duration?: string;
  approvals?: string[];
  startingFee?: number;
  eligibility?: string;

  logo?: {
    asset?: {
      url: string;
    };
  };
};

type UniversityCardProps = {
  university: University;
  onCTAClick?: () => void;
};

export default function UniversityCard({
  university,
  onCTAClick,
}: UniversityCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Logo */}

      <div className="flex h-32 items-center justify-center border-b bg-slate-50 p-6">
        {university.logo?.asset?.url ? (
          <Image
            src={university.logo.asset.url}
            alt={university.name}
            width={180}
            height={80}
            className="max-h-20 w-auto object-contain"
          />
        ) : (
          <div className="text-slate-400">
            No Logo
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">

        <h3 className="text-center text-2xl font-bold text-[#0F172A]">
          {university.name}
        </h3>

        <div className="mt-6 space-y-4 text-sm">

          <div className="flex justify-between gap-4">
            <span className="font-medium text-slate-500">
              Study Mode
            </span>

            <span className="text-right font-semibold">
              {university.studyMode || "-"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="font-medium text-slate-500">
              Duration
            </span>

            <span className="text-right font-semibold">
              {university.duration || "-"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="font-medium text-slate-500">
              Approvals
            </span>

            <span className="max-w-[170px] text-right font-semibold">
              {university.approvals?.length
                ? university.approvals.join(", ")
                : "-"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="font-medium text-slate-500">
              Starting Fees
            </span>

            <span className="font-bold text-[#F47C45]">
              {university.startingFee
                ? `₹${university.startingFee.toLocaleString()}`
                : "-"}
            </span>
          </div>

        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <strong className="text-[#0F172A]">
            Eligibility:
          </strong>{" "}
          {university.eligibility || "Not Available"}
        </div>

        <div className="mt-auto pt-6">

          <div className="flex gap-3">

            <button
              onClick={onCTAClick}
              className="flex-1 cursor-pointer rounded-xl border-2 border-[#0B3B68] py-3 font-semibold text-[#0B3B68] transition-all duration-300 hover:bg-[#0B3B68] hover:text-white"
            >
              Download Brochure
            </button>

            <button
              onClick={onCTAClick}
              className="flex-1 cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#e46f38]"
            >
              Enquire Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}