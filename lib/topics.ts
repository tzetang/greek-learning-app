export interface TopicMeta {
  id: string;
  title: string;
  description: string;
  hasParadigm: boolean; // whether to embed the BUILD stepper
}

export const TOPICS: TopicMeta[] = [
  {
    id: "writing-sound",
    title: "Writing & Sound",
    description: "Greek alphabet, transliteration, diphthongs, breathing marks, and accents",
    hasParadigm: false,
  },
  {
    id: "vocabulary-set-1",
    title: "Vocabulary — Set 1",
    description: "The 24 most frequent New Testament words",
    hasParadigm: false,
  },
  {
    id: "vocabulary-set-3",
    title: "Vocabulary — Set 3",
    description: "24 more high-frequency New Testament words",
    hasParadigm: false,
  },
  {
    id: "cases",
    title: "Cases & Declension",
    description: "Nominative, accusative, dative, genitive — and the 2nd declension masculine pattern",
    hasParadigm: true,
  },
  {
    id: "pronouns",
    title: "Pronouns",
    description: "Personal pronouns (1st, 2nd, 3rd person) and the demonstrative αὐτός",
    hasParadigm: true,
  },
  {
    id: "verbs",
    title: "Verbs (Present)",
    description: "Introduction to verbs; εἰμί and ἔχω present paradigms; parsing",
    hasParadigm: true,
  },
  {
    id: "tenses",
    title: "Tenses",
    description: "Present, future, aorist, perfect, and imperfect — with the aorist active paradigm",
    hasParadigm: true,
  },
  {
    id: "moods",
    title: "Moods",
    description: "Indicative, subjunctive, optative, imperative, infinitive, and participle",
    hasParadigm: false,
  },
  {
    id: "prepositions",
    title: "Prepositions",
    description: "Greek prepositions and the cases they govern",
    hasParadigm: false,
  },
];
