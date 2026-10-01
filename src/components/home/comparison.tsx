import Container from "@/components/common/container";

export default function Comparison() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-orange-700">
            AI Comparison
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Compare Universities Side By Side
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Compare fees, accreditation, placements and rankings before
            making your admission decision.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[520px]">
            <caption className="sr-only">Amity Online vs Manipal Online MBA comparison</caption>
            <thead className="bg-[#0B3B68] text-white">
              <tr>
                <th scope="col" className="p-5 text-left">Feature</th>
                <th scope="col" className="p-5 text-left">Amity Online</th>
                <th scope="col" className="p-5 text-left">Manipal Online</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-5 font-medium">NAAC Grade</td>
                <td className="p-5">A+</td>
                <td className="p-5">A+</td>
              </tr>

              <tr className="border-b">
                <td className="p-5 font-medium">MBA Fees</td>
                <td className="p-5">₹1.8 Lakhs</td>
                <td className="p-5">₹1.75 Lakhs</td>
              </tr>

              <tr className="border-b">
                <td className="p-5 font-medium">UGC Approved</td>
                <td className="p-5"><span aria-hidden="true">✅</span><span className="sr-only">Yes</span></td>
                <td className="p-5"><span aria-hidden="true">✅</span><span className="sr-only">Yes</span></td>
              </tr>

              <tr>
                <td className="p-5 font-medium">Placement Support</td>
                <td className="p-5">Available</td>
                <td className="p-5">Available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}