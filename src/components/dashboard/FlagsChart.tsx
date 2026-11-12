"use client";

import { useState } from "react";
import type { DailyCount } from "@/lib/domain/types";
import { formatShortDate } from "@/lib/format";

const W = 520;
const H = 240;
const PAD = { top: 16, right: 8, bottom: 28, left: 32 };
const GAP = 6;
const RADIUS = 4;

/** Bar with rounded top corners only, anchored flat to the baseline. */
function barPath(x: number, y: number, w: number, h: number): string {
  const r = Math.min(RADIUS, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

function niceMax(max: number): number {
  // Even maximum keeps the midpoint gridline on a whole number.
  if (max <= 4) return 4;
  return Math.ceil(max / 4) * 4;
}

export function FlagsChart({ data }: { data: readonly DailyCount[] }) {
  const [hover, setHover] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="text-sm text-muted">No flagged accounts in this period.</p>;
  }

  const yMax = niceMax(Math.max(...data.map((d) => d.count)));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / data.length;
  const barW = slot - GAP;
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;
  const ticks = [0, yMax / 2, yMax];
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const hovered = hover === null ? null : data[hover];

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Bar chart of accounts flagged per day, ${formatShortDate(data[0].date)} to ${formatShortDate(data[data.length - 1].date)}. ${total} in total. A table version follows.`}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={13}
                fill="var(--text-muted)"
              >
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + i * slot + GAP / 2;
            const top = y(d.count);
            const active = hover === i;
            return (
              <g key={d.date}>
                {d.count > 0 && (
                  <path
                    d={barPath(x, top, barW, PAD.top + plotH - top)}
                    fill="var(--accent)"
                    opacity={hover === null || active ? 1 : 0.45}
                  />
                )}
                {/* Hit target covers the full column, bigger than the bar. */}
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
                {i % 3 === 0 && (
                  <text
                    x={x + barW / 2}
                    y={H - 8}
                    textAnchor="middle"
                    fontSize={13}
                    fill="var(--text-muted)"
                  >
                    {formatShortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {hovered && hover !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${((PAD.left + hover * slot + slot / 2) / W) * 100}%`,
              top: 0,
            }}
            aria-hidden="true"
          >
            <div className="text-muted">{formatShortDate(hovered.date)}</div>
            <div className="font-semibold tabular-nums">
              {hovered.count} flagged
            </div>
          </div>
        )}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted hover:text-text">
          Show as table
        </summary>
        <table className="mt-2 w-full max-w-sm text-left">
          <caption className="sr-only">Accounts flagged per day</caption>
          <thead>
            <tr className="text-muted">
              <th scope="col" className="py-1 font-medium">Date</th>
              <th scope="col" className="py-1 text-right font-medium">Flagged</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date} className="border-t border-border">
                <td className="py-1">{formatShortDate(d.date)}</td>
                <td className="py-1 text-right tabular-nums">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
