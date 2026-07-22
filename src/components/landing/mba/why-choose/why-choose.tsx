import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import { WhyChooseSection as WhyChooseSectionType } from "@/types/landing";

export default function WhyChooseSection({
  heading,
  description,
  items,
}: WhyChooseSectionType) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          badge="Why Choose Us"
          title={heading}
          description={description}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-2xl"
            >
              <div className="mb-5 text-5xl">{item.icon}</div>

              <h3 className="text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

