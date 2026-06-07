// ─── Shared tutor/lesson LLM plumbing ──────────────────────────────────────────
//
// Both the reactive tutor (app/api/tutor) and the proactive lesson teacher
// (app/api/lesson) talk to the same OpenAI-compatible reasoning model. This module
// holds what they share: env resolution, corpus grounding, and the streaming proxy
// that filters out the model's `reasoning_content` so the client only sees the
// final answer.

import { getCorpus } from "@/lib/corpus";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface TutorEnv {
  baseUrl: string;
  model: string;
  apiKey: string;
}

function getTutorEnv(): TutorEnv | null {
  const baseUrl = process.env.TUTOR_BASE_URL;
  const model = process.env.TUTOR_MODEL;
  const apiKey = process.env.TUTOR_API_KEY;
  if (!baseUrl || !model || !apiKey) return null;
  return { baseUrl, model, apiKey };
}

/**
 * Course corpus rendered as grounding context. The model must use these exact
 * definitions and forms — see the system prompts in each route.
 */
export function buildCorpusContext(): string {
  const corpus = getCorpus();
  const lines: string[] = ["## Corpus reference"];

  for (const set of corpus.vocabSets) {
    lines.push(`\n### Vocabulary ${set.name}`);
    for (const e of set.entries) {
      lines.push(`- ${e.greek}: ${e.gloss} (${e.partOfSpeech})`);
    }
  }

  lines.push("\n### Glossary / Grammar Terms");
  for (const g of corpus.glossary) {
    lines.push(`- **${g.term}**: ${g.definition}`);
  }

  // Noun / pronoun paradigms (full case grids) so the teacher can cite real forms.
  const nounLike = [...corpus.nounParadigms, ...corpus.pronounParadigms];
  lines.push("\n### Noun & pronoun paradigms");
  for (const p of nounLike) {
    const cells = Object.entries(p.cells)
      .map(([k, c]) => `${k}=${c.form}`)
      .join(", ");
    lines.push(`- ${p.lemma} (${p.gloss}, ${p.declension}): ${cells}`);
  }

  // Verb paradigms (tense → person → form).
  lines.push("\n### Verb paradigms");
  for (const v of corpus.verbParadigms) {
    for (const [tense, persons] of Object.entries(v.tenses)) {
      const forms = Object.entries(persons)
        .map(([person, cell]) => `${person}=${cell.form}`)
        .join(", ");
      lines.push(`- ${v.lemma} (${v.gloss}) — ${tense}: ${forms}`);
    }
  }

  lines.push("\n### John 3:16");
  lines.push(`Greek: ${corpus.john316.greek}`);
  for (const w of corpus.john316.words) {
    lines.push(`- ${w.greek} (${w.lemma}): ${w.gloss} — ${w.parse}`);
  }

  lines.push("\n### Prepositions");
  for (const p of corpus.prepositions) {
    const entries = p.cases.map((c, i) => `${c}: ${p.glosses[i]}`).join("; ");
    lines.push(`- ${p.greek}: ${entries}`);
  }

  return lines.join("\n");
}

/**
 * POST the assembled messages to the upstream model and stream the response back
 * to the client as SSE, forwarding only `content` deltas (dropping
 * `reasoning_content`). Returns a ready-to-return Response — including the 503/502
 * error responses — so route handlers stay tiny.
 */
export async function streamTutorCompletion(
  apiMessages: ChatMessage[]
): Promise<Response> {
  const env = getTutorEnv();
  if (!env) {
    return Response.json(
      { error: "Tutor endpoint not configured" },
      { status: 503 }
    );
  }

  const upstream = await fetch(`${env.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.apiKey}`,
      // OpenRouter attribution (ignored by other OpenAI-compatible endpoints).
      "X-Title": "Biblical Greek Learning App",
    },
    body: JSON.stringify({
      model: env.model,
      messages: apiMessages,
      stream: true,
      // High enough to cover thinking + answer for the reasoning model; without it
      // the content field can come back empty (all tokens go to reasoning_content).
      max_tokens: 8192,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return Response.json(
      { error: `Upstream error: ${upstream.status}`, detail: text },
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const reader = upstream.body!.getReader();
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
            // Forward only the final answer content. This implicitly drops
            // role-only deltas, tool deltas, and reasoning tokens — whether the
            // provider names them `reasoning` (OpenRouter) or `reasoning_content`
            // (litellm/Qwen).
            if (delta?.content === undefined) continue;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: delta.content })}\n\n`)
            );
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
