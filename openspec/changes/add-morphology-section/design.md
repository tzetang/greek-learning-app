## Context

The app already contains the building blocks of morphology teaching: a four-zone morpheme model (`lib/zones.ts`), BREAK and BUILD components (`components/BreakView.tsx`, `components/BuildStepper.tsx`), a signal dictionary, per-form `segments`, and verb/noun/pronoun paradigms in `data/corpus.json`. The `morphology-breakdown` capability already specifies the zone model, BREAK, BUILD, the signal dictionary, and a course-altitude rule — and its BUILD requirement already references ἀγαπάω "across the course tenses (present → future → aorist → perfect → imperfect)", which the corpus cannot currently satisfy (only the aorist of ἀγαπάω exists).

What's missing is a *destination*: a place that teaches the morpheme system as a concept and drills the exact forms the course names for assessment. The "Preparation for Exam 3" slide (IBG 2026 6) and the Week 6 exercises are effectively an exam blueprint, and they are morphology-heavy. This change adds that destination and the small amount of corpus data it needs.

Decided during exploration (with the user): the section is **drill-forward but concept-scaffolded**, a **new top-level section**, covering **everything the exam names** (verbs + nouns/pronouns/article), with a **structured slot-by-slot parsing trainer**, and the five-tense ἀγαπάω chart **sourced verbatim from the course** (found in the Week 6 exercises).

## Goals / Non-Goals

**Goals:**
- A self-contained `/morphology` destination that a learner can use to prepare for the morphology portions of the quizzes and final exam.
- Teach the zone model explicitly (it is currently only decoration), then drill it.
- Make the parsing trainer faithful to how the exam tests parsing: identify person/number/tense/voice/mood (verbs) or case/number/gender (nouns) for a given form.
- Keep all content corpus-driven and traceable to `content/`.
- Reuse the existing breakdown engine; add no new way to represent morphemes.

**Non-Goals:**
- Changing the existing `/quiz` `parse` format (left as-is; the new structured parser is built to be liftable into the quiz engine later).
- Full 6-person conjugations of ἀγαπάω in all five tenses — the course presents only one representative form per tense, and this section matches that altitude.
- Middle/passive voice or non-indicative mood conjugation tables beyond what the course drills.
- Spaced-repetition / streak / habit mechanics (explicitly excluded by `quiz-engine`).

## Decisions

### Decision: New `morphology-section` capability, composing `morphology-breakdown`
The new section is a *consumer* of the breakdown engine, not an extension of it. `morphology-breakdown` stays the engine (zones, BREAK, BUILD, signals, altitude rule); `morphology-section` owns the destination, the exam-blueprint organization, the parsing trainer, and the definitions drill.
- **Why:** keeps the engine reusable across Topics, John 3:16, and the new section; avoids tangling "how a form is represented" with "how the section is organized."
- **Alternative considered:** fold everything into `morphology-breakdown`. Rejected — it would overload one capability with both representation and a top-level UX surface.

### Decision: Corpus carries discrete parse metadata; do not parse label strings
Verb paradigm cells gain explicit `voice` and `mood` fields (and the existing person/number/tense become first-class), so the parsing trainer reads discrete properties and grades each slot. The `tense` key today mixes concerns (e.g. "aorist active indicative") and the existing quiz grades parse by string-matching `"3sg aorist"`.
- **Why:** slot-by-slot grading needs discrete truth per property; string-splitting a combined label is brittle and is exactly why the current parse format is weak.
- **Alternative considered:** derive properties by parsing the tense label. Rejected — fragile and not extensible to voice/mood.

### Decision: Structured selectors for the parsing trainer
Person/number/tense/voice/mood (verbs) and case/number/gender (nouns) are chosen from on-screen selectors; each is graded independently with per-property feedback, then the morpheme breakdown is revealed.
- **Why:** matches the exam skill, gives partial credit and targeted feedback, and avoids the wording/word-order fragility of free-text parse grading.
- **Alternatives considered:** free-text parse (fragile to phrasing) and reveal-then-self-grade (fast but no objective grading). Both rejected for an exam-prep trainer; reveal-style review can still be offered as the post-grade feedback step.

### Decision: Five-tense chart = one representative form per tense, verbatim from Week 6
Present ἀγαπάω · future ἀγαπήσω · aorist ἠγάπησα · perfect ἠγάπηκα · imperfect ἠγάπων, each with a course-altitude segmentation. The present "form" is the lemma itself, as the course presents it.
- **Why:** this is exactly what the course gives and what the exam names ("Forms of ἀγαπάω in the five Greek tenses"). It also satisfies the pre-existing `morphology-breakdown` BUILD requirement that already references these five tenses.
- **Alternative considered:** author full conjugations in all five tenses from a standard paradigm. Rejected per the user's "dig the PDFs first / use the course's exact forms" decision — out-of-course detail risks teaching the wrong thing for the exam.

### Decision: Reuse BREAK / BUILD / zones / SignalDictionary as-is
The concept scaffold and five-tense view render through `BreakView` and `BuildStepper`; the zone legend comes from `lib/zones.ts`.
- **Why:** the representation is already correct and tested in production; the section only needs to *frame and teach* it.

## Risks / Trade-offs

- **Contract-verb / imperfect accuracy (ἠγάπων, ἀγαπήσω).** These involve contraction and augment the course presents simplified. → Store the course's exact surface forms verbatim; keep segmentation at course altitude and use the existing above-altitude note + tutor handoff for anything beyond it.
- **Aspect definitions may not be in the corpus yet.** The glossary has voice/tenses/moods categories but no `aspect`; the definitions drill needs the two verbal aspects (perfective/imperfective). → Add the course's aspect definitions (from IBG 2026 6) to the glossary as part of the corpus work; this stays course-faithful.
- **Two parse implementations could drift** (new structured trainer vs. existing `/quiz` parse). → Build the parse trainer as a standalone component with a typed props contract so the quiz engine can adopt it later; note it as an explicit follow-up rather than refactoring quiz now.
- **Corpus schema change touches validation.** Adding `voice`/`mood` and the five-tense structure requires updating `lib/corpus-types.ts` and `lib/corpus.ts` validation. → Make new fields additive/optional where existing data lacks them, or backfill all verb cells in the same change so validation stays strict.

## Migration Plan

1. Extend `lib/corpus-types.ts`: add `voice`/`mood` to verb cells and a representative-form-per-tense structure for the five-tense chart.
2. Backfill `data/corpus.json`: voice/mood on existing verb cells, the five-tense ἀγαπάω forms (with segmentation), and the aspect definitions in the glossary — all from `content/`.
3. Update `lib/corpus.ts` validation for the new fields.
4. Build the `ParseTrainer` component and the `/morphology` page composing scaffold → coverage → five-tense BUILD → parse trainer → definitions drill.
5. Add the Morphology card to `app/page.tsx`.
6. No data migration for users (no persisted user state beyond last quiz selection); rollback is removing the route/card and reverting the additive corpus fields.

## Open Questions

- **Resolved:** the definitions drill and parse trainer stay **section-local** for this change. The `ParseTrainer` is built with a typed, reusable props contract so the quiz engine can adopt it (and a future morphology mock-exam mode can be added) without rework, but `/quiz` is not modified here.
- Does the course expect recognition of the five-tense forms only, or production (typing) as well? Current plan: recognition + parsing; production can be added if the exam format demands it.
