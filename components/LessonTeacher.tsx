"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getLesson } from "@/lib/lessons";
import Markdown from "@/components/Markdown";

// A turn in the lesson transcript. We keep the full back-and-forth (including the
// synthetic "advance"/"deeper" signals) so the model has continuity, but only
// render the turns we want the student to actually see (`show`).
interface Turn {
  role: "user" | "assistant";
  content: string;
  show: boolean;
  /** assistant narration that opens a new step → render a step divider before it */
  stepStart?: boolean;
  /** which beat this turn relates to (for the divider label) */
  beat: number;
}

type Trigger =
  | { kind: "begin"; targetBeat: number }
  | { kind: "advance"; targetBeat: number }
  | { kind: "deeper"; targetBeat: number }
  | { kind: "question"; targetBeat: number; text: string };

const SIGNAL_TEXT: Record<Exclude<Trigger["kind"], "question">, string> = {
  begin: "Let's begin the lesson.",
  advance: "Got it — let's go to the next step.",
  deeper: "Can you explain that a bit more, with another example?",
};

export default function LessonTeacher({
  topicId,
  topicTitle,
}: {
  topicId: string;
  topicTitle: string;
}) {
  const lesson = getLesson(topicId);
  const beats = lesson?.beats ?? [];

  const [turns, setTurns] = useState<Turn[]>([]);
  const [beat, setBeat] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const isLastBeat = beats.length > 0 && beat >= beats.length - 1;
  // The closing card should only appear once the final step has actually been taught.
  const lastBeatTaught =
    isLastBeat && turns.some((t) => t.role === "assistant" && t.beat === beat && t.content !== "");

  // Kick off the first step on mount (guard against React strict-mode double-run).
  useEffect(() => {
    if (startedRef.current || beats.length === 0) return;
    startedRef.current = true;
    run({ kind: "begin", targetBeat: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, streaming]);

  async function run(trigger: Trigger) {
    if (streaming) return;
    setError(null);

    const userContent =
      trigger.kind === "question" ? trigger.text.trim() : SIGNAL_TEXT[trigger.kind];
    if (!userContent) return;

    const target = trigger.targetBeat;
    const stepStart = trigger.kind === "begin" || trigger.kind === "advance";

    const userTurn: Turn = {
      role: "user",
      content: userContent,
      show: trigger.kind === "question",
      beat: target,
    };
    const history = [...turns, userTurn];

    setTurns([
      ...history,
      { role: "assistant", content: "", show: true, stepStart, beat: target },
    ]);
    setBeat(target);
    setStreaming(true);

    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          beatIndex: target,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assembled += parsed.content;
              setTurns((prev) => [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], content: assembled },
              ]);
            }
          } catch {}
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setTurns((prev) => prev.slice(0, -1)); // drop the empty assistant placeholder
    } finally {
      setStreaming(false);
    }
  }

  function askQuestion() {
    const text = question.trim();
    if (!text || streaming) return;
    setQuestion("");
    run({ kind: "question", targetBeat: beat, text });
  }

  if (!lesson) {
    return (
      <p className="text-sm text-slate-400">
        No guided lesson for this topic yet — try the Reference tab.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Lesson plan rail */}
      <div className="rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Lesson plan
          </span>
          <span className="text-xs text-slate-400">
            Step {beat + 1} of {beats.length}
          </span>
        </div>
        <ol className="space-y-1.5">
          {beats.map((b, i) => {
            const done = i < beat;
            const current = i === beat;
            return (
              <li key={b.id} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold shrink-0 ${
                    done
                      ? "bg-green-100 text-green-700"
                      : current
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={
                    current
                      ? "font-medium text-slate-800"
                      : done
                        ? "text-slate-400"
                        : "text-slate-500"
                  }
                >
                  {b.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Transcript */}
      <div className="space-y-4">
        {turns
          .filter((t) => t.show)
          .map((t, i) => (
            <div key={i}>
              {t.role === "assistant" && t.stepStart && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-600">
                    Step {t.beat + 1} · {beats[t.beat]?.title}
                  </span>
                  <span className="flex-1 h-px bg-slate-100" />
                </div>
              )}
              <div className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                    t.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm whitespace-pre-wrap"
                      : "bg-slate-100 text-slate-800 rounded-bl-sm"
                  }`}
                >
                  {t.role === "user" ? (
                    t.content
                  ) : t.content ? (
                    <Markdown>{t.content}</Markdown>
                  ) : (
                    <span className="inline-flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
            <button
              onClick={() => run({ kind: "begin", targetBeat: beat })}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Controls */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        {lastBeatTaught ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              🎉 That&rsquo;s the full walkthrough of <strong>{topicTitle}</strong>. Nice work! Lock
              it in with a quiz, or keep asking below.
            </div>
            <div className="flex gap-2">
              <Link
                href={`/quiz?topic=${topicId}`}
                className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Quiz yourself
              </Link>
              <button
                onClick={() => run({ kind: "deeper", targetBeat: beat })}
                disabled={streaming}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Go deeper
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => run({ kind: "advance", targetBeat: beat + 1 })}
              disabled={streaming}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Got it — next step →
            </button>
            <button
              onClick={() => run({ kind: "deeper", targetBeat: beat })}
              disabled={streaming}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Go deeper
            </button>
          </div>
        )}

        {/* Ask about this step */}
        <div className="flex gap-2 items-end">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askQuestion();
              }
            }}
            placeholder="Ask about this step…"
            rows={1}
            disabled={streaming}
            className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50 transition-colors"
          />
          <button
            onClick={askQuestion}
            disabled={streaming || question.trim() === ""}
            className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors shrink-0"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
