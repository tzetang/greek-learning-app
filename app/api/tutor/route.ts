import { NextRequest } from "next/server";
import { getCorpus } from "@/lib/corpus";

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

// ─── Corpus grounding ─────────────────────────────────────────────────────────

function buildCorpusContext(topic?: string): string {
  const corpus = getCorpus();
  const lines: string[] = ["## Corpus reference"];

  // Vocabulary sets
  for (const set of corpus.vocabSets) {
    lines.push(`\n### Vocabulary ${set.name}`);
    for (const e of set.entries) {
      lines.push(`- ${e.greek}: ${e.gloss} (${e.partOfSpeech})`);
    }
  }

  // Glossary
  lines.push("\n### Glossary / Grammar Terms");
  for (const g of corpus.glossary) {
    lines.push(`- **${g.term}**: ${g.definition}`);
  }

  // John 3:16
  lines.push("\n### John 3:16");
  lines.push(`Greek: ${corpus.john316.greek}`);
  for (const w of corpus.john316.words) {
    lines.push(`- ${w.greek} (${w.lemma}): ${w.gloss} — ${w.parse}`);
  }

  // Prepositions
  lines.push("\n### Prepositions");
  for (const p of corpus.prepositions) {
    const entries = p.cases.map((c, i) => `${c}: ${p.glosses[i]}`).join("; ");
    lines.push(`- ${p.greek}: ${entries}`);
  }

  return lines.join("\n");
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, topic } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
    topic?: string;
  };

  const baseUrl = process.env.TUTOR_BASE_URL;
  const model = process.env.TUTOR_MODEL;
  const apiKey = process.env.TUTOR_API_KEY;

  if (!baseUrl || !model || !apiKey) {
    return new Response(
      JSON.stringify({ error: "Tutor endpoint not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const corpusContext = buildCorpusContext(topic);

  // Build messages with system + corpus grounding
  const apiMessages = [
    { role: "system", content: `${SYSTEM_PROMPT}\n\n${corpusContext}` },
    ...messages,
  ];

  const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      stream: true,
      // High enough to cover thinking + answer for the Qwen3 reasoning model;
      // without this the content field can be empty (all tokens go to reasoning_content).
      max_tokens: 8192,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}`, detail: text }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream the response back, filtering out reasoning_content tokens.
  // The Qwen3 reasoning model emits SSE lines like:
  //   data: {"choices":[{"delta":{"reasoning_content":"…"}}]}
  //   data: {"choices":[{"delta":{"content":"…"}}]}
  // We only forward the "content" deltas to the client.
  const encoder = new TextEncoder();
  const body2 = upstream.body!;
  const reader = body2.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const stream = new ReadableStream({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            if (!delta) continue;
            // Skip reasoning_content — only forward content
            if (delta.reasoning_content !== undefined && delta.content === undefined) continue;
            if (delta.content !== undefined) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`)
              );
            }
          } catch {
            // malformed SSE line — skip
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
