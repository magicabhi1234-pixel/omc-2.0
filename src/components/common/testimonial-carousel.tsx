"use client";

import { useEffect, useRef } from "react";
import type { Testimonial } from "@/types/landing";

type Props = {
  testimonials: Testimonial[];
};

const AUTOPLAY_INTERVAL_MS = 4000;
const RESET_DELAY_MS = 550;

export default function TestimonialCarousel({ testimonials }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = testimonials.length;
  const cloneCount = Math.min(3, count);
  // Clone the first few cards at the end so advancing past the last real
  // card lands on a visual duplicate of the first - the loop then silently
  // snaps back to index 0 (no animation) once the transition settles.
  const displayItems = count > 1 ? [...testimonials, ...testimonials.slice(0, cloneCount)] : testimonials;

  const getStep = () => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>("[data-testimonial-card]");
    if (!el || !card) return 0;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "0");
    return card.offsetWidth + gap;
  };

  const scrollToIndex = (index: number, smooth: boolean) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * getStep(), behavior: smooth ? "smooth" : "auto" });
  };

  const goNext = () => {
    if (count <= 1) return;
    indexRef.current += 1;
    scrollToIndex(indexRef.current, true);

    if (indexRef.current >= count) {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => {
        indexRef.current = 0;
        scrollToIndex(0, false);
      }, RESET_DELAY_MS);
    }
  };

  const goPrev = () => {
    if (count <= 1) return;
    indexRef.current = indexRef.current <= 0 ? count - 1 : indexRef.current - 1;
    scrollToIndex(indexRef.current, true);
  };

  // Autoplay
  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) goNext();
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Keep indexRef in sync with the actual scroll position after any
  // user-driven swipe/scroll settles, so autoplay resumes from the right spot.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || count <= 1) return;

    const handleScroll = () => {
      if (scrollSyncTimeoutRef.current) clearTimeout(scrollSyncTimeoutRef.current);
      scrollSyncTimeoutRef.current = setTimeout(() => {
        const step = getStep();
        if (step > 0) {
          indexRef.current = Math.round(el.scrollLeft / step) % count;
        }
      }, 150);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [count]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (scrollSyncTimeoutRef.current) clearTimeout(scrollSyncTimeoutRef.current);
    };
  }, []);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className="relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth contain-layout px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {displayItems.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            data-testimonial-card
            className="w-full flex-none snap-start md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonials"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-[#0B3B68] hover:text-[#0B3B68]"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
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
