import type { Corpus, VocabEntry, ParadigmCell } from "./corpus-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuizFormat =
  | "recognize"      // Greek → English (multiple choice)
  | "produce"        // English → Greek (text input)
  | "parse"          // verb form → parse description (text input)
  | "fill-paradigm"  // show paradigm with blanks (text input)
  | "match";         // match Greek to English (pairs)

export type QuizComponent =
  | "vocabulary-set-1"
  | "vocabulary-set-3"
  | "cases"
  | "pronouns"
  | "verbs"
  | "tenses"
  | "moods"
  | "prepositions";

export interface QuizQuestion {
  id: string;
  format: QuizFormat;
  prompt: string;
  promptGreek?: string;
  answer: string;
  choices?: string[];        // for "recognize" and "match"
  matchPairs?: [string, string][]; // for "match"
  segments?: ParadigmCell["segments"]; // for parse feedback
  parseDescription?: string;
  hint?: string;
}

// ─── Component → valid formats ────────────────────────────────────────────────

export const COMPONENT_FORMATS: Record<QuizComponent, QuizFormat[]> = {
  "vocabulary-set-1": ["recognize", "produce", "match"],
  "vocabulary-set-3": ["recognize", "produce", "match"],
  "cases": ["recognize", "fill-paradigm"],
  "pronouns": ["recognize", "fill-paradigm"],
  "verbs": ["recognize", "parse", "fill-paradigm"],
  "tenses": ["recognize", "parse", "fill-paradigm"],
  "moods": ["recognize"],
  "prepositions": ["recognize", "match"],
};

// ─── Question generation ──────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeChoices(correct: string, pool: string[], count = 4): string[] {
  const distractors = shuffle(pool.filter((s) => s !== correct)).slice(0, count - 1);
  return shuffle([correct, ...distractors]);
}

/** Normalise Greek input for grading: strip diacritics, lowercase. */
export function normalizeGreek(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ҅҆҈҉]/g, "")
    .toLowerCase()
    .trim();
}

/** Grade a free-text answer: exact match after normalising diacritics. */
export function gradeAnswer(userInput: string, expected: string): boolean {
  const norm = normalizeGreek(userInput);
  const exp = normalizeGreek(expected);
  return norm === exp;
}

