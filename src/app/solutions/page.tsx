import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RepoMind Solutions for Repository Analysis | RepoMind",
  description:
    "Explore RepoMind solutions for repository analysis, architecture understanding, AI code review, and security scanning.",
  alternates: {
    canonical: "/solutions",
  },
};

const solutionCards = [
  {
    title: "GitHub Repository Analysis",
    description: "Evaluate unfamiliar repositories quickly before adoption, contribution, or due diligence.",
    href: "/github-repository-analysis",
    cta: "Explore Repository Analysis",
  },
  {
    title: "AI Code Review Tool",
    description: "Review implementation quality with full-repo context to reduce blind spots in code reviews.",
    href: "/ai-code-review-tool",
    cta: "Explore AI Code Review",
  },
  {
    title: "Security Scanner",
    description: "Surface actionable vulnerability findings and prioritize fixes faster with context-aware scanning.",
    href: "/security-scanner",
    cta: "Explore Security Scanner",
  },
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Solutions</h1>
        <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl mb-10">
          Choose a focused workflow based on what you need: repository understanding, architecture insights, code review acceleration, or security-first analysis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutionCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-zinc-400 mb-4">{card.description}</p>
              <span className="text-sm text-blue-300">{card.cta}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/compare" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            View Comparisons
          </Link>
          <Link href="/blog" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Read Guides
          </Link>
        </div>
      </div>
    </main>
  );
}
