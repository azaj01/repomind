import type { Metadata } from "next";
import Link from "next/link";
import { buildOgImageUrl, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description:
    "RepoMind helps developers understand repositories faster through AI-assisted analysis, code review, and security scanning.",
  canonical: "/about",
  ogImage: buildOgImageUrl("marketing", { variant: "about" }),
  ogTitle: "About RepoMind",
  ogDescription:
    "RepoMind helps developers understand repositories faster through AI-assisted analysis, code review, and security scanning.",
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About RepoMind</h1>
        <p className="text-zinc-300 text-lg leading-relaxed mb-6">
          RepoMind is built to help developers understand codebases faster through repository analysis, AI-assisted code review, and practical security scanning.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-10">
          We focus on actionable context over noise so teams can spend less time digging through files and more time shipping confidently.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/solutions" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Explore Solutions
          </Link>
          <Link href="/blog" className="px-5 py-3 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 transition-colors">
            Read Insights
          </Link>
        </div>
      </div>
    </main>
  );
}
