"use client";

import { useState } from "react";
import type { GlossaryEntry } from "@/lib/corpus-types";

interface Props {
  entries: GlossaryEntry[];
}

export default function DefinitionsDrill({ entries }: Props) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<"term→def" | "def→term">("term→def");

  const entry = entries[idx];

  function next() {
    setRevealed(false);
    setIdx((i) => (i + 1) % entries.length);
  }

  function prev() {
    setRevealed(false);
    setIdx((i) => (i - 1 + entries.length) % entries.length);
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2 text-sm">
        {(["term→def", "def→term"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setRevealed(false); setIdx(0); }}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
              mode === m
                ? "bg-blue-600 text-white border-blue-600"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {m === "term→def" ? "Term → Definition" : "Definition → Term"}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-xl border border-slate-200 p-6 min-h-[160px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-xs text-slate-400 uppercase tracking-wide">{entry.category}</div>
          {mode === "term→def" ? (
            <>
              <div className="text-xl font-semibold text-slate-800">{entry.term}</div>
              {revealed ? (
                <div className="text-slate-600 text-sm leading-relaxed">{entry.definition}</div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Show definition
                </button>
              )}
            </>
          ) : (
            <>
              <div className="text-sm text-slate-600 leading-relaxed">{entry.definition}</div>
              {revealed ? (
                <div className="text-xl font-semibold text-slate-800">{entry.term}</div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Show term
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          className="px-3 py-1.5 rounded border border-slate-300 text-slate-600 text-sm hover:bg-slate-50"
        >
          ← Prev
        </button>
        <span className="text-xs text-slate-400">
          {idx + 1} / {entries.length}
        </span>
        <button
          onClick={next}
          className="px-3 py-1.5 rounded border border-slate-300 text-slate-600 text-sm hover:bg-slate-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
