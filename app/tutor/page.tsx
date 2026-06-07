import { Suspense } from "react";
import TutorChat from "@/components/TutorChat";

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm">Loading tutor…</div>}>
      <TutorChat />
    </Suspense>
  );
}
