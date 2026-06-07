import type { Corpus, VocabEntry, VerbParadigmCell } from "./corpus-types";
import rawCorpus from "@/data/corpus.json";

// Cast once at the import boundary; the JSON shape is validated below.
const corpus = rawCorpus as unknown as Corpus;

// ─── Validation ──────────────────────────────────────────────────────────────

const VALID_VOICES = new Set(["active", "middle", "passive"]);
const VALID_MOODS = new Set(["indicative", "subjunctive", "optative", "imperative", "infinitive", "participle"]);
const VALID_TENSES = new Set(["present", "future", "aorist", "perfect", "imperfect"]);
const VALID_PERSONS = new Set(["1st", "2nd", "3rd"]);
const VALID_NUMBERS = new Set(["sg", "pl"]);

function validateVerbCell(cell: VerbParadigmCell, path: string, errors: string[]): void {
  if (!VALID_VOICES.has(cell.voice))
    errors.push(`${path}: invalid voice "${cell.voice}"`);
  if (!VALID_MOODS.has(cell.mood))
    errors.push(`${path}: invalid mood "${cell.mood}"`);
  if (!VALID_TENSES.has(cell.tense))
    errors.push(`${path}: invalid tense "${cell.tense}"`);
  if (!VALID_PERSONS.has(cell.person))
    errors.push(`${path}: invalid person "${cell.person}"`);
  if (!VALID_NUMBERS.has(cell.number))
    errors.push(`${path}: invalid number "${cell.number}"`);
  if (!cell.segments || cell.segments.length === 0)
    errors.push(`${path}: missing segments`);
}

function validateCorpus(c: Corpus): void {
  const errors: string[] = [];

  for (const set of c.vocabSets) {
    for (const entry of set.entries) {
      if (!entry.source)
        errors.push(`Vocab set ${set.id}: "${entry.greek}" missing source`);
    }
  }

  for (const entry of c.beyondCoreSets) {
    if (!entry.source)
      errors.push(`beyondCoreSets: "${entry.greek}" missing source`);
  }

  for (const g of c.glossary) {
    if (!g.source)
      errors.push(`Glossary "${g.term}" missing source`);
  }

  for (const paradigm of c.verbParadigms) {
    for (const [tenseKey, persons] of Object.entries(paradigm.tenses)) {
      for (const [personKey, cell] of Object.entries(persons)) {
        const path = `verbParadigm "${paradigm.lemma}" tense "${tenseKey}" ${personKey}`;
        validateVerbCell(cell as VerbParadigmCell, path, errors);
      }
    }
    if (paradigm.fiveTenseChart) {
      for (const form of paradigm.fiveTenseChart) {
        if (!VALID_TENSES.has(form.tense))
          errors.push(`verbParadigm "${paradigm.lemma}" fiveTenseChart: invalid tense "${form.tense}"`);
        if (!form.segments || form.segments.length === 0)
          errors.push(`verbParadigm "${paradigm.lemma}" fiveTenseChart "${form.tense}": missing segments`);
      }
    }
  }

  for (const word of c.john316.words) {
    if (!word.segments || word.segments.length === 0)
      errors.push(`John 3:16 word[${word.index}] "${word.greek}" missing segments`);
  }

  if (errors.length > 0) {
    console.error("[corpus] Validation errors:\n" + errors.join("\n"));
  }
}

// Validate once at module load (dev) — silent in production builds.
if (process.env.NODE_ENV !== "production") {
  validateCorpus(corpus);
}

// ─── Accessors ───────────────────────────────────────────────────────────────

export function getCorpus(): Corpus {
  return corpus;
}

/** All vocab entries from core sets (for quizzes — excludes beyondCoreSets). */
export function getCoreVocab(): VocabEntry[] {
  return corpus.vocabSets.flatMap((s) => s.entries);
}

/** Vocab entry by lemma, searching core sets then beyondCoreSets. */
export function findVocabEntry(lemma: string): VocabEntry | undefined {
  const all = [...getCoreVocab(), ...corpus.beyondCoreSets];
  return all.find((e) => e.greek === lemma);
}

export { corpus };
