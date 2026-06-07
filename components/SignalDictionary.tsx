import { getCorpus } from "@/lib/corpus";
import { ZONE_STYLES } from "@/lib/zones";
import type { Zone, Segment } from "@/lib/corpus-types";

/** Collects all unique (zone, signal) pairs from all drilled corpus forms. */
function collectSignals(): Map<string, { zone: Zone; signal: string; examples: string[] }> {
  const corpus = getCorpus();
  const map = new Map<string, { zone: Zone; signal: string; examples: string[] }>();

  function addSegment(seg: Segment, form: string) {
    const key = `${seg.zone}::${seg.signal}`;
    if (!map.has(key)) {
      map.set(key, { zone: seg.zone as Zone, signal: seg.signal, examples: [] });
    }
    const entry = map.get(key)!;
    if (!entry.examples.includes(form)) entry.examples.push(form);
  }

  // Verb paradigms
  for (const vp of corpus.verbParadigms) {
    for (const tense of Object.values(vp.tenses)) {
      for (const cell of Object.values(tense)) {
        if (cell) {
          for (const seg of cell.segments) addSegment(seg, cell.form);
        }
      }
    }
  }

  // Noun/pronoun paradigms
  const paradigms = [...corpus.nounParadigms, ...corpus.pronounParadigms, corpus.articleParadigm];
  for (const p of paradigms) {
    for (const cell of Object.values(p.cells)) {
      for (const seg of cell.segments) addSegment(seg, cell.form);
    }
  }

  // John 3:16 words
  for (const word of corpus.john316.words) {
    for (const seg of word.segments) addSegment(seg, word.greek);
  }

  return map;
}

export default function SignalDictionary() {
  const signals = collectSignals();
  const byZone = new Map<Zone, { signal: string; examples: string[] }[]>();

  for (const { zone, signal, examples } of signals.values()) {
    if (!byZone.has(zone)) byZone.set(zone, []);
    byZone.get(zone)!.push({ signal, examples });
  }

  const zoneOrder: Zone[] = ["FRONT", "STEM", "MARKER", "TAIL"];

  return (
    <div className="space-y-6">
      {zoneOrder.map((zone) => {
        const entries = byZone.get(zone) ?? [];
        if (entries.length === 0) return null;
        const style = ZONE_STYLES[zone];
        return (
          <section key={zone}>
            <h3
              className={`text-sm font-semibold uppercase tracking-wide mb-2 px-2 py-1 rounded ${style.bg} ${style.text}`}
            >
              {style.label}
            </h3>
            <ul className="space-y-1">
              {entries.map(({ signal, examples }) => (
                <li key={signal} className="flex items-start gap-3 text-sm">
                  <span className="text-slate-700 flex-1">{signal}</span>
                  <span className="text-slate-400 text-xs greek">
                    {examples.slice(0, 3).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
