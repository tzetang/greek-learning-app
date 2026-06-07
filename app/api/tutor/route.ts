import { NextRequest } from "next/server";
import { buildCorpusContext, streamTutorCompletion, type ChatMessage } from "@/lib/llm";

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Biblical Greek tutor for a beginner course. Your job is to help students
understand the Greek material from their course — vocabulary, grammar, tenses, cases, paradigms, and John 3:16.

## Ground rules

1. **Course-faithful only.** Use the EXACT definitions and wording from the corpus below.
   - Aorist = "a simple past tense in the indicative mood" (never "undefined aspect")
   - Noun, verb, case definitions come from the course glossary
2. **Content scope.** If a question goes beyond the course content (e.g. 3rd declension paradigms,
   advanced syntax), say so clearly: "That's beyond what this course covers." Offer a brief, helpful
   note but don't teach a full alternative syllabus.
3. **Scholarly nuance.** Flag when a course definition is a simplification
   (e.g. "the course says X, but scholars also discuss Y"), but don't replace the course definition.
4. **No speculation.** If you don't know, say so.
5. **Brevity.** Prefer concise answers with examples from the corpus. Use Greek characters.

## Corpus summary injected below.`;

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { messages, topic } = (await req.json()) as {
    messages: ChatMessage[];
    topic?: string;
  };

  const topicNote = topic ? `\n\nThe student is currently studying: ${topic}.` : "";

  const apiMessages: ChatMessage[] = [
    { role: "system", content: `${SYSTEM_PROMPT}${topicNote}\n\n${buildCorpusContext()}` },
    ...messages,
  ];

  return streamTutorCompletion(apiMessages);
}
