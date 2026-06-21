export default function CompareUniversities() {
    const universities = [
      {
        name: "Amity University",
        fees: "₹1,99,000",
        grade: "NAAC A+",
        placement: "Yes",
        emi: "Available",
      },
      {
        name: "LPU Online",
        fees: "₹1,80,000",
        grade: "NAAC A++",
        placement: "Yes",
        emi: "Available",
      },
      {
        name: "Chandigarh University",
        fees: "₹1,58,000",
        grade: "NAAC A+",
        placement: "Yes",
        emi: "Available",
      },
      {
        name: "UPES Online",
        fees: "₹1,50,000",
        grade: "NAAC A",
        placement: "Yes",
        emi: "Available",
      },
      {
        name: "NMIMS Global",
        fees: "₹2,10,000",
        grade: "NAAC A+",
        placement: "Yes",
        emi: "Available",
      },
    ];
  
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
  
          <div className="mb-14 text-center">
  
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
              Compare Universities
            </span>
  
            <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
              Compare Top Distance MBA Universities
            </h2>
  
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
              Compare fees, NAAC grades, placement support
              and EMI options before choosing your MBA university.
            </p>
  
          </div>
  
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-3xl border shadow-lg lg:block">
  
            <table className="w-full">
  
              <thead className="bg-[#0B3B68] text-white">
  
                <tr>
  
                  <th className="p-5 text-left">
                    University
                  </th>
  
                  <th className="p-5 text-center">
                    Fees
                  </th>
  
                  <th className="p-5 text-center">
                    NAAC Grade
                  </th>
  
                  <th className="p-5 text-center">
                    Placement
                  </th>
  
                  <th className="p-5 text-center">
                    EMI
                  </th>
  
                  <th className="p-5 text-center">
                    Action
                  </th>
  
                </tr>
  
              </thead>
  
              <tbody>
  
                {universities.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b hover:bg-slate-50"
                  >
  
                    <td className="p-5 font-semibold">
                      {item.name}
                    </td>
  
                    <td className="p-5 text-center">
                      {item.fees}
                    </td>
  
                    <td className="p-5 text-center">
                      {item.grade}
                    </td>
  
                    <td className="p-5 text-center text-green-600 font-semibold">
                      {item.placement}
                    </td>
  
                    <td className="p-5 text-center">
                      {item.emi}
                    </td>
  
                    <td className="p-5 text-center">
  
                      <button className="cursor-pointer rounded-xl bg-[#F47C45] px-5 py-2 text-white transition hover:opacity-90">
                        Apply Now
                      </button>
  
                    </td>
  
                  </tr>
                ))}
  
              </tbody>
  
            </table>
  
          </div>
  
          {/* Mobile Cards */}
          <div className="grid gap-5 lg:hidden">
  
            {universities.map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
  
                <h3 className="text-xl font-bold">
                  {item.name}
                </h3>
  
                <div className="mt-4 space-y-3">
  
                  <div className="flex justify-between">
                    <span>Fees</span>
                    <span className="font-semibold">
                      {item.fees}
                    </span>
                  </div>
  
                  <div className="flex justify-between">
                    <span>NAAC Grade</span>
                    <span className="font-semibold">
                      {item.grade}
                    </span>
                  </div>
  
                  <div className="flex justify-between">
                    <span>Placement</span>
                    <span className="font-semibold text-green-600">
                      {item.placement}
                    </span>
                  </div>
  
                  <div className="flex justify-between">
                    <span>EMI</span>
                    <span className="font-semibold">
                      {item.emi}
                    </span>
                  </div>
  
                </div>
  
                <button className="mt-5 w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 text-white">
                  Apply Now
                </button>
  
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }