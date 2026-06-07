## 1. Corpus data model

- [x] 1.1 Extend `lib/corpus-types.ts`: add discrete `voice` and `mood` fields to the verb paradigm cell type (keep person/number/tense first-class) so cells expose all five parse properties as data
- [x] 1.2 Add a representative-form-per-tense structure for the five-tense ἀγαπάω chart (one active-indicative form per course tense, each with `segments`)
- [x] 1.3 Add a glossary `aspect` category (or equivalent) to the types so the two verbal aspects can be stored as course definitions

## 2. Corpus content (course-faithful, from `content/`)

- [x] 2.1 Backfill `voice` and `mood` on all existing verb paradigm cells (εἰμί, ἔχω, ἀγαπάω, πιστεύω)
- [x] 2.2 Add ἀγαπάω's five-tense forms verbatim from the Week 6 exercises: present ἀγαπάω, future ἀγαπήσω, aorist ἠγάπησα, perfect ἠγάπηκα, imperfect ἠγάπων — each with a course-altitude morpheme segmentation
- [x] 2.3 Add the course's two verbal-aspect definitions (perfective / imperfective) from IBG 2026 6 to the glossary; confirm the three voices, five tenses, and six moods definitions are present
- [x] 2.4 Update `lib/corpus.ts` validation to cover the new verb fields and five-tense structure; verify the corpus loads and validates

## 3. Parsing trainer component

- [x] 3.1 Build a standalone `ParseTrainer` client component with a typed props contract (form + correct discrete properties + segments), built to be reusable by the quiz engine later
- [x] 3.2 Render property selectors driven by corpus metadata: verbs → person/number/tense/voice/mood; nouns/pronouns → case/number/gender
- [x] 3.3 Grade each property independently and show per-property correct/incorrect feedback
- [x] 3.4 On submit, reveal the correct full parse and the form's morpheme breakdown (reuse `BreakView`/zones)
- [x] 3.5 Apply the course-altitude rule for above-altitude forms (simplified zones + brief note + tutor handoff)

## 4. Morphology section page

- [x] 4.1 Create the `/morphology` route (`app/morphology/page.tsx`)
- [x] 4.2 Concept scaffold: teach the four-zone model using ἀγαπάω → ἠγάπησεν via the existing breakdown engine
- [x] 4.3 Verb coverage block: ἀγαπάω & πιστεύω aorist conjugations and εἰμί & ἔχω present (compose existing BUILD/paradigm views)
- [x] 4.4 Five-tense ἀγαπάω view using `BuildStepper`, highlighting changed zones across present→future→aorist→perfect→imperfect
- [x] 4.5 Noun/pronoun coverage block: θεός declension, the definite article, and αὐτός / ἐγώ / σύ tables
- [x] 4.6 Embed the `ParseTrainer` with verb and noun/pronoun forms drawn from the corpus
- [x] 4.7 Definitions drill: voices, aspects, tenses, moods — prompts and answers from corpus definitions only

## 5. Navigation & integration

- [x] 5.1 Add a Morphology card to the home screen (`app/page.tsx`) as a peer of Topics / Quiz / John 3:16
- [x] 5.2 Ensure any nav/app shell lists the new section consistently

## 6. Verification

- [x] 6.1 Verify every form, conjugation, and definition in the section is sourced from the corpus and traceable to `content/` (no out-of-course material)
- [x] 6.2 Manually exercise the parse trainer: confirm slot-by-slot grading, partial-credit feedback, and post-grade breakdown for a verb and a noun/pronoun
- [x] 6.3 Confirm the five-tense view shows the exact Week 6 forms and highlights changing zones
- [x] 6.4 Run lint/build (`npm run build`) and confirm the new route renders
