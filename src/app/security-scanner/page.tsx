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
  title: "Repository Security Scanner",
  description:
    "Scan GitHub repositories for actionable security risks with context-aware triage and remediation guidance from RepoMind.",
  canonical: "/security-scanner",
  ogImage: buildOgImageUrl("marketing", { variant: "security-scanner" }),
  ogTitle: "Repository Security Scanner with Context-Aware Triage",
  ogDescription: "Prioritize findings faster with architecture and implementation context.",
});

const faqItems = [
  {
    question: "What does RepoMind security scanning focus on?",
    answer:
      "RepoMind focuses on practical risk prioritization by pairing findings with repository context, severity framing, and remediation direction.",
  },
  {
    question: "Can this support open-source due diligence?",
    answer:
      "Yes. Security scanning is useful before adopting dependencies because it helps teams evaluate risk posture with architecture context.",
  },
  {
    question: "Does this replace all security tooling?",
    answer:
      "No. RepoMind complements existing security workflows by improving interpretation and actionability at repository level.",
  },
];

const breadcrumbSchema = buildBreadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "Solutions", path: "/solutions" },
  { name: "Security Scanner", path: "/security-scanner" },
]);

const faqSchema = buildFaqStructuredData(faqItems);
const softwareSchema = buildSoftwareApplicationStructuredData({
  name: "RepoMind Security Scanner",
  description:
    "Context-aware repository security scanner for actionable vulnerability triage and remediation planning.",
  path: "/security-scanner",
  featureList: [
    "Repository security risk detection",
    "Context-aware finding triage",
    "Prioritized remediation guidance",
  ],
});

export default function SecurityScannerPage() {
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
          <span className="text-zinc-200">Security Scanner</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          AI Security Scanner for Repositories
        </h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-4">
          RepoMind helps teams identify and prioritize repository security risks with context-aware analysis that supports practical remediation decisions.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-10">
          Instead of surfacing raw alerts in isolation, RepoMind connects findings to architecture and implementation context so teams can act faster.
        </p>

        <section className="mb-10">
          <SeoVisual
            variant="security-workflow"
            ariaLabel="Security scanning workflow from detection to prioritized fixes"
            sizeMode="wide"
            animate
            priority="high"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 mb-10">
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Problem</h2>
            <p className="text-zinc-400">
              Security teams often face noisy findings without enough repository context to prioritize fixes confidently.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Workflow</h2>
            <p className="text-zinc-400">
              RepoMind combines risk signals with repository understanding so triage and remediation become faster and more reliable.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Outputs</h2>
            <p className="text-zinc-400">
              Get actionable findings, severity framing, and implementation-aware next steps for engineering teams.
            </p>
          </article>
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-xl font-semibold mb-2">Who It&apos;s For</h2>
            <p className="text-zinc-400">
              Platform teams, product security, and engineering leads responsible for repository health and release confidence.
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
          <h2 className="text-2xl font-semibold mb-4">Related Workflows</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/open-source-security-scanner" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              Open Source Security Scanner
            </Link>
            <Link href="/nodejs-security-scanner" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              Node.js Security Scanner
            </Link>
            <Link href="/repository-risk-analysis" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
              Repository Risk Analysis
            </Link>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/chat" className="px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Start Security Scan
          </Link>
          <Link href="/ai-code-review-tool" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            AI Code Review Tool
          </Link>
          <Link href="/github-repository-analysis" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Repository Analysis
          </Link>
        </div>
      </div>
    </main>
  );
}
