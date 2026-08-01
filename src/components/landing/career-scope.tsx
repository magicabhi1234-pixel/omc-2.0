import { CareerScopeSection as CareerScopeSectionType } from "@/types/landing";

type Props = Partial<CareerScopeSectionType>;

export default function CareerScope({ heading, description, roles }: Props) {
  if (!heading || !roles || roles.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
            Career Scope
          </span>
          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">{description}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">{role.title}</h3>
                {role.salaryRange && (
                  <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {role.salaryRange}
                  </span>
                )}
              </div>
              {role.description && (
                <p className="mt-3 leading-6 text-slate-600">{role.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
