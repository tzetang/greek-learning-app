## Why

The course's morphology — how Greek words are built and broken down — is exactly what its quizzes and final exam test (the "Preparation for Exam 3" slide explicitly names "Forms of ἀγαπάω in the five Greek tenses" and "Conjugations of ἀγαπάω and πιστεύω in their aorist, active, indicative forms"). Today that material is scattered across individual topic pages as decoration inside the BREAK/BUILD components; there is no single destination where a learner can study the morpheme system as a concept and then drill the exact forms the exam names. This change creates a dedicated, exam-faithful Morphology section.

## What Changes

- Add a new top-level **Morphology** section (peer of Topics / Quiz / John 3:16 on the home screen) at `/morphology`.
- Lead with a short **concept scaffold** that teaches the four-zone morpheme model (FRONT augment · STEM · MARKER tense-formative · TAIL ending) using the course's worked example ἀγαπάω → ἠγάπησεν, then drill the exam-named forms.
- Drill the exam's named verb forms: ἀγαπάω & πιστεύω aorist active indicative (full conjugations), εἰμί & ἔχω present, and **ἀγαπάω across the five tenses** (one representative active-indicative form per tense, verbatim from the Week 6 exercises).
- Cover noun/pronoun/article inflection too: θεός (2nd declension), the definite article, and the αὐτός / ἐγώ / σύ personal-pronoun tables.
- Add a **structured parsing trainer**: the learner selects each grammatical property from on-screen selectors (verbs: person · number · tense · voice · mood; nouns/pronouns: case · number · gender), graded slot-by-slot with per-property feedback and a morpheme breakdown of the form.
- Add a **definitions drill** for the term-level content the exam tests verbatim (three voices, two aspects, five tenses, six moods), sourced from the course glossary/Week 6 exercises.
- Add the missing five-tense ἀγαπάω data and verb voice/mood metadata to the corpus so the parsing trainer and five-tense view are corpus-driven.

## Capabilities

### New Capabilities
- `morphology-section`: A dedicated, exam-blueprint-organized learning destination that teaches the morpheme model, composes the existing BREAK/BUILD breakdown engine over the course's named forms, provides a structured slot-by-slot parsing trainer with per-property grading, and offers a definitions drill for the course's grammatical-term content.

### Modified Capabilities
- `content-corpus`: Add ἀγαπάω's five-tense representative forms (Present ἀγαπάω, Future ἀγαπήσω, Aorist ἠγάπησα, Perfect ἠγάπηκα, Imperfect ἠγάπων) and add explicit voice and mood metadata to verb paradigm cells, so the five-tense view and the structured parsing trainer are generated entirely from corpus data.

## Impact

- **New code**: `app/morphology/page.tsx` (+ any sub-views), a `MorphologyTrainer`/`ParseTrainer` client component, a home-screen card in `app/page.tsx`.
- **Reused as-is**: `components/BreakView.tsx`, `components/BuildStepper.tsx`, `lib/zones.ts`, `components/SignalDictionary.tsx`.
- **Modified**: `data/corpus.json` (5-tense ἀγαπάω forms + voice/mood on verb cells), `lib/corpus-types.ts` (verb cell `voice`/`mood` fields; structure for representative-form-per-tense), `lib/corpus.ts` (validation of new fields).
- **Out of scope**: the existing `/quiz` `parse` format is left unchanged; the new structured parse trainer lives in the Morphology section (its parse component is built to be reusable by the quiz engine later).
- **Content sourcing**: all forms and definitions are taken verbatim from the course PDFs (primarily IBG 2026 6 and the Week 6 exercises); no out-of-course paradigms are introduced.
