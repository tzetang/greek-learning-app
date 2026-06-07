import { Suspense } from "react";
import QuizEngine from "@/components/QuizEngine";

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">Loading quiz…</div>}>
      <QuizEngine />
    </Suspense>
  );
}
