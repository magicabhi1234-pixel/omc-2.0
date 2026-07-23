import React from "react";
import { TestimonialsSection as TestimonialsSectionType } from "@/types/landing";
import { Star } from "lucide-react";

const defaultTestimonials = [
  {
    id: "1",
    name: "Rahul Sharma",
    designation: "Marketing Manager",
    university: "Amity University",
    review: "The distance MBA program helped me advance my career while working full-time. The curriculum was relevant and the faculty was supportive.",
    rating: 5,
  },
  {
    id: "2",
    name: "Priya Singh",
    designation: "Business Analyst",
    university: "LPU Online",
    review: "Excellent learning experience with great flexibility. The placement support helped me land my dream job.",
    rating: 5,
  },
  {
    id: "3",
    name: "Amit Verma",
    designation: "Operations Head",
    university: "Symbiosis",
    review: "The program was well-structured and the online platform was intuitive. Highly recommended for working professionals.",
    rating: 4,
  },
];

type Props = Partial<TestimonialsSectionType>;

export default function Testimonials({ heading, description, testimonials }: Props) {
  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const title = heading || "What Our Students Say";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-orange-200/50 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F47C45] shadow-sm">
            Testimonials
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
              {description}
            </p>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < testimonial.rating ? "#FBBF24" : "none"}
                    className={i < testimonial.rating ? "text-[#FBBF24]" : "text-slate-200"}
                  />
                ))}
              </div>
              <p className="text-base leading-relaxed text-slate-600 italic">
                &ldquo;{testimonial.review}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                <div>
                  <p className="font-extrabold text-slate-900">{testimonial.name}</p>
                  {testimonial.designation && (
                    <p className="mt-1 text-xs font-semibold text-[#0B3B68] uppercase tracking-wide">
                      {testimonial.designation}
                    </p>
                  )}
                  {testimonial.university && (
                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                      {testimonial.university}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
