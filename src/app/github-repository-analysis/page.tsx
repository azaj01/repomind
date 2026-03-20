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
  title: "GitHub Repository Analysis",
  description:
    "Run full-context GitHub repository analysis with RepoMind to understand architecture, implementation behavior, and repository risk.",
  canonical: "/github-repository-analysis",
  ogImage: buildOgImageUrl("marketing", { variant: "github-repository-analysis" }),
  ogTitle: "GitHub Repository Analysis for Faster Engineering Decisions",
  ogDescription: "Understand unfamiliar repositories faster before integrating, reviewing, or contributing.",
});

const faqItems = [
  {
    question: "What is GitHub repository analysis in RepoMind?",
    answer:
      "It is a workflow for understanding architecture, dependency paths, and risk hotspots in unfamiliar repositories using context-aware AI.",
  },
  {
    question: "When should teams use this workflow?",
    answer:
      "Use it during due diligence, onboarding, migration planning, architecture review, and open-source adoption decisions.",
  },
  {
    question: "Can this support both engineering and security teams?",
    answer:
      "Yes. The output is useful for engineering architecture clarity and for security teams prioritizing repository-level risk.",
  },
];

const breadcrumbSchema = buildBreadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "Solutions", path: "/solutions" },
  { name: "GitHub Repository Analysis", path: "/github-repository-analysis" },
]);

const faqSchema = buildFaqStructuredData(faqItems);
const softwareSchema = buildSoftwareApplicationStructuredData({
  name: "RepoMind GitHub Repository Analysis",
  description:
    "Repository analysis workflow for architecture understanding, implementation insight, and risk visibility.",
  path: "/github-repository-analysis",
  featureList: [
    "Architecture understanding",
    "Implementation behavior mapping",
    "Repository risk visibility",
  ],
});

export default function GitHubRepositoryAnalysisPage() {
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
          <span className="text-zinc-200">GitHub Repository Analysis</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          GitHub Repository Analysis with Full-Context AI
        </h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-4">
          RepoMind helps teams evaluate unfamiliar repositories by mapping architecture, implementation boundaries, and likely risk hotspots quickly.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-10">
          This workflow is optimized for practical engineering decisions, including adoption, onboarding, migration planning, and architecture reviews.
        </p>

        <section className="mb-10">
          <SeoVisual
            variant="analysis-workflow"
            ariaLabel="GitHub repository analysis workflow"
            sizeMode="wide"
            animate
            priority="high"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 mb-10">
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Problem</h2>
            <p className="text-zinc-400">
              Teams waste time manually piecing together architecture and dependency relationships in unfamiliar codebases.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Workflow</h2>
            <p className="text-zinc-400">
              RepoMind starts from repository structure and uses Agentic CAG to preserve full-file relationships while analyzing behavior.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Outputs</h2>
            <p className="text-zinc-400">
              Get architecture summaries, implementation context, and risk insights that support faster technical decisions.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Who It&apos;s For</h2>
            <p className="text-zinc-400">
              Platform teams, onboarding engineers, security reviewers, and technical leaders responsible for repository selection.
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
          <h2 className="text-2xl font-semibold mb-4">Related Analysis Paths</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/github-code-analyzer" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              GitHub Code Analyzer
            </Link>
            <Link href="/typescript-code-analyzer" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              TypeScript Code Analyzer
            </Link>
            <Link href="/repository-risk-analysis" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              Repository Risk Analysis
            </Link>
          </div>
        </section>

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
