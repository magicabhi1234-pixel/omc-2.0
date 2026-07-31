import Image from "next/image";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";

type Props = {
  content: PortableTextBlock[];
};

const HEADING_CLASSES: Record<string, string> = {
  h2: "mt-14 text-3xl font-bold text-slate-900",
  h3: "mt-10 text-2xl font-bold text-slate-900",
  h4: "mt-10 text-2xl font-bold text-slate-900",
  h5: "mt-8 text-xl font-semibold text-slate-900",
  h6: "mt-6 text-lg font-semibold text-slate-900",
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 leading-8 text-slate-700">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-[#F47C45] pl-5 italic text-slate-600">{children}</blockquote>
    ),
    h2: ({ children }) => <h2 className={HEADING_CLASSES.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={HEADING_CLASSES.h3}>{children}</h3>,
    h4: ({ children }) => <h4 className={HEADING_CLASSES.h4}>{children}</h4>,
    h5: ({ children }) => <h5 className={HEADING_CLASSES.h5}>{children}</h5>,
    h6: ({ children }) => <h6 className={HEADING_CLASSES.h6}>{children}</h6>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 leading-8 text-slate-700">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 leading-8 text-slate-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab === false ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="text-[#0B3B68] underline underline-offset-2 hover:text-[#F47C45]"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).url();
      if (!url) return null;
      return (
        <span className="relative mt-6 block h-80 w-full overflow-hidden rounded-2xl">
          <Image src={url} alt={value?.alt || ""} fill className="object-cover" />
        </span>
      );
    },
    tableBlock: ({ value }) => {
      const rows: { cells: string[] }[] = value?.rows ?? [];
      const [headerRow, ...bodyRows] = value?.hasHeaderRow ? rows : [undefined, ...rows];

      return (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left">
            <tbody>
              {headerRow && (
                <tr className="border-b border-slate-200 bg-slate-50">
                  {headerRow.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-4 font-semibold text-slate-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              )}
              {bodyRows.map(
                (row, rowIndex) =>
                  row && (
                    <tr
                      key={rowIndex}
                      className={rowIndex !== bodyRows.length - 1 ? "border-b border-slate-200" : undefined}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-4 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export default function PortableTextContent({ content }: Props) {
  return (
    <div>
      <PortableText value={content} components={components} />
    </div>
  );
}
