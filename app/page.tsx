import Link from "next/link";

const SECTIONS = [
  {
    href: "/topics",
    title: "Topics",
    desc: "Vocabulary, grammar, cases, tenses, moods, and prepositions",
  },
  {
    href: "/quiz",
    title: "Quiz",
    desc: "Practice recognition, production, parsing, and paradigm drills",
  },
  {
    href: "/morphology",
    title: "Morphology",
    desc: "Zone model, verb/noun paradigms, parsing trainer, and definitions drill",
  },
  {
    href: "/john-316",
    title: "John 3:16",
    desc: "Tap each word of the verse to decode its meaning and grammar",
  },
  {
    href: "/tutor",
    title: "AI Tutor",
    desc: "Ask questions grounded in your course material",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold text-slate-800 greek mb-2">
          Ἑλληνικά
        </h1>
        <p className="text-slate-500 text-sm">Biblical Greek Learning App</p>
      </div>

      <div className="grid gap-3">
        {SECTIONS.map(({ href, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-slate-800">{title}</div>
            <div className="text-sm text-slate-500 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
