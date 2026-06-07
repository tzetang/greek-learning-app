// ─── Lesson outlines ──────────────────────────────────────────────────────────
//
// The authored half of the "outline + AI narration" e-teacher. Each topic has an
// ordered list of *beats* — the pedagogical steps that build a concept up. The AI
// teacher (see app/api/lesson/route.ts) narrates ONE beat at a time, grounded in
// data/corpus.json, pausing after each so the student can continue, go deeper, or
// ask a question.
//
// Keep `objective` directive but content-light: it tells the model WHAT to focus
// on and WHICH corpus anchors to use — the model supplies the wording, examples,
// and check-in question. Course-faithful definitions live in the corpus glossary
// and are enforced by the route's system prompt.

export interface LessonBeat {
  /** Stable id (unused at runtime today, but handy for analytics / deep-links). */
  id: string;
  /** Short label shown in the lesson-plan rail. */
  title: string;
  /** Instruction to the AI: what to teach in this step, and what to anchor on. */
  objective: string;
}

export interface Lesson {
  topicId: string;
  /** One-line framing the teacher uses to open the lesson. */
  intro: string;
  beats: LessonBeat[];
}

const LESSONS: Lesson[] = [
  {
    topicId: "writing-sound",
    intro:
      "We'll get you reading and pronouncing Greek letters before any grammar — sound first.",
    beats: [
      {
        id: "ws-orient",
        title: "Why a new alphabet",
        objective:
          "Welcome the student and set expectations: Greek uses its own 24-letter alphabet, but many letters look or sound familiar. Reassure them this is the easiest topic. Show 2–3 friendly look-alikes (e.g. Α/α, Β/β, the fact that 'alpha, beta' is where 'alphabet' comes from). Do NOT list all 24 letters yet.",
      },
      {
        id: "ws-letters",
        title: "The letters & sounds",
        objective:
          "Walk through the alphabet in small groups (the easy familiar ones, then the tricky ones like η, ω, χ, ξ, ψ). Give each tricky letter its sound. Keep it to a digestible pass, not a full chart dump. Mention that γ before γ/κ/χ becomes the 'gamma nasal' (ng) sound, referencing the glossary term.",
      },
      {
        id: "ws-breathing",
        title: "Breathing marks",
        objective:
          "Teach rough vs smooth breathing marks using the glossary definitions. A vowel/ρ at the start of a word carries one. Rough = add an 'h' sound; smooth = no 'h'. Example: ἁ vs ἀ. Use a corpus word that starts with a breathing mark.",
      },
      {
        id: "ws-diphthongs",
        title: "Diphthongs",
        objective:
          "Explain diphthongs (two vowels = one sound), per the glossary. Give the common ones (αι, ει, οι, αυ, ευ, ου) with their sounds. Point out one inside a real corpus word.",
      },
      {
        id: "ws-accents",
        title: "Accents & the iota subscript",
        objective:
          "Cover accents (they mark the stressed syllable — reassure beginners they rarely change meaning at this level) and the iota subscript (the little ι written under ᾳ/ῃ/ῳ) using the glossary definitions. Keep it light and non-intimidating.",
      },
      {
        id: "ws-read",
        title: "Read a real word",
        objective:
          "Bring it together: slowly decode a real corpus word such as Ἰησοῦς or ἀγάπη, naming each piece (breathing mark, letters, diphthong, accent) and pronouncing it. Then invite the student to try reading one themselves and confirm they can see the diacritics rendering. This is the recap step.",
      },
    ],
  },
  {
    topicId: "vocabulary-set-1",
    intro:
      "These 24 words are the highest-frequency words in the New Testament — learning them unlocks a huge share of the text.",
    beats: [
      {
        id: "v1-why",
        title: "Why these 24",
        objective:
          "Motivate the set: a tiny number of words covers a large fraction of the NT, so frequency-first learning is efficient. Explain you'll learn them in meaning-clusters rather than alphabetically, which sticks better. Don't list all 24 at once.",
      },
      {
        id: "v1-function",
        title: "Little function words",
        objective:
          "Teach the small high-frequency glue words from Set 1 (articles, conjunctions, particles, common prepositions — whatever Set 1 contains). These are tiny but everywhere. Give a memory hook or two.",
      },
      {
        id: "v1-nouns",
        title: "Key nouns",
        objective:
          "Teach the most important nouns from Set 1 (e.g. θεός, λόγος, and others present). Group by meaning, give the gloss, and a vivid association/cognate where one exists (e.g. λόγος → 'logic').",
      },
      {
        id: "v1-verbs",
        title: "Key verbs & the rest",
        objective:
          "Teach the verbs and any remaining words from Set 1. Give cognate hooks (e.g. a verb that survives in an English word). Keep momentum.",
      },
      {
        id: "v1-recall",
        title: "Quick recall",
        objective:
          "Run a short active-recall check: give 4–6 English glosses and ask the student to produce the Greek (or vice versa), one or two at a time. Encourage them and point them to the Quiz for more. This is the recap step.",
      },
    ],
  },
  {
    topicId: "vocabulary-set-2",
    intro:
      "24 more high-frequency words — building straight on top of Set 1.",
    beats: [
      {
        id: "v2-why",
        title: "Building on Set 1",
        objective:
          "Briefly reconnect to Set 1 and frame Set 2 as the next frequency tier. Note you'll again learn in meaning-clusters. Don't dump the whole list.",
      },
      {
        id: "v2-function",
        title: "Function & connector words",
        objective:
          "Teach the small connective/function words present in Set 2 with memory hooks.",
      },
      {
        id: "v2-nouns",
        title: "Key nouns",
        objective:
          "Teach the important nouns in Set 2, grouped by meaning, with cognate hooks.",
      },
      {
        id: "v2-verbs",
        title: "Key verbs & the rest",
        objective:
          "Teach the verbs and remaining Set 2 words with hooks. Keep momentum.",
      },
      {
        id: "v2-recall",
        title: "Quick recall",
        objective:
          "Active-recall check over Set 2 (4–6 prompts), encourage, and point to the Quiz. This is the recap step.",
      },
    ],
  },
  {
    topicId: "cases",
    intro:
      "The big idea of Greek: a noun's ENDING — not its position — tells you its job in the sentence.",
    beats: [
      {
        id: "cs-bigidea",
        title: "Endings, not word order",
        objective:
          "Teach the central insight: unlike English, Greek signals a noun's role through its case ending, so word order is flexible. Use θεός as the running example and preview that there are four cases to meet. Reference the glossary terms 'Inflection' and 'Declension'.",
      },
      {
        id: "cs-nom",
        title: "Nominative — the subject",
        objective:
          "Teach the nominative case using its glossary definition: it marks the subject. Show θεός (nom sg) and θεοί (nom pl) from the θεός paradigm. Give a tiny example sentence. End by checking they can spot a subject.",
      },
      {
        id: "cs-acc",
        title: "Accusative — the object",
        objective:
          "Teach the accusative using its glossary definition (direct object). Show θεόν / θεούς from the paradigm. Contrast with the nominative just learned (same word, different ending → different job).",
      },
      {
        id: "cs-gen",
        title: "Genitive — 'of'",
        objective:
          "Teach the genitive using its glossary definition (possession / 'of'). Show θεοῦ / θεῶν. Relate to the very common phrase 'of God'.",
      },
      {
        id: "cs-dat",
        title: "Dative — 'to / for'",
        objective:
          "Teach the dative using its glossary definition (indirect object, 'to/for'). Show θεῷ / θεοῖς (note the iota subscript). ",
      },
      {
        id: "cs-together",
        title: "See the whole pattern",
        objective:
          "Bring all four cases together as the full 2nd-declension masculine pattern of θεός (singular and plural). Highlight the morpheme zones — the STEM stays, the TAIL ending changes. This is the recap step; invite a parse-the-ending mini check.",
      },
    ],
  },
  {
    topicId: "pronouns",
    intro:
      "Pronouns ('I', 'you', 'he/she/it') inflect for case just like nouns — so everything from the Cases lesson carries over.",
    beats: [
      {
        id: "pn-what",
        title: "What pronouns do",
        objective:
          "Frame pronouns as stand-ins for nouns that also change by case. Connect back to the four cases. Preview the three you'll meet: ἐγώ, σύ, αὐτός.",
      },
      {
        id: "pn-ego",
        title: "ἐγώ — 'I'",
        objective:
          "Teach the 1st-person pronoun ἐγώ across its cases from the corpus paradigm (I / me / my / to me, singular and plural). Note that Greek often omits 'I' because the verb already shows person, so ἐγώ adds emphasis.",
      },
      {
        id: "pn-su",
        title: "σύ — 'you'",
        objective:
          "Teach the 2nd-person singular pronoun σύ across its cases from the paradigm. Same emphasis note as ἐγώ.",
      },
      {
        id: "pn-autos",
        title: "αὐτός — 'he/she/it'",
        objective:
          "Teach αὐτός from the paradigm: its core 3rd-person use (he/she/it), and mention its other course senses ('same', and the intensive 'himself'). Keep the extra senses brief.",
      },
      {
        id: "pn-spot",
        title: "Spot them in action",
        objective:
          "Recap by showing 1–2 of these pronouns inside short phrases (use John 3:16 if a pronoun appears there) and ask the student to identify the person and case. This is the recap step.",
      },
    ],
  },
  {
    topicId: "verbs",
    intro:
      "A Greek verb is packed with information — who's acting, how many, and more — all carried in its ending.",
    beats: [
      {
        id: "vb-what",
        title: "What a verb carries",
        objective:
          "Teach that a Greek verb encodes person and number (and later tense, voice, mood) in its ending. Introduce the glossary terms 'Parse (a verb)' and 'Conjugate (a verb)' and the difference between them. Use the STEM + TAIL (personal ending) zone idea.",
      },
      {
        id: "vb-eimi",
        title: "εἰμί — 'to be'",
        objective:
          "Teach the present of εἰμί ('I am') from the corpus paradigm, person by person (I am, you are, he/she/it is, …). Flag it as irregular but essential. Keep it to the six forms.",
      },
      {
        id: "vb-echo",
        title: "ἔχω — a regular verb",
        objective:
          "Teach the present of ἔχω ('I have') from the paradigm as the model of a regular -ω verb. Highlight the personal endings (TAIL zone) that you'll see on most verbs. Contrast the regular endings with εἰμί.",
      },
      {
        id: "vb-voice",
        title: "Voice (a preview)",
        objective:
          "Briefly introduce voice using the glossary: active vs middle vs passive — who does vs receives the action. Keep it a light preview; depth comes later. ",
      },
      {
        id: "vb-parse",
        title: "Parse one together",
        objective:
          "Recap by parsing a present-tense form together (person, number, tense, voice, mood — naming each part) using ἔχω or εἰμί. Then invite the student to parse one. This is the recap step.",
      },
    ],
  },
  {
    topicId: "tenses",
    intro:
      "Greek tense tells you WHEN (and how) an action happens. We'll meet them one at a time, then learn to spot the signals.",
    beats: [
      {
        id: "tn-frame",
        title: "What 'tense' means",
        objective:
          "Frame tense for a beginner: it locates an action in time. Preview the five you'll meet (present, future, aorist, perfect, imperfect) without defining all of them yet.",
      },
      {
        id: "tn-present",
        title: "Present & future",
        objective:
          "Teach the present and future tenses using their glossary definitions, with a quick example each. Keep it tight.",
      },
      {
        id: "tn-aorist",
        title: "Aorist — the key past tense",
        objective:
          "Teach the aorist using the EXACT course definition: 'a simple past tense in the indicative mood'. (Do not say 'undefined aspect'.) This is the most important tense in the course. Show the aorist of ἀγαπάω from the paradigm (e.g. ἠγάπησεν) and point out its signal pieces. You may add one sentence of scholarly nuance, clearly flagged as beyond the course.",
      },
      {
        id: "tn-perfimpf",
        title: "Perfect & imperfect",
        objective:
          "Teach the perfect and imperfect using their glossary definitions, with a short example each. Relate them to the past tenses just covered.",
      },
      {
        id: "tn-signals",
        title: "Spot the tense signals",
        objective:
          "Recap by teaching the visible signals: the augment (a FRONT-zone ἐ-/ἠ- on past tenses) and the aorist σα MARKER. Compare πιστεύω present vs aorist from the paradigm so the student SEES the difference. Invite them to identify a tense from its signals. This is the recap step.",
      },
    ],
  },
  {
    topicId: "moods",
    intro:
      "Mood expresses the speaker's stance toward an action — is it a fact, a wish, a command?",
    beats: [
      {
        id: "md-what",
        title: "What 'mood' means",
        objective:
          "Introduce mood as the speaker's attitude/stance toward the action. Preview the moods you'll meet. Keep it conceptual and short.",
      },
      {
        id: "md-ind",
        title: "Indicative — stating facts",
        objective:
          "Teach the indicative mood using its glossary definition (statements / questions of fact). Note it's by far the most common mood, and the one all the earlier tense examples were in.",
      },
      {
        id: "md-subjopt",
        title: "Subjunctive & optative",
        objective:
          "Teach the subjunctive and optative using their glossary definitions (possibility / wish). Use the famous optative μὴ γένοιτο ('May it never be!') as the memorable example.",
      },
      {
        id: "md-imp",
        title: "Imperative — commands",
        objective:
          "Teach the imperative using its glossary definition (commands). Give a simple example.",
      },
      {
        id: "md-nonfinite",
        title: "Infinitive & participle",
        objective:
          "Teach the infinitive and participle using their glossary definitions — the verbal noun and the verbal adjective. Keep it light. This is the recap step; briefly tie the whole mood set together.",
      },
    ],
  },
  {
    topicId: "prepositions",
    intro:
      "A Greek preposition's meaning depends on the CASE of the noun after it — same word, different case, different sense.",
    beats: [
      {
        id: "pp-bigidea",
        title: "Prepositions govern cases",
        objective:
          "Teach the core idea: each preposition takes one or more cases, and the case shapes the meaning. Connect back to the Cases lesson. Preview that some take one case, some take several.",
      },
      {
        id: "pp-gen",
        title: "With the genitive",
        objective:
          "Teach the common genitive-taking prepositions from the corpus (e.g. ἐκ 'out of', ἀπό 'from') with their glosses and a tiny example. Use only what the corpus lists.",
      },
      {
        id: "pp-dat",
        title: "With the dative",
        objective:
          "Teach the dative-taking sense of prepositions from the corpus (e.g. ἐν 'in') with glosses and an example.",
      },
      {
        id: "pp-acc",
        title: "With the accusative",
        objective:
          "Teach the accusative-taking prepositions from the corpus (e.g. εἰς 'into', πρός 'to/toward') with glosses and examples.",
      },
      {
        id: "pp-multi",
        title: "One word, many cases",
        objective:
          "Recap with the multi-case prepositions in the corpus (e.g. διά, κατά, μετά, ἐπί) showing how the meaning shifts with the case. Invite the student to predict a meaning from a case. This is the recap step.",
      },
    ],
  },
];

const LESSON_BY_ID = new Map(LESSONS.map((l) => [l.topicId, l]));

export function getLesson(topicId: string): Lesson | undefined {
  return LESSON_BY_ID.get(topicId);
}

export function hasLesson(topicId: string): boolean {
  return LESSON_BY_ID.has(topicId);
}
