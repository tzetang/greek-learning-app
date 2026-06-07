"use client";

import ReactMarkdown from "react-markdown";

/**
 * Shared markdown renderer for assistant text (tutor chat + lesson teacher).
 * Greek renders fine in normal prose (the base font is polytonic-capable); inline
 * `code` spans get the dedicated Greek font for emphasis on individual forms.
 */
export default function Markdown({ children }: { children: string }) {
  return (
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
      {children}
    </ReactMarkdown>
  );
}
