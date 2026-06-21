"use client";
import Image from "next/image";
import Container from "@/components/common/container";

const universities = [
  {
    name: "Amity University Online",
    grade: "NAAC A+",
    logo: "/universities/amity_university.png",
  },
  {
    name: "Manipal University Jaipur",
    grade: "NAAC A+",
    logo: "/universities/manipal.png",
  },
  {
    name: "Jain University",
    grade: "NAAC A++",
    logo: "/universities/jain.png",
  },
  {
    name: "LPU Online",
    grade: "NAAC A++",
    logo: "/universities/lpu.png",
  },
];

export default function TrustedUniversities() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            Trusted Universities
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Learn From India's Top Universities
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Compare fees, rankings, approvals and placements from
            India's most trusted online universities.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {universities.map((university) => (
            <div
              key={university.name}
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
              {/* Logo */}
              <div className="flex h-20 items-center justify-center">
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={160}
                  height={60}
                  className="h-14 w-auto object-contain"
                />
              </div>

              {/* University Name */}
              <h3 className="mt-5 text-center font-semibold text-slate-900">
                {university.name}
              </h3>

              {/* Grade */}
              <p className="mt-2 text-center text-sm text-slate-500">
                {university.grade}
              </p>

              {/* CTA */}
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new Event("openLeadPopup")
                  )
                }
                className="mt-5 w-full cursor-pointer rounded-xl border border-slate-200 py-3 text-sm font-semibold text-[#0B3B68] transition hover:bg-[#0B3B68] hover:text-white"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}