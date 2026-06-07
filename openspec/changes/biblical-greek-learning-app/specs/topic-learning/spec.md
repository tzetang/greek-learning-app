## ADDED Requirements

### Requirement: Per-topic Learn pages from the corpus

The system SHALL provide a Learn page for each course topic — vocabulary sets, noun cases and declensions, the article, verb tenses, moods, prepositions, and writing/sound (transliteration, breathing marks, gamma nasal, iota subscript, diphthongs) — with content rendered from the corpus.

#### Scenario: Browsing topics

- **WHEN** a learner opens the topics list
- **THEN** the system MUST list every course topic and open a Learn page rendered from the corpus for the selected topic

#### Scenario: Learn page matches course definitions

- **WHEN** a Learn page presents a grammatical concept the course simplifies
- **THEN** it MUST present the course's simplified definition from the corpus, not a scholarly alternative

### Requirement: Grammar Learn pages embed the transformation view

Learn pages for inflected topics (tenses, moods, cases, declensions, the article) SHALL embed the morphology-breakdown BUILD view so the learner sees how roots transform.

#### Scenario: Tenses Learn page shows transformation

- **WHEN** a learner opens the Tenses Learn page
- **THEN** it MUST include the transformation stepper for a course paradigm (e.g. ἀγαπάω) with zone highlighting

### Requirement: Learn–Ask–Quiz loop

Each topic SHALL link from its Learn page to (a) ask the AI tutor about that topic and (b) start a quiz scoped to that topic.

#### Scenario: Jump from Learn to Quiz

- **WHEN** a learner is on a topic's Learn page
- **THEN** the system MUST offer a one-tap action to start a quiz scoped to that topic

#### Scenario: Jump from Learn to Tutor

- **WHEN** a learner is on a topic's Learn page
- **THEN** the system MUST offer a one-tap action to ask the tutor about that topic, with the topic provided as context
