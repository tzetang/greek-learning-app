## ADDED Requirements

### Requirement: Verb cells carry full parsing metadata

Each verb paradigm cell in the corpus SHALL carry explicit grammatical metadata for every property the structured parsing trainer grades: person, number, tense, voice, and mood. This metadata SHALL be stored as structured data (not parsed from a free-text label) so the parsing trainer can grade each property independently and generate selectors from it.

#### Scenario: Verb cell exposes parse properties

- **WHEN** a verb paradigm cell is loaded from the corpus
- **THEN** it MUST expose its person, number, tense, voice, and mood as discrete fields

#### Scenario: Parsing trainer reads metadata, not labels

- **WHEN** the parsing trainer needs the correct parse of a verb form
- **THEN** it MUST read the discrete person/number/tense/voice/mood fields from the corpus rather than splitting a combined label string

### Requirement: Corpus stores ἀγαπάω across the five tenses

The corpus SHALL store ἀγαπάω's five-tense representative forms — one active-indicative form per course tense — verbatim from the course: present ἀγαπάω ("I love"), future ἀγαπήσω ("I will love"), aorist ἠγάπησα ("I loved"), perfect ἠγάπηκα ("I have loved"), and imperfect ἠγάπων ("I was loving"). Each SHALL carry a morpheme segmentation usable by the morphology-breakdown capability.

#### Scenario: Five-tense forms available from corpus

- **WHEN** a feature requests ἀγαπάω across the five tenses
- **THEN** the corpus MUST return the present, future, aorist, perfect, and imperfect forms above, each with its morpheme segmentation

#### Scenario: Five-tense forms trace to course content

- **WHEN** the ἀγαπάω five-tense forms are reviewed against `content/`
- **THEN** each form and its translation MUST match the course's own presentation (the Week 6 exercises) and MUST NOT be drawn from an out-of-course paradigm
