import { notFound } from "next/navigation";
import Link from "next/link";
import { TOPICS } from "@/lib/topics";
import { getCorpus } from "@/lib/corpus";
import BuildStepper from "@/components/BuildStepper";
import BreakView from "@/components/BreakView";
import TopicTabs from "@/components/TopicTabs";
import type { Metadata } from "next";

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topicId: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicId: string }>;
}): Promise<Metadata> {
  const { topicId } = await params;
  const topic = TOPICS.find((t) => t.id === topicId);
  return { title: topic ? `${topic.title} — Biblical Greek` : "Topic" };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function TopicLearnPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) notFound();

  const corpus = getCorpus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/topics" className="text-sm text-blue-600 hover:underline">
          ← Topics
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-800">{topic.title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{topic.description}</p>
      </div>

      {/* Guided lesson (e-teacher) with the static reference as a fallback tab */}
      <TopicTabs
        topicId={topicId}
        topicTitle={topic.title}
        reference={<TopicContent topicId={topicId} corpus={corpus} />}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <Link
          href={`/quiz?topic=${topicId}`}
          className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Quiz on this topic
        </Link>
        <Link
          href={`/tutor?topic=${encodeURIComponent(topic.title)}`}
          className="flex-1 text-center px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Ask the Tutor
        </Link>
      </div>
    </div>
  );
}

// ─── Topic content components ─────────────────────────────────────────────────

function TopicContent({
  topicId,
  corpus,
}: {
  topicId: string;
  corpus: ReturnType<typeof getCorpus>;
}) {
  switch (topicId) {
    case "writing-sound":
      return <WritingSoundContent corpus={corpus} />;
    case "vocabulary-set-1":
      return <VocabContent setId={1} corpus={corpus} />;
    case "vocabulary-set-3":
      return <VocabContent setId={3} corpus={corpus} />;
    case "cases":
      return <CasesContent corpus={corpus} />;
    case "pronouns":
      return <PronounsContent corpus={corpus} />;
    case "verbs":
      return <VerbsContent corpus={corpus} />;
    case "tenses":
      return <TensesContent corpus={corpus} />;
    case "moods":
      return <MoodsContent corpus={corpus} />;
    case "prepositions":
      return <PrepositionsContent corpus={corpus} />;
    default:
      return <p className="text-slate-400">Content coming soon.</p>;
  }
}

function WritingSoundContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  const terms = corpus.glossary.filter((g) => g.category === "writing");
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Greek uses a 24-letter alphabet. Each letter has a name and corresponds to an English
        sound. Polytonic Greek uses diacritical marks to indicate pronunciation.
      </p>
      <div className="space-y-3">
        {terms.map((t) => (
          <div key={t.term} className="rounded-lg border border-slate-200 p-3">
            <div className="font-semibold text-slate-800">{t.term}</div>
            <div className="text-sm text-slate-600 mt-0.5">{t.definition}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
        <strong>Rendering check:</strong>{" "}
        <span className="greek text-lg">ἀγάπη · ηὑρέθη · ᾄδω · ἄγγελος · Ἰησοῦς</span>
        <br />
        If you see breathing marks, accents, and the iota subscript above, your device renders
        polytonic Greek correctly.
      </div>
    </div>
  );
}

function VocabContent({
  setId,
  corpus,
}: {
  setId: number;
  corpus: ReturnType<typeof getCorpus>;
}) {
  const vocabSet = corpus.vocabSets.find((s) => s.id === setId);
  if (!vocabSet) return null;
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-500">
        {vocabSet.entries.length} words from <em>{vocabSet.name}</em>.
      </p>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
        {vocabSet.entries.map((entry) => (
          <div key={entry.greek} className="flex items-baseline gap-3 px-4 py-2.5">
            <span className="greek text-lg font-medium text-slate-900 w-28 shrink-0">
              {entry.greek}
            </span>
            <span className="text-sm text-slate-600">{entry.gloss}</span>
            <span className="text-xs text-slate-400 ml-auto shrink-0">{entry.partOfSpeech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CasesContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  const caseTerms = corpus.glossary.filter(
    (g) => g.category === "cases" || g.category === "grammar"
  );
  const noun = corpus.nounParadigms[0]; // θεός as example

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {caseTerms
          .filter((t) => t.category === "cases")
          .map((t) => (
            <div key={t.term} className="rounded-lg border border-slate-200 p-3">
              <div className="font-semibold text-slate-800">{t.term}</div>
              <div className="text-sm text-slate-600 mt-0.5">{t.definition}</div>
            </div>
          ))}
      </div>

      {/* 2nd declension endings table */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          2nd Declension Masculine — <span className="greek">θεός</span> (God)
        </h3>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-slate-500 font-medium">Case</th>
                <th className="px-3 py-2 text-left text-slate-500 font-medium">Singular</th>
                <th className="px-3 py-2 text-left text-slate-500 font-medium">Plural</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {["nom", "acc", "dat", "gen"].map((c) => (
                <tr key={c}>
                  <td className="px-3 py-2 text-slate-600 capitalize">{c}.</td>
                  <td className="px-3 py-2 greek text-slate-900">
                    {noun.cells[`${c}_sg`]?.form ?? "—"}
                  </td>
                  <td className="px-3 py-2 greek text-slate-900">
                    {noun.cells[`${c}_pl`]?.form ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Morpheme breakdown for example forms */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Morpheme zones — nominative singular
        </h3>
        {noun.cells["nom_sg"] && (
          <BreakView
            form={noun.cells["nom_sg"].form}
            segments={noun.cells["nom_sg"].segments}
            lemma={noun.lemma}
          />
        )}
      </div>
    </div>
  );
}

function PronounsContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  return (
    <div className="space-y-6">
      {corpus.pronounParadigms.map((p) => (
        <div key={p.lemma}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            <span className="greek">{p.lemma}</span> — {p.gloss} ({p.declension})
          </h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Case</th>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Singular</th>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Plural</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {["nom", "acc", "dat", "gen"].map((c) => (
                  <tr key={c}>
                    <td className="px-3 py-2 text-slate-600 capitalize">{c}.</td>
                    <td className="px-3 py-2 greek text-slate-900">
                      {p.cells[`${c}_sg`]?.form ?? "—"}
                    </td>
                    <td className="px-3 py-2 greek text-slate-900">
                      {p.cells[`${c}_pl`]?.form ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerbsContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  const verbTerms = corpus.glossary.filter(
    (g) => g.category === "grammar" && ["Parse (a verb)", "Conjugate (a verb)"].includes(g.term)
  );
  const voiceTerms = corpus.glossary.filter((g) => g.category === "voice");
  const presentVerbs = corpus.verbParadigms.filter((v) =>
    Object.keys(v.tenses).some((t) => t.toLowerCase().includes("present"))
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        {[...verbTerms, ...voiceTerms].map((t) => (
          <div key={t.term} className="rounded-lg border border-slate-200 p-3">
            <div className="font-semibold text-slate-800">{t.term}</div>
            <div className="text-sm text-slate-600 mt-0.5">{t.definition}</div>
          </div>
        ))}
      </div>

      {presentVerbs.map((vp) => (
        <div key={vp.lemma}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            <span className="greek">{vp.lemma}</span> — {vp.gloss}
          </h3>
          <BuildStepper paradigm={vp} />
        </div>
      ))}
    </div>
  );
}

function TensesContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  const tenseTerms = corpus.glossary.filter((g) => g.category === "tenses");
  const aoristvb = corpus.verbParadigms.find((v) => v.lemma === "ἀγαπάω");
  const pisteuoVb = corpus.verbParadigms.find((v) => v.lemma === "πιστεύω");

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {tenseTerms.map((t) => (
          <div key={t.term} className="rounded-lg border border-slate-200 p-3">
            <div className="font-semibold text-slate-800">{t.term}</div>
            <div className="text-sm text-slate-600 mt-0.5">{t.definition}</div>
          </div>
        ))}
      </div>

      {aoristvb && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Aorist active — <span className="greek">{aoristvb.lemma}</span> ({aoristvb.gloss})
          </h3>
          <BuildStepper paradigm={aoristvb} />
        </div>
      )}

      {pisteuoVb && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            <span className="greek">{pisteuoVb.lemma}</span> ({pisteuoVb.gloss}) — present & aorist
          </h3>
          <BuildStepper paradigm={pisteuoVb} />
        </div>
      )}
    </div>
  );
}

function MoodsContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  const moodTerms = corpus.glossary.filter((g) => g.category === "moods");
  return (
    <div className="space-y-3">
      {moodTerms.map((t) => (
        <div key={t.term} className="rounded-lg border border-slate-200 p-3">
          <div className="font-semibold text-slate-800">{t.term}</div>
          <div className="text-sm text-slate-600 mt-0.5">{t.definition}</div>
        </div>
      ))}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Optative example:</strong>{" "}
        <span className="greek">μὴ γένοιτο</span> — "May it never be!" (Paul's emphatic denial)
      </div>
    </div>
  );
}

function PrepositionsContent({ corpus }: { corpus: ReturnType<typeof getCorpus> }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Greek prepositions govern specific cases. The case after the preposition changes its meaning.
      </p>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
        {corpus.prepositions.map((prep) => (
          <div key={prep.greek} className="px-4 py-2.5 grid grid-cols-[auto_1fr] gap-3">
            <span className="greek text-lg font-medium text-slate-900 w-20 shrink-0">
              {prep.greek}
            </span>
            <div className="text-sm text-slate-600">
              {prep.cases.map((c, i) => (
                <span key={c}>
                  <span className="text-slate-400">{c}:</span> {prep.glosses[i]}
                  {i < prep.cases.length - 1 && " · "}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
