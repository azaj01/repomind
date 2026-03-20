import type { Metadata } from "next";
import Link from "next/link";
import JsonLdScript from "@/components/JsonLdScript";
import SeoVisual from "@/components/seo/SeoVisual";
import { buildOgImageUrl, createSeoMetadata } from "@/lib/seo";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createSeoMetadata({
  title: "Repository Analysis, AI Code Review, and Security Scanning Solutions",
  description:
    "Explore RepoMind solutions for GitHub repository analysis, AI code review, and repository security scanning with full-context workflows.",
  canonical: "/solutions",
  ogImage: buildOgImageUrl("marketing", { variant: "solutions" }),
  ogTitle: "RepoMind Solutions for Repository Analysis and Security",
  ogDescription: "Choose the right workflow for architecture understanding, review quality, and security prioritization.",
});

const solutionCards = [
  {
    title: "GitHub Repository Analysis",
    description: "Understand architecture, logic boundaries, and repository risk before adoption or onboarding.",
    href: "/github-repository-analysis",
  },
  {
    title: "AI Code Review Tool",
    description: "Review implementation quality with repository-wide context and actionable feedback paths.",
    href: "/ai-code-review-tool",
  },
  {
    title: "Security Scanner",
    description: "Prioritize security findings with context-aware triage and practical remediation direction.",
    href: "/security-scanner",
  },
];

const compareLinks = [
  { name: "Static Analysis vs RepoMind", href: "/static-analysis-vs-repomind" },
  { name: "RepoMind vs SonarQube", href: "/repomind-vs-sonarqube" },
  { name: "RepoMind vs Snyk", href: "/repomind-vs-snyk" },
];

const breadcrumbSchema = buildBreadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "Solutions", path: "/solutions" },
]);

const itemListSchema = buildItemListStructuredData({
  name: "RepoMind Solution Workflows",
  items: solutionCards.map((card) => ({ name: card.title, path: card.href })),
});

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <JsonLdScript data={breadcrumbSchema} />
      <JsonLdScript data={itemListSchema} />

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-400 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Solutions</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Solutions for Repository Analysis, AI Code Review, and Security Scanning
          </h1>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl mb-6">
            RepoMind helps engineering teams evaluate unfamiliar codebases, improve review quality, and prioritize repository security risks with full-context AI workflows.
          </p>
          <p className="text-zinc-400 leading-relaxed max-w-4xl">
            Each solution is optimized for actionability: architecture clarity, implementation insight, and faster security decision-making.
          </p>
        </header>

        <section className="mb-12">
          <SeoVisual
            variant="hero-flow"
            ariaLabel="RepoMind solutions overview workflow"
            sizeMode="wide"
            animate
            priority="high"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {solutionCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-zinc-400 mb-4">{card.description}</p>
              <span className="text-sm text-cyan-300">Explore workflow</span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">How to Choose the Right Workflow</h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            Start with <strong>GitHub Repository Analysis</strong> when your team needs architecture and dependency understanding.
          </p>
          <p className="text-zinc-300 leading-relaxed mb-3">
            Move to <strong>AI Code Review Tool</strong> when implementation quality and review speed are priorities.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            Use <strong>Security Scanner</strong> when you need context-aware risk triage and remediation planning.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-5">Comparison Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {compareLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-zinc-700 px-4 py-3 text-zinc-200 hover:bg-zinc-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/explore" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Explore Live Topic Hub
          </Link>
          <Link href="/blog" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Read Engineering Guides
          </Link>
          <Link href="/chat" className="px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Start Analysis
          </Link>
        </div>
      </div>
    </main>
  );
}
