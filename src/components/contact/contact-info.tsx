import Container from "@/components/common/container";

export default function ContactInfo() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border p-8 text-center">
            <div className="text-4xl">📧</div>
            <h3 className="mt-4 text-xl font-semibold">
              Email Us
            </h3>
            <p className="mt-2 text-slate-600">
              info@onlinembacolleges.com
            </p>
          </div>

          <div className="rounded-3xl border p-8 text-center">
            <div className="text-4xl">📞</div>
            <h3 className="mt-4 text-xl font-semibold">
              Call Us
            </h3>
            <p className="mt-2 text-slate-600">
              +91 8421903846
            </p>
          </div>

          <div className="rounded-3xl border p-8 text-center">
            <div className="text-4xl">🕒</div>
            <h3 className="mt-4 text-xl font-semibold">
              Working Hours
            </h3>
            <p className="mt-2 text-slate-600">
              Mon - Sat | 9 AM - 7 PM
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}