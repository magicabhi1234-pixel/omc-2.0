import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import FeatureIcon from "@/components/common/feature-icon";
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
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#F47C45] transition duration-300 group-hover:scale-105 group-hover:bg-[#F47C45] group-hover:text-white">
                <FeatureIcon icon={item.icon} title={item.title} />
              </div>

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
