"use client";

import { useState } from "react";
import { hasLesson } from "@/lib/lessons";
import LessonTeacher from "@/components/LessonTeacher";

/**
 * Switches a topic between the proactive guided Lesson (the e-teacher) and the
 * static Reference content. The reference is rendered on the server and passed in
 * as `reference`, so it stays a fast server component.
 */
export default function TopicTabs({
  topicId,
  topicTitle,
  reference,
}: {
  topicId: string;
  topicTitle: string;
  reference: React.ReactNode;
}) {
  const [tab, setTab] = useState<"lesson" | "reference">(
    hasLesson(topicId) ? "lesson" : "reference"
  );

  // No guided lesson authored → just show the reference, no tabs.
  if (!hasLesson(topicId)) {
    return <>{reference}</>;
  }

  return (
    <div>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
        {(
          [
            ["lesson", "Guided lesson"],
            ["reference", "Reference"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "lesson" ? (
        <LessonTeacher topicId={topicId} topicTitle={topicTitle} />
      ) : (
        reference
      )}
    </div>
  );
}
