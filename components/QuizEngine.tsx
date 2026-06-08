"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  type QuizComponent,
  type QuizFormat,
  type QuizQuestion,
  COMPONENT_FORMATS,
  generateQuestions,
  gradeAnswer,
  shuffle,
} from "@/lib/quiz";
import { corpus } from "@/lib/corpus";
import BreakView from "./BreakView";

const COMPONENTS: { id: QuizComponent; label: string }[] = [
  { id: "vocabulary-set-1", label: "Vocabulary Set 1" },
  { id: "vocabulary-set-3", label: "Vocabulary Set 3" },
  { id: "cases", label: "Cases" },
  { id: "pronouns", label: "Pronouns" },
  { id: "verbs", label: "Verbs (Present)" },
  { id: "tenses", label: "Tenses" },
  { id: "moods", label: "Moods" },
  { id: "prepositions", label: "Prepositions" },
];

const LS_KEY = "quiz-selection";

const QUIZ3_COMPONENTS: QuizComponent[] = [
  "vocabulary-set-3",
  "verbs",
  "tenses",
  "prepositions",
  "pronouns",
];

type Phase = "select" | "quiz" | "results";

export default function QuizEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topicParam = searchParams.get("topic");
  const isQuiz3Mode = searchParams.get("mode") === "quiz3";

  // ── Selection state ──────────────────────────────────────────────────────
  const [selectedComponents, setSelectedComponents] = useState<QuizComponent[]>(() => {
    if (isQuiz3Mode) return QUIZ3_COMPONENTS;
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved) as QuizComponent[];
    } catch {}
    return [];
  });
  const [selectedFormat, setSelectedFormat] = useState<QuizFormat>("recognize");

  // Pre-select from URL topic param (skip in quiz3 mode)
  useEffect(() => {
    if (isQuiz3Mode) return;
    if (topicParam) {
      const found = COMPONENTS.find((c) =>
        c.label.toLowerCase().includes(topicParam.toLowerCase()) ||
        c.id.includes(topicParam.toLowerCase())
      );
      if (found && !selectedComponents.includes(found.id)) {
        setSelectedComponents([found.id]);
      }
    }
  }, [topicParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleComponent = (id: QuizComponent) => {
    if (isQuiz3Mode) return;
    setSelectedComponents((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const selectAll = () => {
    if (isQuiz3Mode) return;
    const all = COMPONENTS.map((c) => c.id);
    setSelectedComponents(all);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  // Determine valid formats for the current selection
  const validFormats: QuizFormat[] = selectedComponents.length === 0
    ? []
    : (Object.entries(COMPONENT_FORMATS)
        .filter(([id]) => selectedComponents.includes(id as QuizComponent))
        .map(([, fmts]) => fmts)
        .reduce<QuizFormat[]>((acc, fmts) => acc.filter((f) => fmts.includes(f)),
          COMPONENT_FORMATS[selectedComponents[0]] ?? []));

  useEffect(() => {
    if (validFormats.length > 0 && !validFormats.includes(selectedFormat)) {
      setSelectedFormat(validFormats[0]);
    }
  }, [validFormats, selectedFormat]);

  // ── Quiz state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("select");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [graded, setGraded] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ q: QuizQuestion; correct: boolean }[]>([]);
  // Match game state
  const [matchLeft, setMatchLeft] = useState<string[]>([]);
  const [matchRight, setMatchRight] = useState<string[]>([]);
  const [matchSel, setMatchSel] = useState<{ side: "left" | "right"; val: string } | null>(null);
  const [matchMatched, setMatchMatched] = useState<string[]>([]);

  const startQuiz = useCallback(() => {
    const qs: QuizQuestion[] = [];
    for (const comp of selectedComponents) {
      if (COMPONENT_FORMATS[comp].includes(selectedFormat)) {
        qs.push(...generateQuestions(comp, selectedFormat, corpus, 5));
      }
    }
    if (qs.length === 0) return;
    setQuestions(qs);
    setQIndex(0);
    setScore(0);
    setResults([]);
    setPhase("quiz");
    resetQuestion();
  }, [selectedComponents, selectedFormat]);

  function resetQuestion() {
    setUserInput("");
    setSelected(null);
    setGraded(null);
    setMatchSel(null);
    setMatchMatched([]);
  }

  const currentQ = questions[qIndex];

  // Set up match game state when question changes
  useEffect(() => {
    if (currentQ?.format === "match" && currentQ.matchPairs) {
      setMatchLeft(shuffle(currentQ.matchPairs.map(([l]) => l)));
      setMatchRight(shuffle(currentQ.matchPairs.map(([, r]) => r)));
      setMatchSel(null);
      setMatchMatched([]);
    }
  }, [qIndex, currentQ]);

  function handleMatchTap(side: "left" | "right", val: string) {
    if (matchMatched.includes(val)) return;
    if (!matchSel) {
      setMatchSel({ side, val });
      return;
    }
    if (matchSel.side === side) {
      setMatchSel({ side, val });
      return;
    }
    // Try to match
    const pair = currentQ.matchPairs!;
    const leftVal = side === "right" ? matchSel.val : val;
    const rightVal = side === "right" ? val : matchSel.val;
    const correct = pair.some(([l, r]) => l === leftVal && r === rightVal);
    if (correct) {
      setMatchMatched((prev) => [...prev, leftVal, rightVal]);
    }
    setMatchSel(null);
    // Check if complete
    if (matchMatched.length + 2 >= (currentQ.matchPairs!.length * 2)) {
      setTimeout(() => advance(true), 400);
    }
  }

  function handleSubmit() {
    if (!currentQ) return;
    let correct = false;
    if (currentQ.format === "recognize") {
      correct = selected === currentQ.answer;
    } else if (currentQ.format === "produce" || currentQ.format === "fill-paradigm") {
      correct = gradeAnswer(userInput, currentQ.answer);
    } else if (currentQ.format === "parse") {
      correct = gradeAnswer(userInput, currentQ.answer);
    }
    setGraded(correct);
    if (correct) setScore((s) => s + 1);
    setResults((prev) => [...prev, { q: currentQ, correct }]);
  }

  function advance(autoCorrect?: boolean) {
    if (autoCorrect) {
      setScore((s) => s + 1);
      setResults((prev) => [...prev, { q: currentQ, correct: true }]);
    }
    if (qIndex + 1 >= questions.length) {
      setPhase("results");
    } else {
      setQIndex((i) => i + 1);
      resetQuestion();
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (phase === "select") {
    return (
      <div className="space-y-5">
        {isQuiz3Mode ? (
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quiz 3 Review</h1>
            <p className="text-xs text-slate-400 mt-0.5">Weeks 4–5 · Vocab Set 3</p>
          </div>
        ) : (
          <h1 className="text-xl font-bold text-slate-800">Quiz</h1>
        )}

        {/* Component multi-select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Topics</span>
            {!isQuiz3Mode && (
              <button
                onClick={selectAll}
                className="text-xs text-blue-600 hover:underline"
              >
                Select all (mock exam)
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(isQuiz3Mode ? COMPONENTS.filter((c) => QUIZ3_COMPONENTS.includes(c.id)) : COMPONENTS).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => toggleComponent(id)}
                className={`px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  selectedComponents.includes(id)
                    ? isQuiz3Mode
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-blue-600 text-white border-blue-600"
                    : isQuiz3Mode
                    ? "border-violet-200 text-slate-400 cursor-default"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Format selector — only show valid formats for selection */}
        {selectedComponents.length > 0 && validFormats.length > 0 && (
          <div>
            <span className="text-sm font-medium text-slate-700 block mb-2">Format</span>
            <div className="flex flex-wrap gap-2">
              {validFormats.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(f)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    selectedFormat === f
                      ? "bg-slate-800 text-white border-slate-800"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={startQuiz}
          disabled={selectedComponents.length === 0}
          className={`w-full py-3 text-white rounded-xl font-semibold disabled:opacity-40 transition-colors ${
            isQuiz3Mode
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Start Quiz
        </button>

        {!isQuiz3Mode && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => router.push("/quiz?mode=quiz3")}
              className="text-base opacity-20 hover:opacity-40 transition-opacity cursor-default select-none"
              aria-hidden="true"
              tabIndex={-1}
            >
              🐱
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-slate-800">
          {isQuiz3Mode ? "Quiz 3 Review — Results" : "Results"}
        </h1>
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-slate-900">
            {score}/{questions.length}
          </div>
          <div className="text-slate-500 mt-1">
            {Math.round((score / questions.length) * 100)}% correct
          </div>
        </div>

        <div className="space-y-2">
          {results.map(({ q, correct }, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 text-sm ${
                correct
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="text-slate-700">{q.prompt}</div>
              {q.promptGreek && (
                <div className="greek text-lg text-slate-900 mt-0.5">{q.promptGreek}</div>
              )}
              {!correct && (
                <div className="mt-1 text-slate-600">
                  Correct: <span className="greek font-medium">{q.answer}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase("select")}
          className="w-full py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Back to selection
        </button>
      </div>
    );
  }

  // ── Quiz phase ─────────────────────────────────────────────────────────────
  if (!currentQ) return null;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((qIndex) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500">
          {qIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <p className="text-sm text-slate-600">{currentQ.prompt}</p>
        {currentQ.promptGreek && (
          <p className="greek text-3xl font-bold text-slate-900">{currentQ.promptGreek}</p>
        )}
        {currentQ.hint && (
          <p className="text-xs text-slate-400">({currentQ.hint})</p>
        )}
      </div>

      {/* Answer area */}
      {currentQ.format === "recognize" && (
        <div className="grid gap-2">
          {currentQ.choices?.map((choice) => {
            let cls =
              "px-4 py-3 rounded-xl border text-sm text-left transition-colors ";
            if (graded !== null) {
              if (choice === currentQ.answer)
                cls += "bg-emerald-100 border-emerald-400 text-emerald-900";
              else if (choice === selected)
                cls += "bg-red-100 border-red-400 text-red-900";
              else cls += "border-slate-200 text-slate-400";
            } else {
              cls +=
                selected === choice
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50";
            }
            return (
              <button
                key={choice}
                onClick={() => graded === null && setSelected(choice)}
                className={cls}
              >
                {choice}
              </button>
            );
          })}
        </div>
      )}

      {(currentQ.format === "produce" ||
        currentQ.format === "fill-paradigm" ||
        currentQ.format === "parse") && (
        <div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && graded === null && handleSubmit()}
            disabled={graded !== null}
            placeholder={
              currentQ.format === "parse"
                ? "e.g. 3sg aorist active indicative"
                : "Type your answer…"
            }
            className={`w-full px-4 py-3 rounded-xl border text-lg greek outline-none transition-colors ${
              graded === true
                ? "border-emerald-400 bg-emerald-50"
                : graded === false
                ? "border-red-400 bg-red-50"
                : "border-slate-300 focus:border-blue-400"
            }`}
          />
        </div>
      )}

      {currentQ.format === "match" && currentQ.matchPairs && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            {matchLeft.map((val) => {
              const matched = matchMatched.includes(val);
              const isSel = matchSel?.side === "left" && matchSel.val === val;
              return (
                <button
                  key={val}
                  onClick={() => !matched && handleMatchTap("left", val)}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm greek font-medium transition-colors ${
                    matched
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : isSel
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {matchRight.map((val) => {
              const matched = matchMatched.includes(val);
              const isSel = matchSel?.side === "right" && matchSel.val === val;
              return (
                <button
                  key={val}
                  onClick={() => !matched && handleMatchTap("right", val)}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    matched
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : isSel
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback */}
      {graded !== null && currentQ.format !== "match" && (
        <div
          className={`rounded-xl p-4 text-sm ${
            graded
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {graded ? "Correct!" : (
            <>
              <p>Not quite. Correct answer: <span className="greek font-semibold">{currentQ.answer}</span></p>
            </>
          )}
          {/* Morpheme breakdown feedback */}
          {currentQ.segments && currentQ.segments.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-600 mb-2">Morpheme breakdown:</p>
              <BreakView
                form={currentQ.answer}
                segments={currentQ.segments}
              />
            </div>
          )}
        </div>
      )}

      {/* Action button */}
      {currentQ.format !== "match" && (
        <button
          onClick={graded === null ? handleSubmit : () => advance()}
          disabled={
            graded === null &&
            (currentQ.format === "recognize" ? selected === null : userInput.trim() === "")
          }
          className={`w-full py-3 text-white rounded-xl font-semibold disabled:opacity-40 transition-colors ${
            isQuiz3Mode
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {graded === null ? "Check" : qIndex + 1 >= questions.length ? "Finish" : "Next"}
        </button>
      )}
    </div>
  );
}
