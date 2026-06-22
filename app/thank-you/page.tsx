import Link from "next/link";

export const metadata = {
  title: "Thank You | Online MBA Colleges",
  description:
    "Thank you for submitting your enquiry. Our MBA admission experts will contact you shortly.",
};

export default function ThankYouPage() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <span className="text-5xl">✓</span>
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
            📞 Expected Callback Time: Within 15 Minutes
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">

          <h3 className="font-semibold text-slate-900">
            What Happens Next?
          </h3>

          <ul className="mt-4 space-y-3 text-left text-slate-600">

            <li>
              ✓ Expert counsellor will contact you.
            </li>

            <li>
              ✓ University comparison guidance will be provided.
            </li>

            <li>
              ✓ Scholarship and EMI options will be shared.
            </li>

            <li>
              ✓ Admission assistance from start to enrollment.
            </li>

          </ul>

        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-xl bg-[#0B3B68] px-8 py-4 font-semibold text-white transition hover:opacity-90"
        >
          Back To Home
        </Link>

      </div>
    </section>
  );
}