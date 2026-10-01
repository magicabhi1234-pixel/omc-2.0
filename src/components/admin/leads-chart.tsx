"use client";

import { useEffect, useRef, useState } from "react";

export interface DayCount {
  date: string; // yyyy-mm-dd (IST)
  label: string; // "18 Sep"
  count: number;
}

const HEIGHT = 180;
const PAD = { top: 12, right: 8, bottom: 26, left: 28 };

/** "Nice" axis max + 3 ticks so gridlines land on round numbers. */
function niceMax(max: number) {
  if (max <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((v) => v * 4 >= max) ?? step * 10;
  return nice * 4;
}

/**
 * Leads per day - single series, so no legend (the panel title names it).
 * Bars: brand chart-1, <=24px, 4px rounded top, square baseline, 2px gaps.
 * Hover/focus a day for its exact count; a table view is always available.
 */
export default function LeadsChart({ data }: { data: DayCount[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [width, setWidth] = useState(640);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const max = niceMax(Math.max(0, ...data.map((d) => d.count)));
  const innerW = Math.max(100, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const band = innerW / data.length;
  const barW = Math.min(24, Math.max(4, band - 2));
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  const total = data.reduce((n, d) => n + d.count, 0);

  return (
    <div>
      <div
        className="relative"
        ref={boxRef}
      >
        <svg width="100%" height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} role="img" aria-label={`Leads per day, last ${data.length} days: ${total} total`} className="overflow-visible">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">
                {Number.isInteger(t) ? t : ""}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * band + (band - barW) / 2;
            const h = Math.max(0, y(0) - y(d.count));
            const r = Math.min(4, h, barW / 2);
            const top = y(0) - h;
            return (
              <g
                key={d.date}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${d.label}: ${d.count} lead${d.count === 1 ? "" : "s"}`}
                className="outline-none"
              >
                {/* Hit target: the full band height, wider than the bar. */}
                <rect x={PAD.left + i * band} y={PAD.top} width={band} height={innerH} fill="transparent" />
                {h > 0 && (
                  <path
                    d={`M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${y(0)} Z`}
                    fill="var(--chart-1)"
                    opacity={active === null || active === i ? 1 : 0.45}
                  />
                )}
                {(i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 7) === 0) && (
                  <text x={PAD.left + i * band + band / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {active !== null && data[active] && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg"
            style={{ left: PAD.left + active * band + band / 2, top: Math.max(8, y(data[active].count) - 8) }}
            role="status"
          >
            <p className="font-medium text-foreground">{data[active].label}</p>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">{data[active].count}</span> lead{data[active].count === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">View as table</summary>
        <table className="mt-2 w-full text-left text-xs">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1 font-medium">Day</th>
              <th className="py-1 text-right font-medium">Leads</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date} className="border-t border-border/60">
                <td className="py-1">{d.label}</td>
                <td className="py-1 text-right tabular-nums">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
