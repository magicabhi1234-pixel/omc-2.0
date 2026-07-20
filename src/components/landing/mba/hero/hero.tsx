"use client";

import Image from "next/image";

import Button from "@/components/common/button";
import Container from "@/components/common/container";
import LeadForm from "@/components/common/lead-form";
import Section from "@/components/common/section";
import { HeroSection } from "@/types/landing";

export default function Hero({
  badge,
  heading,
  description,
  heroImage,
  primaryButton,
  secondaryButton,
  stats = [],
}: HeroSection) {
  const openLeadPopup = () => window.dispatchEvent(new Event("openLeadPopup"));

  return (
    <Section className="bg-gradient-to-br from-[#082f55] via-[#0B3B68] to-[#102a43] py-12 md:py-16 lg:py-20">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#F4B400]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_460px] lg:gap-14">
          <div>
            {badge && (
              <span className="inline-flex rounded-full bg-[#F4B400] px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg">
                {badge}
              </span>
            )}

            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">{description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" onClick={openLeadPopup}>
                {primaryButton.label}
              </Button>
              {secondaryButton && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={openLeadPopup}
                  className="border-white bg-white/10 text-white hover:border-[#F47C45] hover:bg-[#F47C45] hover:text-white"
                >
                  {secondaryButton.label}
                </Button>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/90">
              {[
                "UGC Approved Universities",
                "AICTE Recognized",
                "Free Expert Counselling",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2"><b aria-hidden="true">✓</b>{item}</span>
              ))}
            </div>

            {stats.length > 0 && (
              <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:p-5">
                    <p className="text-3xl font-bold text-[#F4B400]">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-200">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-[460px] pt-5 lg:pt-0">
            <div className="absolute -top-1 right-4 z-20 hidden rounded-full bg-white px-5 py-2 shadow-xl lg:block">
              <span className="text-sm font-semibold text-[#0B3B68]">⭐ 50,000+ Students Guided</span>
            </div>
            {heroImage && (
              <div className="absolute -right-2 -top-7 z-10 block rounded-2xl border border-white/20 bg-white p-2 shadow-2xl sm:p-3">
                <Image src={heroImage.src} alt={heroImage.alt} width={92} height={92} priority className="h-[92px] w-[92px] object-contain" />
              </div>
            )}
            <div className="rounded-3xl bg-white p-5 shadow-[0_25px_60px_rgba(0,0,0,0.18)] sm:p-7">
              <h2 className="mb-1 text-xl font-bold text-slate-900">Get free counselling</h2>
              <p className="mb-5 text-sm text-slate-600">Our experts will help you shortlist the right MBA.</p>
              <LeadForm />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-medium text-white">
              {['UGC Approved', 'AICTE Recognized', 'NAAC Accredited'].map((item) => <span key={item} className="rounded-full bg-white/10 px-3 py-2">✓ {item}</span>)}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
