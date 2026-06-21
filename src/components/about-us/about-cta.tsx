"use client";

import Container from "@/components/common/container";

export default function AboutCTA() {
  return (
    <section className="bg-[#0B3B68] py-20">
      <Container>

        <div className="text-center text-white">

          <h2 className="text-4xl font-bold">
            Ready To Find Your Perfect MBA?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Get free counselling and university recommendations
            from our admission experts.
          </p>

          <button
            onClick={() =>
              window.dispatchEvent(
                new Event("openLeadPopup")
              )
            }
            className="mt-8 cursor-pointer rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white"
          >
            Get Free Counselling
          </button>

        </div>

      </Container>
    </section>
  );
}