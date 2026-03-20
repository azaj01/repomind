import type { Metadata } from "next";
import Link from "next/link";
import JsonLdScript from "@/components/JsonLdScript";
import SeoVisual from "@/components/seo/SeoVisual";
import { buildOgImageUrl, createSeoMetadata } from "@/lib/seo";
import {
  buildBreadcrumbStructuredData,
  buildFaqStructuredData,
  buildSoftwareApplicationStructuredData,
} from "@/lib/structured-data";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Code Review Tool",
  description:
    "Review repository implementation quality with full-context AI. RepoMind helps teams catch issues faster with actionable review guidance.",
  canonical: "/ai-code-review-tool",
  ogImage: buildOgImageUrl("marketing", { variant: "ai-code-review-tool" }),
  ogTitle: "AI Code Review with Full Repository Context",
  ogDescription: "Reduce review blind spots and speed up feedback loops with context-aware repository analysis.",
});

const faqItems = [
  {
    question: "How is this different from reviewing a diff in isolation?",
    answer:
      "RepoMind uses repository context so feedback can account for architecture and dependency relationships beyond the immediate diff.",
  },
  {
    question: "Can this help reduce review cycle time?",
    answer:
      "Yes. Teams use context-aware analysis to identify likely issues earlier and provide clearer, more actionable review comments.",
  },
  {
    question: "Who benefits most from this workflow?",
    answer:
      "Engineering teams managing complex repositories, shared services, or high-change codebases benefit the most.",
  },
];

const breadcrumbSchema = buildBreadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "Solutions", path: "/solutions" },
  { name: "AI Code Review Tool", path: "/ai-code-review-tool" },
]);

const faqSchema = buildFaqStructuredData(faqItems);
const softwareSchema = buildSoftwareApplicationStructuredData({
  name: "RepoMind AI Code Review Tool",
  description:
    "Context-aware AI code review workflow for faster, higher-confidence implementation review.",
  path: "/ai-code-review-tool",
  featureList: [
    "Repository-wide review context",
    "Implementation quality insights",
    "Faster feedback and triage loops",
  ],
});

export default function AICodeReviewToolPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <JsonLdScript data={breadcrumbSchema} />
      <JsonLdScript data={faqSchema} />
      <JsonLdScript data={softwareSchema} />

      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-400 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-zinc-200">AI Code Review Tool</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          AI Code Review Tool with Full-File Context
        </h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-4">
          RepoMind helps engineering teams review implementation quality with repository-level context, improving confidence and reducing blind spots in code reviews.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-10">
          Instead of only matching snippets, RepoMind maps relationships across files so feedback is grounded in how the system behaves.
        </p>

        <section className="mb-10">
          <SeoVisual
            variant="review-workflow"
            ariaLabel="AI code review workflow from review intent to actionable feedback"
            sizeMode="wide"
            animate
            priority="high"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 mb-10">
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Problem</h2>
            <p className="text-zinc-400">
              Diff-only review workflows can miss system interactions, dependency impact, and architecture side effects.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Workflow</h2>
            <p className="text-zinc-400">
              RepoMind combines review intent with full-file context to produce analysis that is useful in real engineering review cycles.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Outputs</h2>
            <p className="text-zinc-400">
              Get architecture-aware observations, dependency-level impact signals, and action-oriented follow-up recommendations.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Who It&apos;s For</h2>
            <p className="text-zinc-400">
              Engineering managers, senior reviewers, and platform teams responsible for review quality at scale.
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq) => (
              <article key={faq.question} className="border-b border-white/10 pb-4 last:border-0">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-zinc-400">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Related Review and Analysis Paths</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/github-repository-analysis" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              GitHub Repository Analysis
            </Link>
            <Link href="/static-analysis-vs-repomind" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              Static Analysis vs RepoMind
            </Link>
            <Link href="/security-scanner" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              Security Scanner
            </Link>
          </div>
        </section>

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
