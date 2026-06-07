"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What is the aorist tense?",
  "Explain ἠγάπησεν in John 3:16",
  "What is the difference between dative and accusative?",
  "Help me parse πιστεύων",
];

export default function TutorChat() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const topic = searchParams.get("topic") ?? undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQ);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-submit if opened with a pre-filled question (e.g. from John 3:16 reader)
  useEffect(() => {
    if (initialQ) {
      handleSend(initialQ);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    setInput("");
    setError(null);

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setStreaming(true);

    // Placeholder for the streaming assistant reply
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, topic }),
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
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", content: assembled },
              ]);
            }
          } catch {}
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // remove empty assistant placeholder
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">AI Tutor</h1>
        {topic && (
          <p className="text-sm text-slate-500 mt-0.5">
            Context: <span className="font-medium">{topic}</span>
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && !streaming && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              Ask anything about your Biblical Greek course — vocabulary, grammar, John 3:16, or parsing.
            </p>
            <div className="grid gap-2">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-sm text-left px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm whitespace-pre-wrap"
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : msg.content ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    code: ({ children }) => (
                      <code className="greek bg-slate-200 text-slate-800 px-1 rounded text-[0.9em]">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="greek bg-slate-200 rounded p-2 my-2 overflow-x-auto text-xs">
                        {children}
                      </pre>
                    ),
                    h1: ({ children }) => <h1 className="font-bold text-base mb-1">{children}</h1>,
                    h2: ({ children }) => <h2 className="font-semibold mb-1">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-semibold mb-1">{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-slate-400 pl-3 italic text-slate-600 my-1">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask the tutor…"
          rows={2}
          disabled={streaming}
          className="flex-1 resize-none px-4 py-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={streaming || input.trim() === ""}
          className="px-4 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
