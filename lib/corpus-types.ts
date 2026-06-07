// ─── Morpheme zones ──────────────────────────────────────────────────────────

/** The four structural zones of an inflected Greek form. */
export type Zone = "FRONT" | "STEM" | "MARKER" | "TAIL";

/**
 * One morpheme segment within a Greek form.
 * - FRONT: augment (ἠ-/ἐ-), reduplication, or prefix
 * - STEM: the lexical root (links back to the entry)
 * - MARKER: tense/aspect formative (e.g. σα in aorist)
 * - TAIL: personal ending (verb) or case/number ending (noun)
 */
export interface Segment {
  text: string;
  zone: Zone;
  signal: string; // human-readable label shown in the zone palette
  note?: string;  // optional explanatory note
}

// ─── Vocabulary ──────────────────────────────────────────────────────────────

export interface VocabEntry {
  greek: string;           // lemma form
  gloss: string;           // course-faithful English gloss
  partOfSpeech: string;
  setId: number | null;    // null = beyond core sets (flagged, excluded from vocab quizzes)
  source: string;          // source PDF filename
  segments?: Segment[];    // morpheme breakdown of the lemma (if relevant)
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

export interface GlossaryEntry {
  term: string;
  definition: string;  // course-faithful wording
  category: "writing" | "grammar" | "cases" | "tenses" | "moods" | "voice";
  source: string;
}

// ─── Paradigms ───────────────────────────────────────────────────────────────

export type Person = "1sg" | "2sg" | "3sg" | "1pl" | "2pl" | "3pl";
export type Case = "nom" | "acc" | "dat" | "gen" | "voc";
export type Number = "sg" | "pl";

export interface ParadigmCell {
  form: string;
  segments: Segment[];
}

/** Verb paradigm: keyed by tense → person → form */
export interface VerbParadigm {
  lemma: string;
  gloss: string;
  tenses: {
    [tense: string]: {
      [P in Person]?: ParadigmCell;
    };
  };
}

/** Noun/pronoun paradigm: keyed by case+number → form */
export interface NounParadigm {
  lemma: string;
  gloss: string;
  declension: string;
  cells: {
    [key: string]: ParadigmCell; // key = `${Case}_${Number}` e.g. "nom_sg"
  };
}

// ─── Prepositions ────────────────────────────────────────────────────────────

export interface PrepEntry {
  greek: string;
  cases: string[];      // cases it takes: "genitive", "dative", "accusative"
  glosses: string[];    // gloss per case (parallel array to cases)
  source: string;
}

// ─── John 3:16 interlinear ───────────────────────────────────────────────────

export type GrammarTopic =
  | "vocabulary"
  | "cases"
  | "tenses"
  | "moods"
  | "prepositions"
  | "writing-sound"
  | "pronouns"
  | "verbs";

export interface VerseWord {
  index: number;
  greek: string;            // exact form as it appears in the verse
  lemma: string;            // dictionary form
  gloss: string;            // English gloss for this form
  parse: string;            // e.g. "3sg aorist active indicative" or "nominative singular masculine"
  setId: number | null;     // vocabulary set it belongs to; null = beyond core sets
  beyondCoreSets: boolean;  // true when setId is null
  grammarTopic: GrammarTopic | null;  // which Learn page this links to
  segments: Segment[];
}

// ─── Corpus (root) ───────────────────────────────────────────────────────────

export interface Corpus {
  vocabSets: {
    id: number;
    name: string;
    entries: VocabEntry[];
  }[];
  beyondCoreSets: VocabEntry[];   // words in John 3:16 not in any vocab set
  glossary: GlossaryEntry[];
  verbParadigms: VerbParadigm[];
  nounParadigms: NounParadigm[];
  pronounParadigms: NounParadigm[];
  articleParadigm: NounParadigm;
  prepositions: PrepEntry[];
  john316: {
    greek: string;          // full verse text
    words: VerseWord[];
  };
}
