import type { Corpus, VocabEntry } from "./corpus-types";
import rawCorpus from "@/data/corpus.json";

// Cast once at the import boundary; the JSON shape is validated below.
const corpus = rawCorpus as unknown as Corpus;

// ─── Validation ──────────────────────────────────────────────────────────────

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
