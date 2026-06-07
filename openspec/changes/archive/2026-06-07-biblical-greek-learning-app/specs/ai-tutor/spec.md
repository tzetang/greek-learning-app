## ADDED Requirements

### Requirement: OpenAI-compatible endpoint via server-side proxy

The AI tutor SHALL call a configurable OpenAI-compatible chat endpoint through a server-side route, and the API key SHALL never be exposed to the browser.

#### Scenario: Request proxied server-side

- **WHEN** a learner sends a message to the tutor
- **THEN** the request MUST be routed through the server-side proxy and the API key MUST NOT appear in any client response or network payload to the browser

#### Scenario: Endpoint is configurable

- **WHEN** the deployment sets the base URL, API key, and model via environment variables
- **THEN** the tutor MUST use those values and MUST work with any OpenAI-compatible provider (hosted or local)

### Requirement: Grounded in and fenced to the corpus

The tutor SHALL be grounded in the corpus and SHALL stay within the course content scope, declining or flagging requests that go beyond what `content/` covers.

#### Scenario: Answer uses corpus

- **WHEN** a learner asks about a word or concept in the course
- **THEN** the tutor's answer MUST be based on the corpus data provided as context

#### Scenario: Out-of-scope request flagged

- **WHEN** a learner asks about material not covered in `content/`
- **THEN** the tutor MUST indicate it is outside the course scope rather than presenting it as course material

### Requirement: Course-faithful answers

The tutor SHALL defer to the course's simplified definitions and SHALL explicitly flag when it is simplifying or when a fuller scholarly explanation would differ from the course.

#### Scenario: Defers to course definition

- **WHEN** a learner asks about a concept the course simplifies (e.g. the aorist)
- **THEN** the tutor MUST give the course's definition first and MUST flag any scholarly nuance as beyond the course

### Requirement: Streaming responses

The tutor SHALL stream its responses to the client as they are generated.

#### Scenario: Response streams

- **WHEN** the tutor generates an answer
- **THEN** the client MUST display the answer incrementally as it streams

### Requirement: Available globally and per-topic

The tutor SHALL be reachable both as a global "ask anything" interface and from within a topic (with that topic supplied as context).

#### Scenario: Topic-scoped question

- **WHEN** a learner opens the tutor from a topic's Learn page
- **THEN** the tutor MUST receive that topic as context for the conversation
