"use client";

import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import FeatureIcon from "@/components/common/feature-icon";
import { SpecializationSection as SpecializationSectionType } from "@/types/landing";

export default function Specializations({
  heading,
  description,
  items,
}: SpecializationSectionType) {
  if (!items || items.length === 0) return null;

  const openPopup = () => {
    window.dispatchEvent(new Event("openLeadPopup"));
  };

  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <SectionHeading
          badge="MBA Programs"
          title={heading}
          description={description}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-2xl"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#F47C45] transition duration-300 group-hover:scale-105 group-hover:bg-[#F47C45] group-hover:text-white">
                <FeatureIcon icon={item.icon} title={item.title} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <button
                onClick={openPopup}
                className="mt-6 w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#dc6632] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F47C45]"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
