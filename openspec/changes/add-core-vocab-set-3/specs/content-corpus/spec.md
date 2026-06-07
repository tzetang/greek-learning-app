## MODIFIED Requirements

### Requirement: Corpus models the full course scope

The corpus SHALL represent: vocabulary sets (including Set 3), glossary/grammar terms, verb paradigms (tenses and conjugations), noun cases and declensions, the article, prepositions, the John 3:16 interlinear, and per-form morpheme segmentation.

#### Scenario: Required content types present

- **WHEN** the corpus is loaded
- **THEN** it MUST expose vocabulary sets (ids 1, 2, and 3), grammar term definitions, verb/noun paradigms, prepositions, and the John 3:16 interlinear as structured data

#### Scenario: Drilled forms carry segmentation

- **WHEN** the corpus contains an inflected form that the course drills or that appears in John 3:16
- **THEN** that form MUST include a morpheme segmentation usable by the morphology-breakdown capability

#### Scenario: Set 3 entries are present and complete

- **WHEN** the corpus is loaded
- **THEN** `vocabSets` MUST contain an entry with `id: 3` and exactly 24 vocabulary entries matching the words in `IBG Vocabulary 3.pdf`, each with `greek`, `gloss`, `partOfSpeech`, `setId: 3`, and `source: "IBG Vocabulary 3.pdf"`
