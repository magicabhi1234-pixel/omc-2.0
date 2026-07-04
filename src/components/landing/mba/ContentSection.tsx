import { PortableText } from "@portabletext/react";

type Props = {
  heading?: string;
  description?: any;
};

export default function ContentSection({
  heading,
  description,
}: Props) {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-5xl">
        {heading && (
          <h2 className="mb-8 text-4xl font-bold">
            {heading}
          </h2>
        )}

        {description && (
          <div className="prose max-w-none text-slate-600">
            <PortableText value={description} />
          </div>
        )}
      </div>
    </section>
  );
}