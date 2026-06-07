import type { NounParadigm } from "@/lib/corpus-types";
import { ZONE_STYLES } from "@/lib/zones";

interface Props {
  paradigm: NounParadigm;
}

const CASES = ["nom", "acc", "dat", "gen"] as const;
const CASE_LABELS: Record<string, string> = {
  nom: "Nom",
  acc: "Acc",
  dat: "Dat",
  gen: "Gen",
};

export default function NounTable({ paradigm }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="text-sm font-semibold text-slate-700 mb-2">
        <span className="greek">{paradigm.lemma}</span>
        {" "}— {paradigm.gloss}
        <span className="text-slate-400 font-normal ml-2 text-xs">({paradigm.declension})</span>
      </div>
      <table className="text-sm border-collapse w-full">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-slate-500 px-2 py-1 border-b border-slate-200" />
            <th className="text-center text-xs font-medium text-slate-500 px-3 py-1 border-b border-slate-200">Singular</th>
            <th className="text-center text-xs font-medium text-slate-500 px-3 py-1 border-b border-slate-200">Plural</th>
          </tr>
        </thead>
        <tbody>
          {CASES.map((c) => {
            const sg = paradigm.cells[`${c}_sg`];
            const pl = paradigm.cells[`${c}_pl`];
            return (
              <tr key={c} className="border-b border-slate-100 last:border-0">
                <td className="px-2 py-1.5 text-xs text-slate-500 font-medium">{CASE_LABELS[c]}</td>
                <td className="px-3 py-1.5 text-center">
                  {sg ? (
                    <span className="greek font-medium text-slate-800">{sg.form}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-3 py-1.5 text-center">
                  {pl ? (
                    <span className="greek font-medium text-slate-800">{pl.form}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
