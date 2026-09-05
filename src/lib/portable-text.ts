/**
 * Converts between HTML (what the Tiptap editor works with) and the
 * Portable-Text-shaped JSON block array this project's frontend already
 * knows how to render (`src/components/blog/portable-text-content.tsx`,
 * powered by `@portabletext/react`). Only the subset of Portable Text that
 * renderer actually handles is supported here: block styles
 * normal/h2-h6/blockquote, bullet/number lists, strong/em marks, `link`
 * annotations, inline `image` blocks, and `tableBlock`. Keeping the stored
 * shape identical to what Sanity produced means the renderer component
 * never needs to change.
 */

type PTSpan = { _type: "span"; _key: string; text: string; marks: string[] };
type PTMarkDef = { _type: "link"; _key: string; href: string; openInNewTab?: boolean };
type PTBlock = {
  _type: "block";
  _key: string;
  style: string;
  listItem?: "bullet" | "number";
  level?: number;
  children: PTSpan[];
  markDefs: PTMarkDef[];
};
type PTImage = { _type: "image"; _key: string; alt: string; asset: { _ref?: string; url?: string } };
type PTTableRow = { _type: "tableRow"; _key: string; cells: string[] };
type PTTableBlock = { _type: "tableBlock"; _key: string; hasHeaderRow: boolean; rows: PTTableRow[] };
export type PortableTextJson = (PTBlock | PTImage | PTTableBlock)[];

let keyCounter = 0;
function nextKey(): string {
  keyCounter += 1;
  return `k${Date.now().toString(36)}${keyCounter}`;
}

const STYLE_TAGS: Record<string, string> = {
  normal: "p",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  blockquote: "blockquote",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Portable Text JSON -> HTML string, for loading into the Tiptap editor. */
export function portableTextToHtml(blocks: PortableTextJson): string {
  const html: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block._type === "image") {
      const src = block.asset.url ?? "";
      html.push(`<img src="${escapeHtml(src)}" alt="${escapeHtml(block.alt)}" />`);
      i += 1;
      continue;
    }

    if (block._type === "tableBlock") {
      const rows = block.rows
        .map((row, rowIndex) => {
          const isHeader = block.hasHeaderRow && rowIndex === 0;
          const cellTag = isHeader ? "th" : "td";
          const cells = row.cells.map((c) => `<${cellTag}>${escapeHtml(c)}</${cellTag}>`).join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      html.push(`<table><tbody>${rows}</tbody></table>`);
      i += 1;
      continue;
    }

    // Consecutive list-item blocks of the same listItem type become one <ul>/<ol>.
    if (block.listItem) {
      const tag = block.listItem === "number" ? "ol" : "ul";
      const items: string[] = [];
      while (i < blocks.length) {
        const b = blocks[i];
        if (b._type !== "block" || b.listItem !== block.listItem) break;
        items.push(`<li>${renderSpans(b)}</li>`);
        i += 1;
      }
      html.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    const tag = STYLE_TAGS[block.style] ?? "p";
    html.push(`<${tag}>${renderSpans(block)}</${tag}>`);
    i += 1;
  }

  return html.join("");
}

function renderSpans(block: PTBlock): string {
  return block.children
    .map((span) => {
      let text = escapeHtml(span.text);
      const linkMark = span.marks.find((m) => block.markDefs.some((d) => d._key === m));
      const markDef = linkMark ? block.markDefs.find((d) => d._key === linkMark) : undefined;

      if (span.marks.includes("strong")) text = `<strong>${text}</strong>`;
      if (span.marks.includes("em")) text = `<em>${text}</em>`;
      if (markDef) {
        const target = markDef.openInNewTab === false ? "" : ' target="_blank" rel="noopener noreferrer"';
        text = `<a href="${escapeHtml(markDef.href)}"${target}>${text}</a>`;
      }
      return text;
    })
    .join("");
}

/** HTML string (from Tiptap's `editor.getHTML()`) -> Portable Text JSON, for saving. */
export function htmlToPortableText(html: string): PortableTextJson {
  if (typeof window === "undefined") {
    throw new Error("htmlToPortableText must run in a browser environment (uses DOMParser).");
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: PortableTextJson = [];

  function parseInline(node: ChildNode, marks: string[], markDefs: PTMarkDef[]): PTSpan[] {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text) return [];
      return [{ _type: "span", _key: nextKey(), text, marks: [...marks] }];
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "strong" || tag === "b") {
      return Array.from(el.childNodes).flatMap((c) => parseInline(c, [...marks, "strong"], markDefs));
    }
    if (tag === "em" || tag === "i") {
      return Array.from(el.childNodes).flatMap((c) => parseInline(c, [...marks, "em"], markDefs));
    }
    if (tag === "a") {
      const key = nextKey();
      markDefs.push({
        _type: "link",
        _key: key,
        href: el.getAttribute("href") ?? "",
        openInNewTab: el.getAttribute("target") === "_blank",
      });
      return Array.from(el.childNodes).flatMap((c) => parseInline(c, [...marks, key], markDefs));
    }
    if (tag === "br") return [{ _type: "span", _key: nextKey(), text: "\n", marks: [] }];
    return Array.from(el.childNodes).flatMap((c) => parseInline(c, marks, markDefs));
  }

  function textBlock(el: HTMLElement, style: string, listItem?: "bullet" | "number"): PTBlock {
    const markDefs: PTMarkDef[] = [];
    const children = Array.from(el.childNodes).flatMap((c) => parseInline(c, [], markDefs));
    return {
      _type: "block",
      _key: nextKey(),
      style,
      ...(listItem ? { listItem, level: 1 } : {}),
      children: children.length > 0 ? children : [{ _type: "span", _key: nextKey(), text: "", marks: [] }],
      markDefs,
    };
  }

  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "img") {
      blocks.push({
        _type: "image",
        _key: nextKey(),
        alt: el.getAttribute("alt") ?? "",
        asset: { url: el.getAttribute("src") ?? "" },
      });
      continue;
    }

    if (tag === "table") {
      const rows = Array.from(el.querySelectorAll("tr")).map((tr) => ({
        _type: "tableRow" as const,
        _key: nextKey(),
        cells: Array.from(tr.querySelectorAll("th,td")).map((cell) => cell.textContent ?? ""),
      }));
      const hasHeaderRow = el.querySelector("th") !== null;
      blocks.push({ _type: "tableBlock", _key: nextKey(), hasHeaderRow, rows });
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const listItem = tag === "ol" ? "number" : "bullet";
      for (const li of Array.from(el.children)) {
        blocks.push(textBlock(li as HTMLElement, "normal", listItem));
      }
      continue;
    }

    if (STYLE_TAGS[tag] || Object.values(STYLE_TAGS).includes(tag)) {
      const style = Object.entries(STYLE_TAGS).find(([, t]) => t === tag)?.[0] ?? "normal";
      blocks.push(textBlock(el, style));
      continue;
    }

    // Any other block-level element (div, section, etc.) - treat as a normal paragraph.
    if (el.textContent?.trim()) blocks.push(textBlock(el, "normal"));
  }

  return blocks;
}
