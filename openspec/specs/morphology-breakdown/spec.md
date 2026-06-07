# morphology-breakdown Specification

## Purpose
TBD - created by archiving change biblical-greek-learning-app. Update Purpose after archive.
## Requirements
### Requirement: Four-zone morpheme model

The system SHALL represent each drilled inflected form as an ordered sequence of morpheme segments, each tagged with a zone type from a fixed palette: front markers (augment, reduplication, or compound prefix), stem, tense/aspect marker, and ending (verb person+number or noun case+number). Each segment SHALL carry the grammatical signal it broadcasts.

#### Scenario: Verb form segmented into zones

- **WHEN** the form ἠγάπησεν is displayed
- **THEN** it MUST be shown as augment (ἠ → past) · stem (γαπη → "love") · marker (σ → aorist) · ending (εν → 3rd singular)

#### Scenario: Noun form segmented into zones

- **WHEN** an inflected noun form such as κόσμον is displayed
- **THEN** it MUST be shown as stem (κοσμ → "world") · ending (ον → accusative / direct object)

### Requirement: BREAK direction decodes a form to its root

The system SHALL let a learner take an inflected form and reveal its zones, the signal of each zone, and the lexical (dictionary) form of its stem.

#### Scenario: Decode reveals lexeme and features

- **WHEN** a learner inspects an inflected form
- **THEN** the system MUST display each zone with its signal and MUST link the stem to its lexical form and meaning in the corpus

### Requirement: BUILD direction shows the transformation

The system SHALL provide a transformation view that takes a lexical form and shows, step by step, how zones are added or changed to produce other forms (e.g. across tenses), highlighting only the zones that change at each step.

#### Scenario: Transformation stepper across tenses

- **WHEN** a learner views the transformation of ἀγαπάω across the course tenses
- **THEN** the system MUST show present → future (+σ) → aorist (augment + σ) → perfect (augment + κ) → imperfect (augment, no σ), highlighting the changed zones at each step

### Requirement: Signal dictionary

The system SHALL maintain a learner-facing reference of recurring morpheme signals (e.g. ἐ- or a lengthened initial vowel = augment = past; -σ- = future/aorist; -κ- = perfect; noun endings -ος/-ον/-ου/-ῳ = subject/object/of/to-for) drawn from the forms in the corpus.

#### Scenario: Signal reference available

- **WHEN** a learner opens the signal dictionary
- **THEN** the system MUST list the recurring zone signals with an example form from the corpus for each

### Requirement: Breakdown stays at the course altitude

Morpheme breakdowns SHALL match the course's simplified level (front/stem/marker/ending; aorist labelled "simple past"). Where a form involves complexity beyond that level (e.g. contract-vowel fusion, irregular stems), the system SHALL show a short note and offer a handoff to the AI tutor rather than expanding the breakdown.

#### Scenario: Complex form handed off

- **WHEN** a form's accurate analysis exceeds the course altitude (e.g. ἠγάπων imperfect contraction)
- **THEN** the system MUST present the simplified zones, add a brief note, and offer to ask the tutor for the detailed explanation

