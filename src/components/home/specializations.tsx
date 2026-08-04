import Container from "@/components/common/container";
import FeatureIcon from "@/components/common/feature-icon";
import OpenPopupButton from "@/components/common/open-popup-button";

const specializations = [
  {
    title: "MBA Finance",
    description: "Investment, Banking & Financial Management",
    icon: "💰",
  },
  {
    title: "MBA Marketing",
    description: "Digital Marketing & Brand Management",
    icon: "📈",
  },
  {
    title: "MBA Human Resource",
    description: "People Management & Talent Acquisition",
    icon: "👥",
  },
  {
    title: "MBA Operations",
    description: "Supply Chain & Operations Excellence",
    icon: "⚙️",
  },
  {
    title: "MBA Business Analytics",
    description: "Data Driven Decision Making",
    icon: "📊",
  },
  {
    title: "MBA IT Management",
    description: "Technology & Business Leadership",
    icon: "💻",
  },
];

export default function Specializations() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-700">
            Popular Programs
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Explore MBA Specializations
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Choose the right specialization based on your career goals,
            interests and industry demand.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {specializations.map((item) => (
            <div
              key={item.title}
              className="
                group
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[#F47C45]
                hover:shadow-xl
              "
            >
              {/* Icon */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#F47C45] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#F47C45] group-hover:text-white">
                <FeatureIcon icon={item.icon} title={item.title} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-slate-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-slate-600">
                {item.description}
              </p>

              {/* CTA */}
              <OpenPopupButton className="mt-5 cursor-pointer font-medium text-[#0B3B68] transition hover:text-[#F47C45]">
                Learn More →
              </OpenPopupButton>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
