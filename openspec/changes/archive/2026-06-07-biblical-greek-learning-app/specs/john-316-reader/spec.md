## ADDED Requirements

### Requirement: Interactive verse display

The system SHALL display John 3:16 in Greek from the corpus interlinear, formatted readably on mobile, as the course capstone.

#### Scenario: Verse rendered

- **WHEN** a learner opens the John 3:16 reader
- **THEN** the system MUST display the Greek text of John 3:16 from the corpus, rendering polytonic marks correctly

### Requirement: Tap a word to decode it

The reader SHALL let the learner tap any word to reveal its gloss, parse, and morpheme zones (the BREAK direction of morphology-breakdown).

#### Scenario: Word decoded on tap

- **WHEN** a learner taps a word in the verse (e.g. ἠγάπησεν)
- **THEN** the system MUST show its gloss, parse, and morpheme zones with each zone's signal

### Requirement: Cross-links to learning

For each tapped word, the reader SHALL link to the relevant Learn page for its grammar concept and, where the word belongs to a course vocabulary set, indicate which set it was learned in.

#### Scenario: Link from word to grammar topic

- **WHEN** a learner views a tapped verb form's details
- **THEN** the system MUST offer a link to the Learn page for the relevant grammar topic (e.g. ἠγάπησεν → Tenses)

#### Scenario: Vocabulary provenance shown

- **WHEN** a tapped word belongs to a course vocabulary set
- **THEN** the system MUST indicate which vocabulary set it comes from

### Requirement: Words beyond the core sets are shown but flagged

For John 3:16 words that are not in any course vocabulary set (e.g. κόσμον, μονογενῆ, ἔδωκεν, ζωήν), the reader SHALL still show their gloss and morpheme zones so the whole verse is decodable, but SHALL flag them as beyond the core sets, and such words SHALL be excluded from vocabulary quizzes.

#### Scenario: Out-of-set word decoded and flagged

- **WHEN** a learner taps a verse word that is not in any vocabulary set (e.g. ἔδωκεν)
- **THEN** the system MUST show its gloss and morpheme zones and MUST mark it as beyond the core sets

#### Scenario: Out-of-set word excluded from vocab quizzes

- **WHEN** the quiz engine generates a vocabulary quiz
- **THEN** words flagged as beyond the core sets MUST NOT appear as vocabulary questions
