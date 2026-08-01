import { BenefitsSection as BenefitsSectionType } from "@/types/landing";
import FeatureIcon from "@/components/common/feature-icon";

type Props = Partial<BenefitsSectionType>;

export default function Benefits({ heading, description, items }: Props) {
  if (!heading || !items || items.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
            Benefits
          </span>
          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">{description}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:border-[#0B3B68] hover:shadow-md"
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#0B3B68]/10 text-[#0B3B68]">
                <FeatureIcon icon={item.icon} title={item.title} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 leading-6 text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
