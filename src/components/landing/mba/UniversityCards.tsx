import UniversityCard from "./UniversityCard";

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

type UniversitySection = {
  badge?: string;
  heading?: string;
  description?: string;
};

type Props = {
  section?: UniversitySection;
  universities: University[];
  onCTAClick?: () => void;
};

export default function UniversityCards({
  section,
  universities,
  onCTAClick,
}: Props) {
  const uniqueUniversities = Array.from(
    new Map(universities.map((u) => [u._id, u])).values()
  );

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">

        {/* Section Heading */}

        <div className="mx-auto mb-14 max-w-4xl text-center">

          {section?.badge && (
            <span className="inline-flex rounded-full bg-[#0B3B68]/10 px-4 py-2 text-sm font-semibold text-[#0B3B68]">
              {section.badge}
            </span>
          )}

          {section?.heading && (
            <h2 className="mt-5 text-4xl font-bold leading-tight text-[#0F172A] md:text-5xl">
              {section.heading}
            </h2>
          )}

          {section?.description && (
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {section.description}
            </p>
          )}

        </div>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {uniqueUniversities.map((university) => (
            <UniversityCard
              key={university._id}
              university={university}
              onCTAClick={onCTAClick}
            />
          ))}
        </div>

      </div>
    </section>
  );
}