import type { ElementType, ReactNode } from "react";

type Props = {
  content: string;
};

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "paragraph"; text: string };

/** Converts the inline HTML tags found in this dataset's embedded tables to their Markdown equivalents. */
function htmlInlineToMarkdown(html: string): string {
  return html
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<br\s*\/?>/gi, " ")
    .trim();
}

/** Parses a raw `<table>...</table>` HTML block into a plain rows/cells structure. */
function parseHtmlTable(html: string): string[][] {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  return rows.map((rowMatch) =>
    [...rowMatch[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cellMatch) =>
      htmlInlineToMarkdown(cellMatch[1])
    )
  );
}

/** Parses a Markdown pipe-table (`| a | b |` rows with a `|---|---|` separator). */
function parseMarkdownTable(lines: string[]): string[][] {
  const toCells = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  return lines
    .filter((line) => !/^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line.trim()))
    .map(toCells);
}

const HEADING_CLASSES: Record<number, string> = {
  1: "mt-14 text-4xl font-bold text-slate-900",
  2: "mt-14 text-3xl font-bold text-slate-900",
  3: "mt-10 text-2xl font-bold text-slate-900",
  4: "mt-10 text-2xl font-bold text-slate-900",
  5: "mt-8 text-xl font-semibold text-slate-900",
  6: "mt-6 text-lg font-semibold text-slate-900",
};

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraphLines: string[] = [];
  let listItems: string[] | null = null;
  let listOrdered = false;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems && listItems.length > 0) {
      blocks.push({ type: "list", ordered: listOrdered, items: listItems });
    }
    listItems = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.*)$/);
    const htmlTableStart = /^<table[\s>]/i.test(line);
    const isPipeRow = /^\|.*\|$/.test(line);

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (htmlTableStart) {
      flushParagraph();
      flushList();
      const tableLines = [line];
      while (i < lines.length && !/<\/table>/i.test(lines[i])) {
        i++;
        if (i < lines.length) tableLines.push(lines[i]);
      }
      blocks.push({ type: "table", rows: parseHtmlTable(tableLines.join("\n")) });
      continue;
    }

    if (isPipeRow) {
      flushParagraph();
      flushList();
      const tableLines = [line];
      while (i + 1 < lines.length && /^\|.*\|$/.test(lines[i + 1].trim())) {
        i++;
        tableLines.push(lines[i].trim());
      }
      blocks.push({ type: "table", rows: parseMarkdownTable(tableLines) });
      continue;
    }

    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: headingMatch[1].length, text: headingMatch[2].trim() });
      continue;
    }

    if (bulletMatch || numberedMatch) {
      flushParagraph();
      const isOrdered = Boolean(numberedMatch);
      if (!listItems || listOrdered !== isOrdered) {
        flushList();
        listItems = [];
        listOrdered = isOrdered;
      }
      listItems.push((bulletMatch ?? numberedMatch)![1].trim());
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/**
 * Renders **bold**, *italic* and [label](url) inline markdown, including
 * bold text nested inside a link label. Links are rendered as plain anchors
 * (not next/link) since source URLs are absolute and not all resolve to a
 * route in the current site - see blog integration report.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/;
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const match = pattern.exec(remaining);
    if (!match) {
      nodes.push(remaining);
      break;
    }

    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index));
    }

    const nodeKey = `${keyPrefix}-${key++}`;

    if (match[1] !== undefined) {
      nodes.push(
        <a
          key={nodeKey}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0B3B68] underline underline-offset-2 hover:text-[#F47C45]"
        >
          {renderInline(match[1], nodeKey)}
        </a>
      );
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={nodeKey}>{renderInline(match[3], nodeKey)}</strong>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={nodeKey}>{renderInline(match[4], nodeKey)}</em>);
    }

    remaining = remaining.slice(match.index + match[0].length);
  }

  return nodes;
}

export default function BlogContent({ content }: Props) {
  const blocks = parseBlocks(content);

  return (
    <div>
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === "heading") {
          const Tag = `h${Math.min(Math.max(block.level, 1), 6)}` as ElementType;
          return (
            <Tag key={key} className={HEADING_CLASSES[block.level] ?? HEADING_CLASSES[6]}>
              {renderInline(block.text, key)}
            </Tag>
          );
        }

        if (block.type === "list") {
          const items = block.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
          ));

          return block.ordered ? (
            <ol key={key} className="mt-5 list-decimal space-y-2 pl-6 leading-8 text-slate-700">
              {items}
            </ol>
          ) : (
            <ul key={key} className="mt-5 list-disc space-y-2 pl-6 leading-8 text-slate-700">
              {items}
            </ul>
          );
        }

        if (block.type === "table") {
          const [headerRow, ...bodyRows] = block.rows;
          return (
            <div key={key} className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left">
                <tbody>
                  {headerRow && (
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {headerRow.map((cell, cellIndex) => (
                        <td key={`${key}-h-${cellIndex}`} className="p-4 font-semibold text-slate-900">
                          {renderInline(cell, `${key}-h-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  )}
                  {bodyRows.map((row, rowIndex) => (
                    <tr
                      key={`${key}-r-${rowIndex}`}
                      className={rowIndex !== bodyRows.length - 1 ? "border-b border-slate-200" : undefined}
                    >
                      {row.map((cell, cellIndex) => (
                        <td key={`${key}-r-${rowIndex}-${cellIndex}`} className="p-4 text-slate-700">
                          {renderInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={key} className="mt-5 leading-8 text-slate-700">
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
}
