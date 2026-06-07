import type { Metadata } from "next";
import { getCorpus } from "@/lib/corpus";
import BreakView from "@/components/BreakView";
import BuildStepper from "@/components/BuildStepper";
import { ZONE_STYLES, ZONE_ORDER } from "@/lib/zones";
import FiveTenseStepper from "./FiveTenseStepper";
import DefinitionsDrill from "./DefinitionsDrill";
import ParseTrainerSection from "./ParseTrainerSection";
import NounTable from "./NounTable";
import type { VerbParadigm, VerbParadigmCell } from "@/lib/corpus-types";

export const metadata: Metadata = {
  title: "Morphology — Biblical Greek",
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MorphologyPage() {
  const corpus = getCorpus();

  const agapaoParadigm = corpus.verbParadigms.find((p) => p.lemma === "ἀγαπάω")!;
  const pistevoParadigm = corpus.verbParadigms.find((p) => p.lemma === "πιστεύω")!;
  const eimiParadigm = corpus.verbParadigms.find((p) => p.lemma === "εἰμί")!;
  const echoParadigm = corpus.verbParadigms.find((p) => p.lemma === "ἔχω")!;
  const theosParadigm = corpus.nounParadigms.find((p) => p.lemma === "θεός")!;
  const autosParadigm = corpus.pronounParadigms.find((p) => p.lemma === "αὐτός")!;
  const egoParadigm = corpus.pronounParadigms.find((p) => p.lemma === "ἐγώ")!;
  const syParadigm = corpus.pronounParadigms.find((p) => p.lemma === "σύ")!;

  // Concept scaffold: ἠγάπησεν segments (3sg aorist of ἀγαπάω)
  const agapao3sgAor = agapaoParadigm.tenses["aorist active indicative"]?.["3sg"] as VerbParadigmCell;

  // Five-tense chart
  const fiveTenseChart = agapaoParadigm.fiveTenseChart ?? [];

  // ParseTrainer items: verb forms
  const agapao3sg = agapaoParadigm.tenses["aorist active indicative"]?.["3sg"] as VerbParadigmCell;
  const pistevo3pl = pistevoParadigm.tenses["aorist active indicative"]?.["3pl"] as VerbParadigmCell;
  const eimi1sg = eimiParadigm.tenses["present active indicative"]?.["1sg"] as VerbParadigmCell;
  // Noun forms for ParseTrainer
  const theosDatSg = theosParadigm.cells["dat_sg"];
  const autosDatPl = autosParadigm.cells["dat_pl"];

  // Definitions drill: voices, aspects, tenses, moods
  const drillCategories = ["voice", "aspect", "tenses", "moods"] as const;
  const drillEntries = corpus.glossary.filter((g) =>
    (drillCategories as readonly string[]).includes(g.category)
  );

  // Filter ἀγαπάω paradigm to aorist only for verb coverage block
  const agapaoAoristOnly: VerbParadigm = {
    ...agapaoParadigm,
    tenses: { "aorist active indicative": agapaoParadigm.tenses["aorist active indicative"] },
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Morphology</h1>
        <p className="text-sm text-slate-500">
          Study the morpheme system, drill exam-named forms, and parse with slot-by-slot feedback.
        </p>
      </div>

      {/* ── 4.2 Concept scaffold ─────────────────────────────────────────────── */}
      <Section title="The Four-Zone Model">
        <p className="text-sm text-slate-600 leading-relaxed">
          Every inflected Greek form is built from up to four zones. Each zone carries a
          distinct grammatical signal. Learning to spot zones is the key to reading and parsing
          Greek quickly.
        </p>

        {/* Zone palette */}
        <div className="grid grid-cols-2 gap-3">
          {ZONE_ORDER.map((zone) => {
            const style = ZONE_STYLES[zone];
            return (
              <div
                key={zone}
                className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
              >
                <div className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>
                  {style.label}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {zone === "FRONT" && "Augment (ε/η) or reduplication — signals past time"}
                  {zone === "STEM" && "The lexical root — carries the core meaning"}
                  {zone === "MARKER" && "Tense-aspect formative (e.g. σα/σε for aorist)"}
                  {zone === "TAIL" && "Personal ending — encodes person and number"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Worked example: ἀγαπάω → ἠγάπησεν */}
        <div className="rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="text-sm font-medium text-slate-700">
            Worked example: <span className="greek">ἀγαπάω</span> → <span className="greek">ἠγάπησεν</span>{" "}
            <span className="text-slate-400 text-xs">(he loved — 3sg aorist active indicative)</span>
          </div>
          {agapao3sgAor && (
            <BreakView
              form={agapao3sgAor.form}
              segments={agapao3sgAor.segments}
              lemma="ἀγαπάω"
            />
          )}
        </div>
      </Section>

      {/* ── 4.3 Verb coverage ─────────────────────────────────────────────────── */}
      <Section title="Verb Paradigms">
        <p className="text-sm text-slate-500">
          The exam names these conjugations. Use the tense/person buttons to explore each form.
        </p>

        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">
              <span className="greek">ἀγαπάω</span> — aorist active indicative
            </div>
            <BuildStepper paradigm={agapaoAoristOnly} />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">
              <span className="greek">πιστεύω</span> — present & aorist active indicative
            </div>
            <BuildStepper paradigm={pistevoParadigm} />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">
              <span className="greek">εἰμί</span> — present active indicative
            </div>
            <BuildStepper paradigm={eimiParadigm} />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">
              <span className="greek">ἔχω</span> — present active indicative
            </div>
            <BuildStepper paradigm={echoParadigm} />
          </div>
        </div>
      </Section>

      {/* ── 4.4 Five-tense ἀγαπάω view ───────────────────────────────────────── */}
      <Section title="ἀγαπάω Across the Five Tenses">
        <p className="text-sm text-slate-500">
          One representative form per tense (1st singular, active, indicative). Zones ringed in
          purple are new or changed from the previous tense.
        </p>
        {fiveTenseChart.length > 0 && <FiveTenseStepper forms={fiveTenseChart} />}
      </Section>

      {/* ── 4.5 Noun/pronoun coverage ─────────────────────────────────────────── */}
      <Section title="Noun & Pronoun Paradigms">
        <p className="text-sm text-slate-500">
          Declension tables for the exam-named nominals.
        </p>

        <div className="space-y-6">
          <NounTable paradigm={theosParadigm} />
          <NounTable paradigm={corpus.articleParadigm} />
          <NounTable paradigm={autosParadigm} />
          <NounTable paradigm={egoParadigm} />
          <NounTable paradigm={syParadigm} />
        </div>
      </Section>

      {/* ── 4.6 Parse trainer ─────────────────────────────────────────────────── */}
      <Section title="Parsing Trainer">
        <p className="text-sm text-slate-500">
          Select a form, then identify each grammatical property. Submit for slot-by-slot feedback
          and a morpheme breakdown.
        </p>
        <ParseTrainerSection
          items={[
            ...(agapao3sg
              ? [{
                  form: agapao3sg.form,
                  gloss: "he loved",
                  type: "verb" as const,
                  correctParse: {
                    person: agapao3sg.person,
                    number: agapao3sg.number,
                    tense: agapao3sg.tense,
                    voice: agapao3sg.voice,
                    mood: agapao3sg.mood,
                  },
                  segments: agapao3sg.segments,
                }]
              : []),
            ...(pistevo3pl
              ? [{
                  form: pistevo3pl.form,
                  gloss: "they believed",
                  type: "verb" as const,
                  correctParse: {
                    person: pistevo3pl.person,
                    number: pistevo3pl.number,
                    tense: pistevo3pl.tense,
                    voice: pistevo3pl.voice,
                    mood: pistevo3pl.mood,
                  },
                  segments: pistevo3pl.segments,
                }]
              : []),
            ...(eimi1sg
              ? [{
                  form: eimi1sg.form,
                  gloss: "I am",
                  type: "verb" as const,
                  correctParse: {
                    person: eimi1sg.person,
                    number: eimi1sg.number,
                    tense: eimi1sg.tense,
                    voice: eimi1sg.voice,
                    mood: eimi1sg.mood,
                  },
                  segments: eimi1sg.segments,
                }]
              : []),
            ...(theosDatSg
              ? [{
                  form: theosDatSg.form,
                  gloss: "to God",
                  type: "noun" as const,
                  correctParse: {
                    case: "dat" as const,
                    number: "sg" as const,
                    gender: theosParadigm.gender,
                  },
                  segments: theosDatSg.segments,
                }]
              : []),
            ...(autosDatPl
              ? [{
                  form: autosDatPl.form,
                  gloss: "to them",
                  type: "noun" as const,
                  correctParse: {
                    case: "dat" as const,
                    number: "pl" as const,
                    gender: autosParadigm.gender,
                  },
                  segments: autosDatPl.segments,
                }]
              : []),
          ]}
        />
      </Section>

      {/* ── 4.7 Definitions drill ─────────────────────────────────────────────── */}
      <Section title="Definitions Drill">
        <p className="text-sm text-slate-500">
          Voices, aspects, tenses, and moods — all from the course glossary.
        </p>
        {drillEntries.length > 0 && <DefinitionsDrill entries={drillEntries} />}
      </Section>
    </div>
  );
}
