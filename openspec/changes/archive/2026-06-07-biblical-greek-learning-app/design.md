## Context

Greenfield project. The repository currently holds only `content/` (the IBG 2026 course PDFs/JPG) and `openspec/`. The app must be built **only** from `content/`, stay faithful to the course's simplified definitions, run mobile-responsive, deploy to Vercel, and use an OpenAI-compatible endpoint for its AI tutor.

The course material is fixed and small (a handful of vocabulary sets, glossaries, paradigm exercises, a prepositions diagram, an optative handout, six slide decks). Two further vocabulary sets will be provided later. The course's own goal — read and decipher John 3:16 — is the app's capstone, and the verse is almost entirely composed of the course's core vocabulary and grammar.

The hardest learning problem (per the learner) is **morphology**: recognising how a lexical root transforms into its inflected forms. The design makes that the centerpiece.

## Goals / Non-Goals

**Goals:**
- One structured **corpus** as the single source of truth, extensible by editing data only.
- A **morpheme/zone breakdown** model reused across learning, the reader, and quizzes (BUILD + BREAK).
- Configurable, auto-graded quizzing (topic-level selection; valid formats only; select-all = mock exam).
- Per-topic Learn pages and a John 3:16 reader, all rendered from the corpus.
- A corpus-grounded, course-faithful AI tutor over a configurable OpenAI-compatible endpoint, with the key kept server-side.
- Mobile-responsive; deployable to Vercel with no database and no auth.

**Non-Goals:**
- No habit features: streaks, reminders, push notifications, or scheduled spaced-repetition.
- No accounts, login, or cross-device sync (single-user).
- No content beyond `content/`; no scholarly grammar that contradicts the course.
- No live PDF parsing at runtime (extraction is a build-time/offline step).

## Decisions

### Stack: Next.js (App Router) + React + TypeScript + Tailwind on Vercel
Chosen because Vercel is the deployment target and Next.js is its first-class framework, giving static rendering for the (fixed) content plus a serverless Route Handler for the tutor proxy in one project. *Alternatives:* a pure SPA (Vite/React) + separate function host — rejected as more moving parts for no benefit; the corpus is static and only the tutor needs a server.

### Corpus is static JSON built once from `content/`
The PDFs are extracted (offline, assisted by hand-verification for accuracy/fidelity) into versioned JSON shipped as static assets. *Why:* content is fixed and small; a database adds cost and operational surface for no gain. Adding the two future vocab sets = edit JSON + redeploy. *Alternative:* a CMS/DB — rejected (overkill, single-user, fixed content).

### Morpheme/zone model as a shared data structure
Each drilled inflected form (paradigms + every John 3:16 word) carries an ordered `segments[]` array; each segment has `text`, a `zone` from a fixed palette (`augment | reduplication | prefix | stem | marker | ending`), a `signal` string, an optional `note`, and the stem links to its `lexeme`. One renderer drives the BREAK display (reader, quiz feedback) and the BUILD stepper (Learn). *Why:* the learner's hardest problem deserves one well-modeled primitive rather than ad-hoc tables per feature. *Alternative:* store only flat paradigm tables — rejected; it cannot teach the transformation or power tap-to-decode.

### Quiz engine = (selected components) × (valid formats), generated from corpus
Topic-level selection keeps state trivial (no per-item mastery tracking, matching the "no habit features" decision). A capability matrix maps each component to its valid formats so the UI only offers sensible questions. Select-all naturally yields the mock exam, so no separate exam feature is needed. *Alternative:* word-level selection + SRS — explicitly rejected by the learner.

### Tutor: server-side proxy to an OpenAI-compatible endpoint, corpus-grounded
A Route Handler (`/api/tutor`) holds the key (env vars `TUTOR_BASE_URL`, `TUTOR_API_KEY`, `TUTOR_MODEL`), injects the relevant corpus subset as grounding context, applies a system prompt that enforces course-faithful definitions and content-scope fencing, and streams the response. *Why OpenAI-compatible:* provider-agnostic (OpenAI, OpenRouter, Groq, or a local model) by changing the base URL. *Alternative:* call the LLM from the browser — rejected (leaks the key) ; vendor-locked SDK — rejected (the learner asked for OpenAI-compatible).

### Course-fidelity enforced in data, not just prose
The corpus marks each simplified definition as the course-faithful one; Learn pages render it directly and the tutor's system prompt is told to defer to it. This is the core defense against an LLM "helpfully" teaching scholarly grammar that breaks the exam.

### Client state in `localStorage`
Last quiz selection (and any lightweight "where I was") persists in `localStorage`. No backend state, consistent with single-user, no-auth, no-DB.

## Risks / Trade-offs

- **PDF extraction accuracy / fidelity** → Morphology and Greek spelling must be exact. Mitigation: hand-verify extracted Greek and segmentations against the source PDFs; treat the corpus as reviewed data, not raw OCR.
- **Polytonic Greek rendering on mobile** (breathing marks, accents, iota subscript) → Mitigation: bundle a font with full polytonic coverage and test on mobile early.
- **Greek input grading** (learners type with accents the course doesn't assess) → Mitigation: normalize (strip accents/diacritics not assessed) before comparison, per the quiz-engine spec.
- **Tutor drifting beyond content or contradicting the course** → Mitigation: corpus grounding + a strict system prompt + explicit out-of-scope flagging; keep the tutor as gap-filler, with structured content as the authoritative backbone.
- **Tutor cost/availability** (depends on external endpoint) → Mitigation: configurable endpoint allows a cheaper or local model; structured features (Learn, quizzes, reader) work fully without the tutor.
- **Morpheme model over-reaching** (contract verbs, irregulars) → Mitigation: cap breakdowns at the course altitude with a note + tutor handoff, per the morphology-breakdown spec.

## Migration Plan

Greenfield, so deployment rather than migration:
1. Scaffold the Next.js app and commit the extracted, hand-verified corpus JSON.
2. Build features against the corpus; verify mobile responsiveness and polytonic rendering.
3. Configure `TUTOR_BASE_URL`, `TUTOR_API_KEY`, `TUTOR_MODEL` in Vercel.
4. Deploy to Vercel (preview → production).
5. Later: append the two new vocabulary sets to the corpus JSON and redeploy — no code change.

Rollback: revert to the previous Vercel deployment; the corpus is versioned in git.

## Resolved Decisions

- **Vocabulary labeling:** Sequential `Set 1, 2, 3 …` in teaching order. The inconsistent source-file names (e.g. `IBG Vocabulary 3` holding Set 2's words) are reconciled during extraction; the two pending sets append as the next numbers (Set 4, Set 5).
- **John 3:16 words outside the core sets** (e.g. κόσμον, μονογενῆ, ἔδωκεν, ζωήν): show them fully in the reader (gloss + morpheme zones) but **flag them "beyond core sets"** and **exclude them from vocabulary quizzes**, so the whole verse is decodable without overstating what must be memorized.
- **Tutor default endpoint:** a custom OpenAI-compatible LiteLLM proxy.
  - `TUTOR_BASE_URL = https://litellm.tzetang.com`
  - `TUTOR_MODEL = Qwen3.6-35B-A3B-MTP`
  - `TUTOR_API_KEY` = **secret** — set in Vercel env and a gitignored `.env.local`; **never committed**. (The implementation appends the standard OpenAI-compatible chat-completions path to the base URL.)
