# content-corpus Specification

## Purpose
TBD - created by archiving change biblical-greek-learning-app. Update Purpose after archive.
## Requirements
### Requirement: Corpus is built only from course content

The corpus SHALL be derived exclusively from the files in `content/`. No vocabulary, definition, paradigm, or example that does not originate from `content/` SHALL be added to the corpus.

#### Scenario: Vocabulary entry traces to content

- **WHEN** a vocabulary item appears in the corpus
- **THEN** it MUST originate from one of the course vocabulary sets in `content/` (e.g. Core Vocabulary 1, the week vocabulary lists)

#### Scenario: No out-of-scope material

- **WHEN** the corpus is reviewed against `content/`
- **THEN** every grammar definition, paradigm, preposition, and example MUST be traceable to a source file in `content/`, and items with no such source MUST NOT be present

### Requirement: Corpus is the single source of truth

All app features (topic learning, quiz engine, John 3:16 reader, AI tutor grounding) SHALL read their data from the corpus, and no feature SHALL hard-code course data outside the corpus.

#### Scenario: Feature reads from corpus

- **WHEN** any feature needs vocabulary, definitions, paradigms, or verse data
- **THEN** it MUST obtain that data from the corpus rather than an independent copy

### Requirement: Corpus preserves course-faithful definitions

The corpus SHALL store the course's own simplified definitions verbatim in meaning (e.g. aorist defined as "a simple past tense in the indicative mood for this course"), so that all features present the course's altitude rather than scholarly alternatives.

#### Scenario: Simplified definition retained

- **WHEN** the corpus stores the definition of a grammatical concept that the course simplifies
- **THEN** it MUST store the course's simplified definition and mark it as the course-faithful definition

### Requirement: Corpus models the full course scope

The corpus SHALL represent: vocabulary sets, glossary/grammar terms, verb paradigms (tenses and conjugations), noun cases and declensions, the article, prepositions, the John 3:16 interlinear, and per-form morpheme segmentation.

#### Scenario: Required content types present

- **WHEN** the corpus is loaded
- **THEN** it MUST expose vocabulary sets, grammar term definitions, verb/noun paradigms, prepositions, and the John 3:16 interlinear as structured data

#### Scenario: Drilled forms carry segmentation

- **WHEN** the corpus contains an inflected form that the course drills or that appears in John 3:16
- **THEN** that form MUST include a morpheme segmentation usable by the morphology-breakdown capability

### Requirement: Corpus is extensible without code changes

The corpus SHALL allow new vocabulary sets and content to be added by editing data files only, without modifying feature code, so the two not-yet-provided vocabulary sets can be added later.

#### Scenario: Adding a future vocabulary set

- **WHEN** a new vocabulary set is appended to the corpus data
- **THEN** that set MUST become selectable in the quiz engine, browsable in topic learning, and available to the tutor without any feature-code change

