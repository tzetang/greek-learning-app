"use client";

import { useState } from "react";
import type { FiveTenseForm } from "@/lib/corpus-types";
import { ZONE_STYLES } from "@/lib/zones";
import CourseAltitudeNote from "@/components/CourseAltitudeNote";

interface Props {
  forms: FiveTenseForm[];
}

const TENSE_ORDER = ["present", "future", "aorist", "perfect", "imperfect"] as const;

export default function FiveTenseStepper({ forms }: Props) {
  const ordered = TENSE_ORDER.map((t) => forms.find((f) => f.tense === t)).filter(Boolean) as FiveTenseForm[];
  const [idx, setIdx] = useState(0);
  const current = ordered[idx];
  const prev = idx > 0 ? ordered[idx - 1] : null;

  // Which zones changed compared to the previous tense
  const prevZones = new Set(prev?.segments.map((s) => s.zone) ?? []);
  const currZones = new Set(current.segments.map((s) => s.zone));
  const addedZones = new Set([...currZones].filter((z) => !prevZones.has(z)));

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4">
      {/* Tense navigation */}
      <div className="flex flex-wrap gap-2">
        {ordered.map((f, i) => (
          <button
            key={f.tense}
            onClick={() => setIdx(i)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors capitalize ${
              i === idx
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.tense}
          </button>
        ))}
      </div>

      {/* Form */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="greek text-3xl font-bold text-slate-900">{current.form}</span>
          <span className="text-slate-500 text-sm italic">{current.gloss}</span>
          {idx > 0 && addedZones.size > 0 && (
            <span className="text-xs text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
              New zones: {[...addedZones].join(", ")}
            </span>
          )}
        </div>

        {/* Color-coded segments */}
        <div className="flex flex-wrap gap-0.5 items-baseline mb-3">
          {current.segments.map((seg, i) => {
            const style = ZONE_STYLES[seg.zone];
            const isNew = addedZones.has(seg.zone) && idx > 0;
            return (
              <span
                key={i}
                title={`${style.label}: ${seg.signal}`}
                className={`greek text-2xl font-bold px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border} ${isNew ? "ring-2 ring-purple-400" : ""}`}
              >
                {seg.text}
              </span>
            );
          })}
        </div>

        {/* Zone key */}
        <ul className="text-xs space-y-1">
          {current.segments.map((seg, i) => {
            const style = ZONE_STYLES[seg.zone];
            return (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-0.5 inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: style.dot }}
                />
                <span>
                  <span className={`font-semibold ${style.text} greek`}>{seg.text}</span>
                  {" — "}
                  <span className="text-slate-600">{seg.signal}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {current.aboveAltitude && <CourseAltitudeNote form={current.form} />}

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 text-xs">
        {Object.entries(ZONE_STYLES).map(([zone, style]) => (
          <div key={zone} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm border"
              style={{ backgroundColor: style.dot, borderColor: style.dot }}
            />
            <span className="text-slate-500">{style.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
