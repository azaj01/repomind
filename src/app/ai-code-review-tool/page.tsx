import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Code Review Tool for GitHub Repos | RepoMind",
  description:
    "RepoMind is an AI code review tool that helps developers inspect repository logic, review changes, and catch issues faster.",
  alternates: {
    canonical: "/ai-code-review-tool",
  },
};

export default function AICodeReviewToolPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">AI Code Review Tool</h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-8">
          RepoMind assists engineering teams with context-aware code reviews so they can evaluate implementation quality and identify issues faster.
        </p>
        <div className="grid gap-4 md:grid-cols-2 mb-10">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Review With Context</h2>
            <p className="text-zinc-400">Inspect code behavior with repository-wide context, not isolated snippets.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Faster Feedback Loops</h2>
            <p className="text-zinc-400">Shorten review cycles with clearer understanding of logic and dependency impact.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/chat" className="px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Start AI Code Review
          </Link>
          <Link href="/github-repository-analysis" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            GitHub Repository Analysis
          </Link>
          <Link href="/security-scanner" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Security Scanner
          </Link>
        </div>
      </div>
    </main>
  );
}
