"use client";

import { useState } from "react";
import type { Segment, VoiceType, MoodType, TenseType, PersonLabel, NumberLabel, GenderType } from "@/lib/corpus-types";
import BreakView from "@/components/BreakView";
import CourseAltitudeNote from "@/components/CourseAltitudeNote";

// ─── Prop types ───────────────────────────────────────────────────────────────

export interface VerbParse {
  person: PersonLabel;
  number: NumberLabel;
  tense: TenseType;
  voice: VoiceType;
  mood: MoodType;
}

export interface NounParse {
  case: "nom" | "acc" | "dat" | "gen";
  number: NumberLabel;
  gender?: GenderType;
}

interface VerbProps {
  form: string;
  gloss: string;
  type: "verb";
  correctParse: VerbParse;
  segments: Segment[];
  aboveAltitude?: boolean;
}

interface NounProps {
  form: string;
  gloss: string;
  type: "noun";
  correctParse: NounParse;
  segments: Segment[];
  aboveAltitude?: boolean;
}

type Props = VerbProps | NounProps;

// ─── Option sets ──────────────────────────────────────────────────────────────

const PERSONS: PersonLabel[] = ["1st", "2nd", "3rd"];
const NUMBERS: NumberLabel[] = ["sg", "pl"];
const TENSES: TenseType[] = ["present", "future", "aorist", "perfect", "imperfect"];
const VOICES: VoiceType[] = ["active", "middle", "passive"];
const MOODS: MoodType[] = ["indicative", "subjunctive", "optative", "imperative", "infinitive", "participle"];
const CASES = ["nom", "acc", "dat", "gen"] as const;
const GENDERS: GenderType[] = ["masculine", "feminine", "neuter"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Selector<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
  correct,
}: {
  label: string;
  options: T[];
  value: T | "";
  onChange: (v: T) => void;
  disabled: boolean;
  correct?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = value === opt;
          let cls =
            "px-2.5 py-1 rounded border text-sm font-medium transition-colors ";
          if (disabled && selected) {
            cls += correct
              ? "bg-emerald-100 text-emerald-800 border-emerald-400"
              : "bg-red-100 text-red-800 border-red-400";
          } else if (selected) {
            cls += "bg-blue-600 text-white border-blue-600";
          } else {
            cls += disabled
              ? "border-slate-200 text-slate-400 cursor-default"
              : "border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer";
          }
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={cls}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ParseTrainer(props: Props) {
  const { form, gloss, type, correctParse, segments, aboveAltitude } = props;

  // Verb state
  const [person, setPerson] = useState<PersonLabel | "">("");
  const [number, setNumber] = useState<NumberLabel | "">("");
  const [tense, setTense] = useState<TenseType | "">("");
  const [voice, setVoice] = useState<VoiceType | "">("");
  const [mood, setMood] = useState<MoodType | "">("");

  // Noun state
  const [nCase, setNCase] = useState<"nom" | "acc" | "dat" | "gen" | "">("");
  const [nNumber, setNNumber] = useState<NumberLabel | "">("");
  const [nGender, setNGender] = useState<GenderType | "">("");

  const [submitted, setSubmitted] = useState(false);

  const isVerbFilled = type === "verb"
    ? Boolean(person && number && tense && voice && mood)
    : true;
  const isNounFilled = type === "noun"
    ? Boolean(nCase && nNumber && (correctParse.gender === undefined || nGender))
    : true;
  const canSubmit = !submitted && (type === "verb" ? isVerbFilled : isNounFilled);

  function handleSubmit() {
    setSubmitted(true);
  }

  function handleReset() {
    setPerson(""); setNumber(""); setTense(""); setVoice(""); setMood("");
    setNCase(""); setNNumber(""); setNGender("");
    setSubmitted(false);
  }

  // Per-property correctness (only relevant after submit)
  const verbResult = type === "verb" && submitted
    ? {
        person: person === (correctParse as VerbParse).person,
        number: number === (correctParse as VerbParse).number,
        tense: tense === (correctParse as VerbParse).tense,
        voice: voice === (correctParse as VerbParse).voice,
        mood: mood === (correctParse as VerbParse).mood,
      }
    : null;

  const nounResult = type === "noun" && submitted
    ? {
        case: nCase === (correctParse as NounParse).case,
        number: nNumber === (correctParse as NounParse).number,
        gender: (correctParse as NounParse).gender === undefined
          ? true
          : nGender === (correctParse as NounParse).gender,
      }
    : null;

  const allCorrect = verbResult
    ? Object.values(verbResult).every(Boolean)
    : nounResult
    ? Object.values(nounResult).every(Boolean)
    : false;

  const cp = correctParse as VerbParse & NounParse;

  return (
    <div className="rounded-xl border border-slate-200 p-5 space-y-5">
      {/* Form display */}
      <div>
        <div className="greek text-3xl font-bold text-slate-900">{form}</div>
        <div className="text-sm text-slate-500 mt-0.5 italic">{gloss}</div>
      </div>

      {/* Selectors */}
      {type === "verb" ? (
        <div className="space-y-4">
          <Selector label="Person" options={PERSONS} value={person} onChange={setPerson} disabled={submitted} correct={verbResult?.person} />
          <Selector label="Number" options={NUMBERS} value={number} onChange={setNumber} disabled={submitted} correct={verbResult?.number} />
          <Selector label="Tense" options={TENSES} value={tense} onChange={setTense} disabled={submitted} correct={verbResult?.tense} />
          <Selector label="Voice" options={VOICES} value={voice} onChange={setVoice} disabled={submitted} correct={verbResult?.voice} />
          <Selector label="Mood" options={MOODS} value={mood} onChange={setMood} disabled={submitted} correct={verbResult?.mood} />
        </div>
      ) : (
        <div className="space-y-4">
          <Selector label="Case" options={[...CASES]} value={nCase} onChange={setNCase} disabled={submitted} correct={nounResult?.case} />
          <Selector label="Number" options={NUMBERS} value={nNumber} onChange={setNNumber} disabled={submitted} correct={nounResult?.number} />
          {cp.gender !== undefined && (
            <Selector label="Gender" options={GENDERS} value={nGender} onChange={setNGender} disabled={submitted} correct={nounResult?.gender} />
          )}
        </div>
      )}

      {/* Submit / feedback */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check
        </button>
      ) : (
        <div className="space-y-4">
          {/* Score banner */}
          <div className={`rounded-lg px-4 py-3 text-sm font-medium ${allCorrect ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
            {allCorrect ? "Correct!" : "Review the highlighted slots below."}
          </div>

          {/* Correct parse */}
          <div className="text-sm space-y-1">
            <div className="font-medium text-slate-700">Correct parse:</div>
            {type === "verb" ? (
              <div className="text-slate-600">
                {cp.person} person · {cp.number} · {cp.tense} · {cp.voice} · {cp.mood}
              </div>
            ) : (
              <div className="text-slate-600">
                {cp.case} · {cp.number}{cp.gender ? ` · ${cp.gender}` : ""}
              </div>
            )}
          </div>

          {/* Morpheme breakdown */}
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Morpheme breakdown:</div>
            <BreakView form={form} segments={segments} />
          </div>

          {aboveAltitude && <CourseAltitudeNote form={form} />}

          <button
            onClick={handleReset}
            className="w-full py-2 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
