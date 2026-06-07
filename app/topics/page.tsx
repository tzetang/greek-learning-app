import Link from "next/link";
import { TOPICS } from "@/lib/topics";

export default function TopicsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Topics</h1>
      <div className="grid gap-3">
        {TOPICS.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-slate-800">{topic.title}</div>
            <div className="text-sm text-slate-500 mt-0.5">{topic.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
