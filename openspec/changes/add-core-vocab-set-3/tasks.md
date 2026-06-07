## 1. Add Vocabulary Set 3 to Corpus

- [x] 1.1 Open `data/corpus.json` and append a new object to the `vocabSets` array with `id: 3` and `name: "Core Vocabulary 3"`
- [x] 1.2 Add all 24 entries from `IBG Vocabulary 3.pdf` — each with `greek`, `gloss`, `partOfSpeech`, `setId: 3`, `source: "IBG Vocabulary 3.pdf"`

## 2. Validate

- [x] 2.1 Confirm the JSON parses cleanly: `node -e "require('./data/corpus.json')" && echo OK`
- [x] 2.2 Run the dev server and verify Set 3 appears in the quiz set selector with 24 words
- [x] 2.3 Verify Set 3 words are browsable in the topic learning vocabulary section
