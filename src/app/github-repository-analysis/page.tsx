import type { Metadata } from "next";
import Link from "next/link";
import { buildOgImageUrl, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "GitHub Repository Analysis",
  description:
    "Run full GitHub repository analysis with RepoMind. Understand architecture, code behavior, and repository risk before deep manual review.",
  canonical: "/github-repository-analysis",
  ogImage: buildOgImageUrl("marketing", { variant: "github-repository-analysis" }),
  ogTitle: "GitHub repository analysis",
  ogDescription: "Understand unfamiliar repositories faster before integrating or contributing.",
});

export default function GitHubRepositoryAnalysisPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">GitHub Repository Analysis</h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-8">
          RepoMind helps teams evaluate repositories with full-context analysis across architecture, implementation details, and operational risk.
        </p>
        <div className="grid gap-4 md:grid-cols-2 mb-10">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Pre-Adoption Evaluation</h2>
            <p className="text-zinc-400">Understand unfamiliar repositories faster before integrating or contributing.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Repository Risk Visibility</h2>
            <p className="text-zinc-400">Get clarity on complexity, hotspots, and security posture in one workflow.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/chat" className="px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Analyze a GitHub Repo
          </Link>
          <Link href="/security-scanner" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Security Scanner
          </Link>
          <Link href="/ai-code-review-tool" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            AI Code Review Tool
          </Link>
        </div>
      </div>
    </main>
  );
}
