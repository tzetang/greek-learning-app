"use client";

import Link from "next/link";
import type { Segment } from "@/lib/corpus-types";
import { ZONE_STYLES } from "@/lib/zones";

interface Props {
  form: string;
  segments: Segment[];
  lemma?: string;
  lexemeHref?: string; // link to the Learn page for this word's topic
}

export default function BreakView({ form, segments, lemma, lexemeHref }: Props) {
  return (
    <div className="space-y-3">
      {/* Colour-coded segmented form */}
      <div className="flex flex-wrap gap-0.5 items-baseline">
        {segments.map((seg, i) => {
          const style = ZONE_STYLES[seg.zone];
          return (
            <span
              key={i}
              title={`${style.label}: ${seg.signal}`}
              className={`greek text-xl font-semibold px-1 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
            >
              {seg.text}
            </span>
          );
        })}
      </div>

      {/* Signal legend */}
      <ul className="text-xs space-y-1">
        {segments.map((seg, i) => {
          const style = ZONE_STYLES[seg.zone];
          return (
            <li key={i} className="flex items-start gap-2">
              <span
                className={`mt-0.5 inline-block w-2.5 h-2.5 rounded-full flex-shrink-0`}
                style={{ backgroundColor: style.dot }}
              />
              <span>
                <span className={`font-semibold ${style.text} greek`}>{seg.text}</span>
                {" — "}
                <span className="text-slate-600">{seg.signal}</span>
                {seg.note && (
                  <span className="text-slate-400"> · {seg.note}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Stem → lexeme link */}
      {lemma && (
        <div className="text-xs text-slate-500">
          Lexeme:{" "}
          {lexemeHref ? (
            <Link href={lexemeHref} className="greek text-blue-600 underline">
              {lemma}
            </Link>
          ) : (
            <span className="greek">{lemma}</span>
          )}
        </div>
      )}
    </div>
  );
}
