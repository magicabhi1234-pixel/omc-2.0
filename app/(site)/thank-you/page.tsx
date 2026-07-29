import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Thank You",
  description: "Thank you for submitting your enquiry. Our MBA admission experts will contact you shortly.",
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <span className="text-5xl" aria-hidden="true">✓</span>
        </div>

        <h1 className="text-4xl font-bold text-slate-900">
          Thank You!
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Your enquiry has been submitted successfully.
        </p>

        <p className="mt-3 text-slate-500">
          Our MBA admission experts will contact you shortly and help
          you compare universities, fees, specializations,
          scholarships and admission process.
        </p>

        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
          <p className="font-medium text-green-700">
            <span aria-hidden="true">📞</span> Expected Callback Time: Within 15 Minutes
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">

          <h2 className="font-semibold text-slate-900">
            What Happens Next?
          </h2>

          <ul className="mt-4 space-y-3 text-left text-slate-600">

            <li>
              <span aria-hidden="true">✓</span> Expert counsellor will contact you.
            </li>

            <li>
              <span aria-hidden="true">✓</span> University comparison guidance will be provided.
            </li>

            <li>
              <span aria-hidden="true">✓</span> Scholarship and EMI options will be shared.
            </li>

            <li>
              <span aria-hidden="true">✓</span> Admission assistance from start to enrollment.
            </li>

          </ul>

        </div>

      </div>
    </section>
  );
}
