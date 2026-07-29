import Link from "next/link";
import Container from "@/components/common/container";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 py-16">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F47C45]">
            404 Error
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Page Not Found
          </h1>

          <p className="mt-4 text-slate-600">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Explore our landing pages or head back home to keep comparing MBA programs.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-xl bg-[#0B3B68] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Back To Home
            </Link>

            <Link
              href="/landing-pages"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Browse Landing Pages
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
