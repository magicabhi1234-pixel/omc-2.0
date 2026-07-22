"use client";

import { SpecializationSection } from "@/types/landing";

type Props = Partial<SpecializationSection>;

const defaultSpecializations = [
  {
    icon: "📈",
    title: "Marketing Management",
    desc: "Digital Marketing, Brand Management & Sales Strategy",
  },
  {
    icon: "💰",
    title: "Finance Management",
    desc: "Investment, Banking, Financial Planning & Risk Management",
  },
  {
    icon: "👥",
    title: "Human Resource Management",
    desc: "Talent Acquisition, HR Analytics & Employee Relations",
  },
  {
    icon: "⚙️",
    title: "Operations Management",
    desc: "Supply Chain, Logistics & Process Optimization",
  },
  {
    icon: "📊",
    title: "Business Analytics",
    desc: "Data Analysis, Business Intelligence & Decision Making",
  },
  {
    icon: "💻",
    title: "Information Technology",
    desc: "IT Strategy, Technology Management & Digital Transformation",
  },
  {
    icon: "🌍",
    title: "International Business",
    desc: "Global Trade, Export-Import & International Markets",
  },
  {
    icon: "🚚",
    title: "Supply Chain Management",
    desc: "Procurement, Logistics & Inventory Management",
  },
];

export default function Specializations(props: Props) {
  const {
    heading = "Popular MBA Specializations",
    description = "Choose from industry-demand MBA specializations and build a successful career in your preferred domain.",
    items,
  } = props;

  const openPopup = () => {
    window.dispatchEvent(
      new Event("openLeadPopup")
    );
  };

  const specializations = items && items.length > 0
    ? items.map(item => ({
        icon: item.icon || "",
        title: item.title,
        desc: "",
      }))
    : defaultSpecializations;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-14 text-center">

          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
            MBA Programs
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {heading}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            {description}
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {specializations.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-2xl"
            >

              <div className="mb-5 text-5xl">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-4 min-h-[80px] text-slate-600">
                {item.desc}
              </p>

              <button
                onClick={openPopup}
                className="mt-6 w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90"
              >
                Apply Now
              </button>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
