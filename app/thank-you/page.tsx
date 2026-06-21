export default function ThankYouPage() {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
  
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <span className="text-4xl">✓</span>
          </div>
  
          <h1 className="text-4xl font-bold text-slate-900">
            Thank You!
          </h1>
  
          <p className="mt-4 text-lg text-slate-600">
            Your enquiry has been submitted successfully.
          </p>
  
          <p className="mt-2 text-slate-500">
            Our MBA admission experts will contact you shortly and help
            you compare universities, fees, specializations and admission process.
          </p>
  
          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">
              What Happens Next?
            </h3>
  
            <ul className="mt-4 space-y-3 text-left text-slate-600">
              <li>✓ Expert counsellor will call you.</li>
              <li>✓ University comparison report will be shared.</li>
              <li>✓ Fee & admission guidance provided.</li>
              <li>✓ Career-focused specialization suggestions.</li>
            </ul>
          </div>
  
          <a
            href="/"
            className="mt-8 inline-block rounded-xl bg-[#F47C45] px-8 py-4 font-semibold text-white transition hover:opacity-90"
          >
            Back To Home
          </a>
  
        </div>
      </section>
    );
  }