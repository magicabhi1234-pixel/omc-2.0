"use client";

import Image from "next/image";
import { University, CompareFeature } from "@/types/landing";

type CompareTableProps = {
  universities: University[];
  features: CompareFeature[];
};

export default function CompareTable({
  universities,
  features,
}: CompareTableProps) {
  if (universities.length === 0) return null;

  const getValue = (university: University, key: string): string => {
    switch (key) {
      case "startingFee":
        return university.startingFee;
      case "duration":
        return university.duration;
      case "studyMode":
        return university.studyMode;
      case "eligibility":
        return university.eligibility;
      case "placementSupport":
        return university.placementSupport || "No";
      default:
        return "-";
    }
  };

  return (
    <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[680px] text-left">
        <caption className="sr-only">University comparison table</caption>
        <thead className="bg-slate-50 text-slate-900">
          <tr>
            <th className="p-5 font-semibold">Compare</th>
            {universities.map((university) => (
              <th key={university.id} className="min-w-48 p-5">
                <div className="flex items-center gap-3">
                  <Image
                    src={university.logo}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 flex-shrink-0 object-contain"
                  />
                  <span className="text-sm font-semibold">
                    {university.name}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-600">
          {features.map((feature) => (
            <tr key={feature.id} className="border-t">
              <th className="p-5 font-medium text-slate-900">
                {feature.label}
              </th>
              {universities.map((university) => (
                <td key={university.id} className="p-5">
                  {getValue(university, feature.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

