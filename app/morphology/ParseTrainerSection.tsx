"use client";

import { useState } from "react";
import ParseTrainer, { type VerbParse, type NounParse } from "@/components/ParseTrainer";
import type { Segment } from "@/lib/corpus-types";

interface TrainerItem {
  form: string;
  gloss: string;
  type: "verb" | "noun";
  correctParse: VerbParse | NounParse;
  segments: Segment[];
  aboveAltitude?: boolean;
}

interface Props {
  items: TrainerItem[];
}

export default function ParseTrainerSection({ items }: Props) {
  const [idx, setIdx] = useState(0);

  return (
    <div className="space-y-4">
      {/* Form selector */}
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`greek px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              i === idx
                ? "bg-slate-800 text-white border-slate-800"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item.form}
          </button>
        ))}
      </div>

      {/* Trainer — key on idx to reset state on switch */}
      <ParseTrainer key={idx} {...items[idx] as Parameters<typeof ParseTrainer>[0]} />
    </div>
  );
}
