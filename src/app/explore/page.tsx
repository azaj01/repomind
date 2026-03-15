import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore SEO Topics | RepoMind",
  description:
    "Explore planned SEO topic clusters for code analyzers, security scanners, comparison pages, and practical repository guides.",
  alternates: {
    canonical: "/explore",
  },
};

type TopicEntry = {
  slug: string;
  format: "Topic Page" | "Comparison Page" | "Guide Article";
};

const codeAnalyzerTopics: TopicEntry[] = [
  { slug: "/github-code-analyzer", format: "Topic Page" },
  { slug: "/typescript-code-analyzer", format: "Topic Page" },
  { slug: "/javascript-code-analyzer", format: "Topic Page" },
  { slug: "/python-code-analyzer", format: "Topic Page" },
  { slug: "/react-repo-analyzer", format: "Topic Page" },
  { slug: "/nextjs-repo-analyzer", format: "Topic Page" },
];

const securityTopics: TopicEntry[] = [
  { slug: "/nodejs-security-scanner", format: "Topic Page" },
  { slug: "/open-source-security-scanner", format: "Topic Page" },
  { slug: "/ai-code-review-tool", format: "Topic Page" },
  { slug: "/repository-risk-analysis", format: "Topic Page" },
];

const comparisonTopics: TopicEntry[] = [
  { slug: "/static-analysis-vs-repomind", format: "Comparison Page" },
  { slug: "/sast-vs-repomind", format: "Comparison Page" },
  { slug: "/repomind-vs-snyk", format: "Comparison Page" },
  { slug: "/repomind-vs-sonarqube", format: "Comparison Page" },
  { slug: "/repomind-vs-codacy", format: "Comparison Page" },
  { slug: "/repomind-vs-deepsource", format: "Comparison Page" },
  { slug: "/repomind-vs-greptile", format: "Comparison Page" },
  { slug: "/repomind-vs-copilot-for-repo-analysis", format: "Comparison Page" },
];

const guideTopics: TopicEntry[] = [
  { slug: "/security-scan-github-actions", format: "Guide Article" },
  { slug: "/analyze-github-repo-architecture", format: "Guide Article" },
  { slug: "/how-to-audit-open-source-repos", format: "Guide Article" },
  { slug: "/startup-codebase-due-diligence-checklist", format: "Guide Article" },
  { slug: "/ctf-vulnerable-repo-analysis-example", format: "Guide Article" },
  { slug: "/top-github-security-tools", format: "Guide Article" },
  { slug: "/best-repo-analyzer-tools", format: "Guide Article" },
];

function TopicSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: TopicEntry[];
}) {
  return (
    <section id={id} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <h2 className="text-2xl font-semibold mb-5">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.slug} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Link
              href={`/coming-soon?slug=${encodeURIComponent(item.slug)}`}
              className="text-zinc-200 hover:text-cyan-300 transition-colors font-medium"
            >
              {item.slug}
            </Link>
            <span className="text-xs uppercase tracking-wide text-zinc-500">{item.format}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Explore SEO Topic Clusters</h1>
        <p className="text-zinc-300 text-lg mb-10 max-w-4xl">
          This hub organizes planned keyword endpoints by intent. We can publish them as full pages or topic-driven guides based on priority.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopicSection id="code-analyzer-topics" title="Code Analyzer Topics" items={codeAnalyzerTopics} />
          <TopicSection id="security-topics" title="Security Scanner Topics" items={securityTopics} />
          <TopicSection id="comparison-topics" title="Comparison Topics" items={comparisonTopics} />
          <TopicSection id="guide-topics" title="Guide Topics" items={guideTopics} />
        </div>
      </div>
    </main>
  );
}
