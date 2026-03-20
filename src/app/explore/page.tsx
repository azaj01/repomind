import type { Metadata } from "next";
import Link from "next/link";
import JsonLdScript from "@/components/JsonLdScript";
import { buildOgImageUrl, createSeoMetadata } from "@/lib/seo";
import { buildBreadcrumbStructuredData, buildItemListStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createSeoMetadata({
  title: "Explore GitHub Analysis and Security Workflows",
  description:
    "Explore live RepoMind pages for GitHub code analysis, AI code review, repository risk analysis, and security workflow comparisons.",
  canonical: "/explore",
  ogImage: buildOgImageUrl("marketing", { variant: "explore" }),
  ogTitle: "Explore RepoMind Workflow Pages",
  ogDescription: "Browse live, indexable pages for repository analysis, code review, and security-first engineering decisions.",
});

type TopicEntry = {
  title: string;
  slug: string;
  summary: string;
  category: "Analysis" | "Security" | "Comparison";
};

export const livePages: TopicEntry[] = [
  {
    title: "GitHub Repository Analysis",
    slug: "/github-repository-analysis",
    summary: "Understand architecture, implementation boundaries, and risk hotspots in unfamiliar repositories.",
    category: "Analysis",
  },
  {
    title: "GitHub Code Analyzer",
    slug: "/github-code-analyzer",
    summary: "Analyze repository structure and code behavior with full-file context.",
    category: "Analysis",
  },
  {
    title: "TypeScript Code Analyzer",
    slug: "/typescript-code-analyzer",
    summary: "Navigate large TypeScript repositories with context-aware architecture understanding.",
    category: "Analysis",
  },
  {
    title: "AI Code Review Tool",
    slug: "/ai-code-review-tool",
    summary: "Improve review quality and speed with repository-level context.",
    category: "Analysis",
  },
  {
    title: "Security Scanner",
    slug: "/security-scanner",
    summary: "Prioritize security findings with implementation and architecture context.",
    category: "Security",
  },
  {
    title: "Node.js Security Scanner",
    slug: "/nodejs-security-scanner",
    summary: "Evaluate Node.js repository risk with actionable triage paths.",
    category: "Security",
  },
  {
    title: "Open Source Security Scanner",
    slug: "/open-source-security-scanner",
    summary: "Assess open-source repository security posture before adoption.",
    category: "Security",
  },
  {
    title: "Repository Risk Analysis",
    slug: "/repository-risk-analysis",
    summary: "Evaluate complexity and security exposure for faster engineering decisions.",
    category: "Security",
  },
  {
    title: "Static Analysis vs RepoMind",
    slug: "/static-analysis-vs-repomind",
    summary: "Compare rule-based static analysis and context-aware repository workflows.",
    category: "Comparison",
  },
  {
    title: "RepoMind vs SonarQube",
    slug: "/repomind-vs-sonarqube",
    summary: "Understand where SonarQube and RepoMind are complementary.",
    category: "Comparison",
  },
  {
    title: "RepoMind vs Snyk",
    slug: "/repomind-vs-snyk",
    summary: "Compare security context, triage speed, and workflow fit.",
    category: "Comparison",
  },
];

const grouped = {
  Analysis: livePages.filter((page) => page.category === "Analysis"),
  Security: livePages.filter((page) => page.category === "Security"),
  Comparison: livePages.filter((page) => page.category === "Comparison"),
};

const breadcrumbSchema = buildBreadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
]);

const itemListSchema = buildItemListStructuredData({
  name: "RepoMind Live Workflow Pages",
  items: livePages.map((entry) => ({ name: entry.title, path: entry.slug })),
});

function TopicSection({
  title,
  items,
}: {
  title: string;
  items: TopicEntry[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
      <h2 className="text-2xl font-semibold mb-5">{title}</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.slug} className="rounded-xl border border-zinc-800 bg-black/20 p-4">
            <Link
              href={item.slug}
              className="text-zinc-100 hover:text-cyan-300 transition-colors font-semibold block mb-1"
            >
              {item.title}
            </Link>
            <p className="text-sm text-zinc-400">{item.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white px-6 py-16">
      <JsonLdScript data={breadcrumbSchema} />
      <JsonLdScript data={itemListSchema} />

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-400 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Explore</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Explore Live SEO Workflows</h1>
        <p className="text-zinc-300 text-lg mb-10 max-w-4xl">
          Browse indexable, production-ready pages for repository analysis, AI code review, security scanning, and workflow comparisons.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopicSection title="Code Analysis Pages" items={grouped.Analysis} />
          <TopicSection title="Security Pages" items={grouped.Security} />
          <TopicSection title="Comparison Pages" items={grouped.Comparison} />
          <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <h2 className="text-2xl font-semibold mb-4">Related Hubs</h2>
            <p className="text-zinc-400 mb-5">
              Continue through solution workflows and engineering deep dives.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/solutions" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
                Solutions Hub
              </Link>
              <Link href="/compare" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
                Compare Workflows
              </Link>
              <Link href="/blog" className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900 transition-colors">
                Blog Insights
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
