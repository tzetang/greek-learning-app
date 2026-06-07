"use client";

import { useState } from "react";
import Link from "next/link";
import { corpus } from "@/lib/corpus";
import BreakView from "./BreakView";
import type { VerseWord } from "@/lib/corpus-types";

const TOPIC_LABELS: Record<string, string> = {
  vocabulary: "Vocabulary",
  cases: "Cases & Declension",
  tenses: "Tenses",
  moods: "Moods",
  prepositions: "Prepositions",
  "writing-sound": "Writing & Sound",
  pronouns: "Pronouns",
  verbs: "Verbs (Present)",
};

export default function John316Reader() {
  const { words, greek } = corpus.john316;
  const [selected, setSelected] = useState<VerseWord | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">John 3:16</h1>
        <p className="text-xs text-slate-400 mt-0.5">Tap any word to decode it</p>
      </div>

      {/* Video */}
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
        <iframe
          src="https://www.youtube.com/embed/T0k7xqoHmbU"
          title="John 3:16 video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Verse display */}
      <div
        className="greek text-2xl leading-loose text-slate-900"
        aria-label="John 3:16 in Greek"
      >
        {words.map((word) => (
          <span key={word.index}>
            <button
              onClick={() => setSelected(selected?.index === word.index ? null : word)}
              data-selected={selected?.index === word.index}
              className={`greek-word rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                word.beyondCoreSets
                  ? "text-slate-500"
                  : "text-slate-900"
              } ${selected?.index === word.index ? "!bg-blue-100" : ""}`}
              aria-pressed={selected?.index === word.index}
            >
              {word.greek}
            </button>
            {" "}
          </span>
        ))}
      </div>

      {/* Decode panel */}
      {selected && (
        <div className="rounded-2xl border border-slate-200 p-4 space-y-4 bg-white shadow-sm">
          {/* Word header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="greek text-2xl font-bold text-slate-900">{selected.greek}</span>
              {selected.beyondCoreSets && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  beyond core sets
                </span>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Gloss + parse */}
          <div className="text-sm space-y-1">
            <div>
              <span className="text-slate-500">Gloss: </span>
              <span className="text-slate-800 font-medium">{selected.gloss}</span>
            </div>
            <div>
              <span className="text-slate-500">Parse: </span>
              <span className="text-slate-700">{selected.parse}</span>
            </div>
            <div>
              <span className="text-slate-500">Lexeme: </span>
              <span className="greek text-slate-700">{selected.lemma}</span>
            </div>
          </div>

          {/* Vocabulary set provenance */}
          {selected.setId !== null ? (
            <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              From vocabulary Set {selected.setId}
            </div>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Beyond the core vocabulary sets — shown here for context; not in vocab quizzes
            </div>
          )}

          {/* Morpheme zones (BREAK view) */}
          {selected.segments.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                Morpheme breakdown
              </p>
              <BreakView
                form={selected.greek}
                segments={selected.segments}
                lemma={selected.lemma}
              />
            </div>
          )}

          {/* Cross-links */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {selected.grammarTopic && (
              <Link
                href={`/topics/${selected.grammarTopic}`}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-colors"
              >
                Learn: {TOPIC_LABELS[selected.grammarTopic] ?? selected.grammarTopic} →
              </Link>
            )}
            <Link
              href={`/tutor?q=${encodeURIComponent(`Explain ${selected.greek} (${selected.lemma}) in John 3:16`)}`}
              className="text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors"
            >
              Ask the Tutor →
            </Link>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="text-xs text-slate-400 space-y-1">
        <p><span className="text-slate-900">Dark words</span> = in core vocabulary sets</p>
        <p><span className="text-slate-400">Light words</span> = beyond core sets (flagged)</p>
      </div>
    </div>
  );
}
