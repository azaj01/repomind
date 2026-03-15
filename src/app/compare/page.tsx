import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare RepoMind With Alternative Workflows | RepoMind",
  description:
    "Compare RepoMind workflows for architecture analysis, AI code review, and security scanning to find the best fit for your team.",
  alternates: {
    canonical: "/compare",
  },
};

const compareTracks = [
  {
    title: "Repository Analysis Workflow",
    summary: "Compare how quickly different approaches reach architecture and risk clarity in unfamiliar repositories.",
  },
  {
    title: "AI Code Review Workflow",
    summary: "Compare context depth, feedback speed, and review confidence for pull request and repository-level review.",
  },
  {
    title: "Security Scanning Workflow",
    summary: "Compare signal quality and triage speed when auditing open-source and internal repositories.",
  },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Compare</h1>
        <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl mb-10">
          Use this hub to evaluate RepoMind by workflow. Detailed tool-to-tool and method comparisons are being published in ongoing guides.
        </p>

        <div className="space-y-4">
          {compareTracks.map((track) => (
            <section key={track.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-xl font-semibold mb-2">{track.title}</h2>
              <p className="text-zinc-400">{track.summary}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/solutions" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Explore Solutions
          </Link>
          <Link href="/blog" className="px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Read Comparison Guides
          </Link>
        </div>
      </div>
    </main>
  );
}
