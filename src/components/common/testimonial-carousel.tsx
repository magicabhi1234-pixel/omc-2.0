"use client";

import { useRef } from "react";
import type { Testimonial } from "@/types/landing";

type Props = {
  testimonials: Testimonial[];
};

export default function TestimonialCarousel({ testimonials }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const amount = (card?.offsetWidth ?? el.clientWidth) + 24;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            data-testimonial-card
            className="w-[82%] flex-none snap-start sm:w-[46%] lg:w-[31%]"
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous testimonials"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-[#0B3B68] hover:text-[#0B3B68]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next testimonials"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-[#0B3B68] hover:text-[#0B3B68]"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl">
      <div className="mb-4 flex gap-1 text-lg text-yellow-400" aria-hidden="true">
        {"★".repeat(testimonial.rating)}
        <span className="text-slate-200">{"★".repeat(Math.max(0, 5 - testimonial.rating))}</span>
      </div>
      <span className="sr-only">Rated {testimonial.rating} out of 5 stars</span>

      <p className="flex-1 leading-relaxed text-slate-600">&ldquo;{testimonial.review}&rdquo;</p>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="font-bold text-slate-900">{testimonial.name}</p>
        {(testimonial.designation || testimonial.university) && (
          <p className="text-sm text-slate-500">
            {[testimonial.designation, testimonial.university].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
