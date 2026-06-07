"use client";

import { useState } from "react";
import type { VerbParadigm } from "@/lib/corpus-types";
import { ZONE_STYLES } from "@/lib/zones";
import type { Zone } from "@/lib/corpus-types";

interface Props {
  paradigm: VerbParadigm;
}

export default function BuildStepper({ paradigm }: Props) {
  const tenseKeys = Object.keys(paradigm.tenses);
  const [tenseIdx, setTenseIdx] = useState(0);
  const [person, setPerson] = useState<string>("3sg");

  const tense = tenseKeys[tenseIdx];
  const persons = Object.keys(paradigm.tenses[tense]);
  const currentPerson = persons.includes(person) ? person : persons[0];
  const cell = paradigm.tenses[tense][currentPerson as keyof typeof paradigm.tenses[typeof tense]];

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap gap-2 text-sm">
        {tenseKeys.map((t, i) => (
          <button
            key={t}
            onClick={() => setTenseIdx(i)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              i === tenseIdx
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Person selector */}
      <div className="flex flex-wrap gap-1.5 text-sm">
        {persons.map((p) => (
          <button
            key={p}
            onClick={() => setPerson(p)}
            className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
              p === currentPerson
                ? "bg-slate-800 text-white border-slate-800"
                : "border-slate-300 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Segmented form */}
      {cell && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-0.5 items-baseline">
            {cell.segments.map((seg, i) => {
              const style = ZONE_STYLES[seg.zone as Zone];
              return (
                <span
                  key={i}
                  title={`${style.label}: ${seg.signal}`}
                  className={`greek text-2xl font-bold px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                >
                  {seg.text}
                </span>
              );
            })}
          </div>

          {/* Zone key */}
          <div className="flex flex-wrap gap-3 text-xs">
            {cell.segments.map((seg, i) => {
              const style = ZONE_STYLES[seg.zone as Zone];
              return (
                <span key={i} className="flex items-center gap-1">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: style.dot }}
                  />
                  <span className="text-slate-500">{seg.signal}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

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
