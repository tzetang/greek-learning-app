## Why

Core Vocabulary Set 3 (24 words from `IBG Vocabulary 3.pdf`) is missing from the app's corpus, so the quiz engine, topic learning browser, and AI tutor all silently omit these words. Students who have studied Set 3 in class cannot practice or be quizzed on it.

## What Changes

- Add the 24 words from `IBG Vocabulary 3.pdf` as `vocabSets[2]` (id: 3) in `data/corpus.json`
- Each entry includes: `greek`, `gloss`, `partOfSpeech`, `setId: 3`, `source: "IBG Vocabulary 3.pdf"`

## Capabilities

### New Capabilities

_(none — this is purely a data addition)_

### Modified Capabilities

- `content-corpus`: vocab set 3 data is being added; the requirement "corpus models the full course scope" and "extensible without code changes" means this is a data-only change, but the set count increases from 2 → 3

## Impact

- `data/corpus.json`: append one new object to the `vocabSets` array
- No feature code changes required (per the extensibility requirement in the content-corpus spec)
- Quiz engine, topic learning, and AI tutor will automatically pick up the new set
