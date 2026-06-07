## Context

The app's corpus is stored in `data/corpus.json` and loaded at module init by `lib/corpus.ts`. Vocabulary sets are an array of `{ id, name, entries[] }` objects. Sets 1 and 2 already exist; all features (quiz, topic learning, tutor) derive their data from this array automatically.

The `content-corpus` spec explicitly requires the corpus to be extensible without code changes — a new vocab set appended to the JSON becomes available to all features immediately.

## Goals / Non-Goals

**Goals:**
- Add all 24 words from `IBG Vocabulary 3.pdf` as `vocabSets[2]` (id: 3) in `data/corpus.json`
- Each entry follows the existing `VocabEntry` shape: `greek`, `gloss`, `partOfSpeech`, `setId: 3`, `source: "IBG Vocabulary 3.pdf"`

**Non-Goals:**
- No feature code changes (no route, component, or lib edits)
- No morpheme segmentation for Set 3 entries (segments are only required for forms that appear in John 3:16 or are explicitly drilled — Set 3 words do not currently appear in the verse interlinear)

## Decisions

**Data-only change via JSON edit**
Alternatives: a seeding script, a separate content file, or a TypeScript constant. All add indirection for no benefit. The JSON array is the canonical data store; appending to it is consistent with how Sets 1 and 2 were authored.

**`partOfSpeech` values follow existing conventions**
Existing entries use values like `"verb"`, `"noun"`, `"adjective"`, `"pronoun"`, `"particle"`, `"preposition"`, `"conjunction"`. Set 3 entries will use the same vocabulary.

**No `segments` field on Set 3 entries**
`segments` is optional per `VocabEntry`. The corpus validation only errors if segments are missing on John 3:16 words; Set 3 lemmas are not in the verse, so omitting segments is correct and consistent with how most Set 1/2 entries are stored.

## Risks / Trade-offs

- [Gloss fidelity] The PDF is the only source of truth; glosses are transcribed verbatim → Mitigation: cross-check all 24 entries against the PDF before commit
- [JSON corruption] Manual JSON editing can introduce syntax errors → Mitigation: run `tsc --noEmit` or `node -e "require('./data/corpus.json')"` after editing to validate

## Migration Plan

1. Open `data/corpus.json`
2. Append a new object to the `vocabSets` array with `id: 3`, `name: "Core Vocabulary 3"`, and all 24 entries
3. Validate JSON parses cleanly
4. Run the dev server and confirm Set 3 appears in the quiz set selector and topic browser
