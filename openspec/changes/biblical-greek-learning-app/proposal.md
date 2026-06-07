## Why

The learner is taking St Paul's Theological College "Introduction to Biblical Greek" (IBG 2026) and needs a study tool that (a) teaches the grammar — especially *how a root word transforms* into its inflected forms, the hardest part — and (b) lets them practise exactly what the course's quizzes and final exam cover. Generic Greek apps actively work against this: they teach scholarly definitions (e.g. aorist as aspect) that contradict the course's deliberate simplifications (aorist = "simple past, indicative"). The app must therefore be built **only** from the material in `content/` and stay faithful to that course's altitude, culminating in the ability to read and decipher John 3:16 — the verse the course itself points to from Session 1.

## What Changes

- Build a new mobile-responsive web app (Next.js on Vercel) for learning Biblical Greek, sourced **only** from `content/`.
- Extract the `content/` PDFs into a single structured JSON **corpus** (vocabulary sets, glossary terms, verb/noun paradigms, prepositions, the John 3:16 interlinear, and the course's own simplified definitions) that is the one source of truth for every feature and is **extensible** (two more vocab sets arrive later → append JSON, redeploy).
- Encode and teach a **morpheme/zone breakdown** for every drilled form: a 4-zone decoder (FRONT = when · STEM = what · MARKER = what kind · TAIL = who) that runs in both directions — BUILD (root → form, with a transformation stepper) and BREAK (form → root + features) — backed by an accumulating "signal dictionary".
- Provide **per-topic learning** pages (Learn) for vocab, cases/declensions, tenses, moods, prepositions, and writing/sound — rendered from the corpus so they always match the course.
- Provide a **configurable quiz engine**: learner selects topics (topic-level granularity), the engine offers only formats valid for that selection, auto-grades, and treats "select everything" as a full mock exam.
- Provide an **interactive John 3:16 reader** (the capstone): tap any word to see its morpheme zones, gloss, and parse, with links back to the relevant Learn page.
- Provide an **AI tutor** that fills gaps the structured content does not, powered by a configurable **OpenAI-compatible endpoint** via a server-side proxy, grounded in the corpus and instructed to defer to the course's definitions.
- Deploy to **Vercel**: static corpus + serverless tutor route, no database, no auth (single-user).

## Capabilities

### New Capabilities
- `content-corpus`: The structured JSON data model extracted from `content/` (vocab, glossary, paradigms, prepositions, John 3:16 interlinear, course-specific definitions), its extraction process, extensibility, and course-fidelity guarantees. Single source of truth for all other capabilities.
- `morphology-breakdown`: The 4-zone morpheme decoder model (augment/reduplication/prefix · stem · marker · ending) and its interactive BUILD/BREAK presentation plus the signal dictionary — the shared component used by learning, the reader, and parsing quizzes.
- `topic-learning`: Per-topic Learn/revision pages rendered from the corpus, including the transformation stepper for grammar topics; faithful to the course's altitude.
- `quiz-engine`: Configurable, auto-graded quizzing with topic-level component selection, valid-formats-only generation, and select-all-as-mock-exam.
- `john-316-reader`: The interactive verse capstone (BREAK direction) with morpheme zones and cross-links to Learn pages.
- `ai-tutor`: Conversational tutor over an OpenAI-compatible endpoint via a server-side proxy, grounded in and fenced to the corpus, faithful to course definitions.

### Modified Capabilities
<!-- None — greenfield project, no existing specs. -->

## Impact

- **New codebase**: Next.js (App Router) + React + TypeScript + Tailwind; greenfield (repo currently holds only `content/` and `openspec/`).
- **Build-time tooling**: a one-time/offline PDF → corpus JSON extraction step; the corpus ships as static assets.
- **Runtime**: one serverless Route Handler (`/api/tutor`) proxying to the OpenAI-compatible endpoint with streaming; no database, no authentication.
- **Configuration**: Vercel environment variables `TUTOR_BASE_URL`, `TUTOR_API_KEY`, `TUTOR_MODEL`; client state in `localStorage` (last quiz selection).
- **Content dependency**: features are bounded to `content/`; the two not-yet-provided vocab sets are added later by extending the corpus.
- **Fonts**: must render polytonic Greek (breathing marks, accents, iota subscript) correctly across mobile.
