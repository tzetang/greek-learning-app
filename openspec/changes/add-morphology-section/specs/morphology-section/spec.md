## ADDED Requirements

### Requirement: Dedicated morphology destination

The system SHALL provide a dedicated Morphology section reachable as a top-level destination from the home screen, peer to Topics, Quiz, and John 3:16. The section SHALL be a self-contained study-and-drill destination and SHALL NOT require the learner to assemble morphology material from individual topic pages.

#### Scenario: Morphology reachable from home

- **WHEN** a learner opens the home screen
- **THEN** a Morphology entry MUST be present alongside Topics, Quiz, and John 3:16, and selecting it MUST open the Morphology section

### Requirement: Concept scaffold teaches the morpheme model

The section SHALL open with a concept scaffold that teaches the four-zone morpheme model (front/augment · stem · tense-marker · ending) explicitly, using the course's worked example ἀγαπάω → ἠγάπησεν, before presenting drills. The scaffold SHALL reuse the existing zone palette and breakdown engine rather than redefining zones.

#### Scenario: Worked example introduces the zones

- **WHEN** a learner enters the Morphology section
- **THEN** the system MUST show ἀγαπάω → ἠγάπησεν segmented into its zones (augment ἠ · stem ἀγαπα · marker σε · ending ν) with each zone's grammatical signal labelled

### Requirement: Coverage of the exam-named forms

The section SHALL organize its content around the forms the course names for assessment and SHALL cover, at minimum: ἀγαπάω and πιστεύω aorist active indicative (full conjugations), εἰμί and ἔχω present, ἀγαπάω across the five tenses, the θεός second-declension noun and the definite article, and the αὐτός / ἐγώ / σύ personal-pronoun tables.

#### Scenario: Exam-named verb forms present

- **WHEN** a learner browses the section's verb material
- **THEN** the system MUST present the ἀγαπάω and πιστεύω aorist active indicative conjugations, the εἰμί and ἔχω present conjugations, and the five-tense ἀγαπάω forms

#### Scenario: Exam-named nominal forms present

- **WHEN** a learner browses the section's noun/pronoun material
- **THEN** the system MUST present the θεός declension, the definite article, and the αὐτός / ἐγώ / σύ pronoun tables

### Requirement: Five-tense view composes the BUILD engine

The section SHALL present ἀγαπάω across the course's five tenses (present, future, aorist, perfect, imperfect) using the existing BUILD transformation view, showing one representative active-indicative form per tense and highlighting the zones that change between tenses.

#### Scenario: Five tenses shown with changing zones

- **WHEN** a learner views ἀγαπάω across the five tenses
- **THEN** the system MUST show present (ἀγαπάω) → future (ἀγαπήσω) → aorist (ἠγάπησα) → perfect (ἠγάπηκα) → imperfect (ἠγάπων), highlighting the changed zones at each step

### Requirement: Structured parsing trainer

The section SHALL provide a parsing trainer in which the learner identifies a form's full grammatical breakdown by selecting each property from on-screen selectors rather than typing free text. For verb forms the selectable properties SHALL be person, number, tense, voice, and mood; for noun/pronoun forms they SHALL be case, number, and gender. The trainer SHALL grade each property independently.

#### Scenario: Verb form parsed slot by slot

- **WHEN** a learner is shown ἠγάπησεν and selects person, number, tense, voice, and mood
- **THEN** the trainer MUST grade each selected property independently and MUST indicate which individual properties are correct or incorrect

#### Scenario: Noun form parsed slot by slot

- **WHEN** a learner is shown an inflected noun or pronoun form and selects case, number, and gender
- **THEN** the trainer MUST grade each selected property independently

### Requirement: Parsing feedback shows the morpheme breakdown

After a parsing attempt is graded, the trainer SHALL reveal the correct full parse together with the form's morpheme breakdown, reusing the existing four-zone breakdown so the learner connects each parsed property to the morpheme that signals it.

#### Scenario: Breakdown revealed after grading

- **WHEN** a learner submits a parsing attempt
- **THEN** the trainer MUST display the correct full parse and the form's morpheme zones with their signals

### Requirement: Definitions drill for grammatical terms

The section SHALL provide a definitions drill covering the grammatical-term content the course names for assessment: the three voices, the two verbal aspects, the five tenses, and the six moods. Prompts and answers SHALL be drawn from the course's own definitions in the corpus.

#### Scenario: Definitions drilled from course wording

- **WHEN** a learner runs the definitions drill
- **THEN** every prompt and correct answer MUST be the course's own definition of a voice, aspect, tense, or mood as stored in the corpus

### Requirement: Section content is course-faithful and corpus-driven

All forms, conjugations, paradigms, and definitions presented or drilled in the section SHALL be generated from the corpus and SHALL be traceable to the course content; the section SHALL NOT introduce forms or definitions absent from the course. Where a form's accurate analysis exceeds the course altitude, the section SHALL follow the existing breakdown altitude rule (show the simplified zones, add a brief note, and offer a tutor handoff) rather than expanding the breakdown.

#### Scenario: No out-of-course form

- **WHEN** the section renders or quizzes any form or definition
- **THEN** that item MUST be present in the corpus and traceable to the course content

#### Scenario: Above-altitude form handled consistently

- **WHEN** a drilled form's accurate analysis exceeds the course altitude (e.g. the ἠγάπων imperfect contraction)
- **THEN** the section MUST present the simplified zones, add a brief note, and offer a tutor handoff rather than expanding the breakdown
