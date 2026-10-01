import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Container from "@/components/common/container";
import type { SiteInfo } from "@/lib/site-settings";

/** Contact details from Global Settings > General (same source as the footer and Organization schema). */
export default function ContactInfo({ info }: { info: SiteInfo }) {
  const tel = info.phone.replace(/[^+\d]/g, "");
  const whatsapp = info.whatsapp?.replace(/[^\d]/g, "");
  const cards = [
    { icon: Mail, title: "Email us", body: <a href={`mailto:${info.email}`} className="hover:underline">{info.email}</a> },
    { icon: Phone, title: "Call us", body: <a href={`tel:${tel}`} className="hover:underline">{info.phone}</a> },
    ...(whatsapp
      ? [{ icon: MessageCircle, title: "WhatsApp", body: <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{info.whatsapp}</a> }]
      : []),
    { icon: Clock3, title: "Working hours", body: <span>{info.footer_hours}</span> },
    ...(info.address ? [{ icon: MapPin, title: "Office", body: <address className="not-italic">{info.address}</address> }] : []),
  ];

  return (
    <section aria-labelledby="contact-details-heading" className="bg-white py-12 md:py-16">
      <Container>
        <h2 id="contact-details-heading" className="sr-only">
          Contact details
        </h2>
        <div className={`grid gap-6 md:grid-cols-2 ${cards.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {cards.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border p-6 text-center md:p-8">
              <Icon className="mx-auto text-[#C2410C]" size={32} aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <div className="mt-2 break-words text-slate-700">{body}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
