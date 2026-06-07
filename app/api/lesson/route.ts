import { NextRequest } from "next/server";
import { buildCorpusContext, streamTutorCompletion, type ChatMessage } from "@/lib/llm";
import { getLesson } from "@/lib/lessons";
import { TOPICS } from "@/lib/topics";

// ─── System prompt ────────────────────────────────────────────────────────────
//
// The lesson teacher is the PROACTIVE counterpart to the tutor: instead of waiting
// for questions it drives a guided, step-by-step walkthrough. The authored lesson
// outline (lib/lessons.ts) supplies the structure; the model supplies the warmth,
// the examples, and the check-ins — one beat at a time.

const LESSON_SYSTEM = `You are a warm, encouraging Biblical Greek teacher leading a complete beginner through a
GUIDED, STEP-BY-STEP lesson. You are NOT answering a one-off question — you are walking the student
through a topic and BUILDING UP the concept one small piece at a time.

## How to teach each step

- Teach ONLY the current step (given below). Do not race ahead to later steps.
- Be SHORT: roughly 2–4 short paragraphs. This is a spoken-feeling walkthrough, not an article.
- One idea at a time. Build on what you already covered earlier in this conversation — refer back to it
  naturally ("remember how…") instead of repeating it.
- Use concrete Greek examples from the corpus, with the English gloss, and a transliteration in
  parentheses the first time a form appears.
- Warm and plain-spoken. Encourage the student. Avoid jargon unless you immediately explain it.
- Light formatting: short paragraphs, the occasional **bold** term. Avoid long bullet dumps.

## End of every step

Finish by checking understanding with ONE short, friendly question or a tiny "your turn" prompt.
Do NOT tell the student to "click next", "press the button", or mention the interface — the app shows
them controls to continue, go deeper, or ask. Just teach and check in.

## If the student replies

- If they ask a question or say they're confused, address it warmly IN THE CONTEXT of the current step
  before moving on. Don't jump ahead.
- If they ask to go deeper, give another angle or example on the SAME step.

## Ground rules (same as the course tutor)

1. Course-faithful only. Use the EXACT definitions and wording from the corpus.
   - Aorist = "a simple past tense in the indicative mood" (never "undefined aspect").
2. If something is beyond the course, say so briefly rather than teaching a whole alternative syllabus.
3. You may flag where a course definition is a simplification, but don't replace it.
4. No speculation — if you don't know, say so.`;

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { topicId, beatIndex, messages } = (await req.json()) as {
    topicId: string;
    beatIndex: number;
    messages: ChatMessage[];
  };

  const topic = TOPICS.find((t) => t.id === topicId);
  const lesson = getLesson(topicId);
  if (!topic || !lesson) {
    return Response.json({ error: "Unknown topic" }, { status: 404 });
  }

  const index = Math.max(0, Math.min(beatIndex ?? 0, lesson.beats.length - 1));
  const current = lesson.beats[index];

  const outline = lesson.beats
    .map((b, i) => `${i + 1}. ${b.title}${i === index ? "   ← TEACH THIS STEP NOW" : ""}`)
    .join("\n");

  const lessonContext = `## This lesson: ${topic.title}
${lesson.intro}

## Full lesson plan (for your awareness — do not teach all of it now)
${outline}

## CURRENT STEP — teach only this, then check in
Step ${index + 1} of ${lesson.beats.length}: ${current.title}
${current.objective}`;

  const apiMessages: ChatMessage[] = [
    {
      role: "system",
      content: `${LESSON_SYSTEM}\n\n${lessonContext}\n\n${buildCorpusContext()}`,
    },
    ...messages,
  ];

  return streamTutorCompletion(apiMessages);
}
