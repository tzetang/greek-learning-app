## 1. Project setup

- [x] 1.1 Scaffold Next.js (App Router) + TypeScript + Tailwind app
- [x] 1.2 Add a polytonic-Greek-capable web font and verify it renders breathing marks, accents, and iota subscript on mobile
- [x] 1.3 Set up the mobile-responsive app shell and navigation (Topics · Quiz · John 3:16 · Tutor)
- [x] 1.4 Configure Vercel project and env vars: `TUTOR_BASE_URL=https://litellm.tzetang.com`, `TUTOR_MODEL=Qwen3.6-35B-A3B-MTP`, and `TUTOR_API_KEY` as a secret (Vercel env + gitignored `.env.local`; never committed — rotate the shared key)

## 2. Corpus (content-corpus)

- [x] 2.1 Define the corpus JSON schema (vocab sets, glossary/terms, verb & noun paradigms, article, prepositions, John 3:16 interlinear, per-form segments, course-faithful definitions)
- [x] 2.2 Extract vocabulary sets from `content/` and label them sequentially (Set 1, 2, 3 …) in teaching order, reconciling inconsistent source-file names; hand-verify Greek spelling
- [x] 2.3 Extract glossary/grammar term definitions, preserving the course's simplified wording (cases, declensions, tenses, moods)
- [x] 2.4 Extract verb paradigms (tense forms + conjugations for ἀγαπάω and πιστεύω) and noun/article paradigms
- [x] 2.5 Extract the prepositions (from the prepositions diagram) and the optative examples
- [x] 2.6 Build the John 3:16 interlinear (Greek, gloss, parse per word) and flag words outside the core vocab sets
- [x] 2.7 Author the morpheme `segments[]` for every drilled form and every John 3:16 word, hand-verified against the PDFs
- [x] 2.8 Implement a typed corpus loader that all features consume; add a validation check that no entry lacks a content source

## 3. Morphology breakdown (morphology-breakdown)

- [x] 3.1 Implement the zone palette and segment data types (augment/reduplication/prefix · stem · marker · ending) with signals and colour mapping
- [x] 3.2 Build the BREAK component: render a form as tappable, colour-coded zones with each zone's signal and a stem→lexeme link
- [x] 3.3 Build the BUILD transformation stepper: step a lexeme across tenses, highlighting changed zones
- [x] 3.4 Build the signal dictionary view, populated from corpus forms
- [x] 3.5 Add the course-altitude note + "ask the tutor" handoff for forms beyond course level

## 4. Topic learning (topic-learning)

- [x] 4.1 Build the topics index listing every course topic
- [x] 4.2 Build Learn pages rendered from the corpus for vocabulary, cases/declensions, tenses, moods, prepositions, and writing/sound
- [x] 4.3 Embed the BUILD transformation view in inflected-topic Learn pages
- [x] 4.4 Add the Learn→Quiz and Learn→Tutor one-tap actions (passing topic context)

## 5. Quiz engine (quiz-engine)

- [x] 5.1 Build the component selector (topic-level, multi-select) and persist last selection to `localStorage`
- [x] 5.2 Implement the component→valid-formats matrix and show only valid formats for the selection
- [x] 5.3 Implement question generation from the corpus for each format (recognize, produce, parse, fill paradigm, match)
- [x] 5.4 Implement auto-grading, including Greek-input normalization for unassessed diacritics
- [x] 5.5 Show morpheme-breakdown feedback on grammar/inflection questions
- [x] 5.6 Implement select-all → mock exam and verify no streak/reminder mechanics exist

## 6. John 3:16 reader (john-316-reader)

- [x] 6.1 Render John 3:16 from the corpus with correct polytonic display and a mobile-readable layout
- [x] 6.2 Implement tap-to-decode a word (gloss, parse, morpheme zones via the BREAK component)
- [x] 6.3 Add cross-links from a word to its grammar Learn page and show its vocabulary-set provenance

## 7. AI tutor (ai-tutor)

- [x] 7.1 Implement the `/api/tutor` Route Handler proxying to the OpenAI-compatible endpoint with streaming, keeping the key server-side
- [x] 7.2 Build the corpus grounding step (inject the relevant corpus subset as context)
- [x] 7.3 Write the system prompt enforcing course-faithful definitions and content-scope fencing (flag out-of-scope and scholarly nuance)
- [x] 7.4 Build the chat UI (streaming) available globally and per-topic with topic context
- [x] 7.5 Handle the reasoning model (`Qwen3.6-…-MTP`): render only the `content` field (never `reasoning_content`), and set `max_tokens` high enough to cover thinking + answer so replies aren't truncated to empty

## 8. Verification & deploy

- [x] 8.1 Verify each capability against its spec scenarios (corpus fidelity, morpheme zones, quiz formats/grading, reader links, tutor scope)
- [x] 8.2 Test mobile responsiveness and Greek rendering across viewport sizes
- [x] 8.3 Deploy to Vercel (preview → production) and smoke-test the tutor endpoint
- [x] 8.4 Document how to add a future vocabulary set (edit corpus JSON, redeploy) for the two pending sets