export function generateQuestions(
  component: QuizComponent,
  format: QuizFormat,
  corpus: Corpus,
  count = 10
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  if (component === "vocabulary-set-1" || component === "vocabulary-set-3") {
    const setId = component === "vocabulary-set-1" ? 1 : 3;
    // Exclude beyondCoreSets words — they must not appear in vocab quizzes
    const entries = corpus.vocabSets.find((s) => s.id === setId)?.entries ?? [];
    const allGlosses = entries.map((e) => e.gloss);
    const allGreek = entries.map((e) => e.greek);
    const pool = shuffle(entries).slice(0, count);

    for (const entry of pool) {
      if (format === "recognize") {
        questions.push({
          id: `rec-${entry.greek}`,
          format: "recognize",
          prompt: "What does this Greek word mean?",
          promptGreek: entry.greek,
          answer: entry.gloss,
          choices: makeChoices(entry.gloss, allGlosses),
        });
      } else if (format === "produce") {
        questions.push({
          id: `prod-${entry.greek}`,
          format: "produce",
          prompt: `Type the Greek word for: ${entry.gloss}`,
          answer: entry.greek,
          hint: entry.partOfSpeech,
        });
      } else if (format === "match") {
        // Build match pairs from a batch of 5
        const batch = shuffle(entries).slice(0, 5);
        const pairs: [string, string][] = batch.map((e) => [e.greek, e.gloss]);
        questions.push({
          id: `match-${setId}-${questions.length}`,
          format: "match",
          prompt: "Match each Greek word to its English meaning.",
          answer: "",
          matchPairs: pairs,
        });
        break; // one match question covers the set
      }
    }
    return questions;
  }

  if (component === "cases" || component === "pronouns") {
    const paradigms =
      component === "cases"
        ? corpus.nounParadigms
        : corpus.pronounParadigms;

    for (const paradigm of paradigms.slice(0, 2)) {
      const cells = Object.entries(paradigm.cells);
      const selected = shuffle(cells).slice(0, Math.ceil(count / paradigms.length));
      for (const [key, cell] of selected) {
        if (format === "recognize") {
          const caseLabel = key.replace("_", " ");
          const allForms = cells.map(([, c]) => c.form);
          questions.push({
            id: `case-rec-${paradigm.lemma}-${key}`,
            format: "recognize",
            prompt: `What is the ${caseLabel} form of ${paradigm.lemma} (${paradigm.gloss})?`,
            answer: cell.form,
            choices: makeChoices(cell.form, allForms),
          });
        } else if (format === "fill-paradigm") {
          questions.push({
            id: `case-fill-${paradigm.lemma}-${key}`,
            format: "fill-paradigm",
            prompt: `Fill in the blank: ${paradigm.lemma} — ${key.replace("_", " ")}`,
            answer: cell.form,
            segments: cell.segments,
          });
        }
      }
    }
    return questions.slice(0, count);
  }

  if (component === "verbs" || component === "tenses") {
    const verbs = corpus.verbParadigms;
    for (const vp of verbs) {
      for (const [tense, forms] of Object.entries(vp.tenses)) {
        for (const [person, cell] of Object.entries(forms)) {
          if (!cell) continue;
          if (format === "parse") {
            questions.push({
              id: `parse-${vp.lemma}-${tense}-${person}`,
              format: "parse",
              prompt: `Parse this verb form:`,
              promptGreek: cell.form,
              answer: `${person} ${tense}`,
              parseDescription: `${person} ${tense} of ${vp.lemma}`,
              segments: cell.segments,
            });
          } else if (format === "recognize") {
            const allForms = verbs.flatMap((v) =>
              Object.values(v.tenses).flatMap((t) =>
                Object.values(t).map((c) => c?.form ?? "")
              )
            ).filter(Boolean);
            questions.push({
              id: `verb-rec-${vp.lemma}-${tense}-${person}`,
              format: "recognize",
              prompt: `What is the ${person} ${tense} of ${vp.lemma} (${vp.gloss})?`,
              answer: cell.form,
              choices: makeChoices(cell.form, allForms),
              segments: cell.segments,
            });
          } else if (format === "fill-paradigm") {
            questions.push({
              id: `verb-fill-${vp.lemma}-${tense}-${person}`,
              format: "fill-paradigm",
              prompt: `Fill in: ${vp.lemma} — ${person} ${tense}`,
              answer: cell.form,
              segments: cell.segments,
            });
          }
        }
      }
    }
    return shuffle(questions).slice(0, count);
  }

  if (component === "prepositions") {
    const preps = corpus.prepositions;
    if (format === "recognize") {
      for (const prep of shuffle(preps).slice(0, count)) {
        const gloss = prep.glosses[0];
        const allGlosses = preps.flatMap((p) => p.glosses);
        questions.push({
          id: `prep-rec-${prep.greek}`,
          format: "recognize",
          prompt: `What does the preposition mean?`,
          promptGreek: `${prep.greek} (+ ${prep.cases[0]})`,
          answer: gloss,
          choices: makeChoices(gloss, allGlosses),
        });
      }
    } else if (format === "match") {
      const batch = shuffle(preps).slice(0, 5);
      questions.push({
        id: "prep-match",
        format: "match",
        prompt: "Match each preposition to its primary gloss.",
        answer: "",
        matchPairs: batch.map((p) => [p.greek, p.glosses[0]]),
      });
    }
    return questions;
  }

  if (component === "moods") {
    const moodTerms = corpus.glossary.filter((g) => g.category === "moods");
    for (const term of shuffle(moodTerms).slice(0, count)) {
      const allDefs = moodTerms.map((t) => t.definition);
      questions.push({
        id: `mood-rec-${term.term}`,
        format: "recognize",
        prompt: `What is the definition of the "${term.term}"?`,
        answer: term.definition,
        choices: makeChoices(term.definition, allDefs),
      });
    }
    return questions;
  }

  return questions;
}
