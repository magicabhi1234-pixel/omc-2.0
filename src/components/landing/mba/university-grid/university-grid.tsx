import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import { UniversitySection, University } from "@/types/landing";
import { universities } from "@/data/universities/universities";
import UniversityCard from "./university-card";

type UniversityGridProps = UniversitySection & {
  category?: string;
};

export default function UniversityGrid({
  badge,
  heading,
  description,
  universities: universityIds,
  category,
}: UniversityGridProps) {
  const universityList: University[] = universityIds
    .map((id) => universities.find((u) => u.id === id))
    .filter((u): u is University => u !== undefined);

  if (universityList.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionHeading
          badge={badge || "Top Universities"}
          title={heading}
          description={description}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {universityList.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      </Container>
    </section>
  );
}

