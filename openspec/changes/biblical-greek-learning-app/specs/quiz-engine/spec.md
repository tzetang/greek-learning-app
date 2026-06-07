## ADDED Requirements

### Requirement: Topic-level component selection

The quiz engine SHALL let the learner choose which components to be quizzed on at topic-level granularity (e.g. a vocabulary set, a tense, the cases) and SHALL allow selecting multiple components for a single quiz.

#### Scenario: Single-topic quiz

- **WHEN** a learner selects one topic (e.g. Vocabulary Set 2) and starts a quiz
- **THEN** the quiz MUST contain only questions drawn from that topic

#### Scenario: Multi-topic quiz

- **WHEN** a learner selects several topics
- **THEN** the quiz MUST contain questions drawn from across the selected topics

### Requirement: Valid formats only

The quiz engine SHALL offer only question formats that are valid for the current selection and SHALL never present a format that does not apply to a selected component (e.g. no "decline" for a tense, no "parse" for a preposition).

#### Scenario: Invalid format hidden

- **WHEN** a learner selects a component that supports only certain formats
- **THEN** the engine MUST present only the valid formats and MUST NOT offer inapplicable ones

### Requirement: Select-all is a mock exam

The quiz engine SHALL treat selecting all available components as a full mock exam spanning vocabulary and grammar.

#### Scenario: Full mock exam

- **WHEN** a learner selects all components and starts a quiz
- **THEN** the engine MUST generate a quiz spanning all selected vocabulary and grammar components

### Requirement: Auto-grading with morpheme feedback

The quiz engine SHALL grade answers automatically and, for grammar/inflection questions, SHALL show the morpheme breakdown of the correct form as feedback.

#### Scenario: Grade and explain a parsing answer

- **WHEN** a learner submits an answer to a parsing or inflection question
- **THEN** the engine MUST mark it correct or incorrect and MUST show the correct form's morpheme zones as feedback

### Requirement: Greek production answers accepted

For production-format questions, the engine SHALL accept Greek typed with the device's Greek keyboard and SHALL grade it correctly regardless of insignificant differences the course does not assess (e.g. accents).

#### Scenario: Typed Greek answer graded

- **WHEN** a learner types a Greek answer for a production question
- **THEN** the engine MUST grade it against the corpus form, ignoring differences the course does not assess

### Requirement: Questions generated only from corpus

Every quiz question, option, and correct answer SHALL be generated from the corpus.

#### Scenario: No out-of-corpus question

- **WHEN** a quiz is generated
- **THEN** every question and answer MUST be derived from corpus data

### Requirement: Repeatable quizzing without habit features

Quizzes SHALL be repeatable on demand and the engine SHALL remember the learner's last selection, but the system SHALL NOT include streaks, reminders, or scheduled-repetition habit features.

#### Scenario: Last selection remembered

- **WHEN** a learner returns to the quiz engine
- **THEN** the engine MUST restore the previous component and format selection

#### Scenario: No habit mechanics

- **WHEN** the app is used over time
- **THEN** it MUST NOT present streaks, daily reminders, or push notifications
