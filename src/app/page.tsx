import { Suspense } from "react";
import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getHomepagePosts } from "@/lib/services/blog-service";
import { getCuratedRepos } from "@/lib/repo-catalog";
import { getPublicStats } from "@/lib/analytics";
import { buildOgImageUrl, createSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createSeoMetadata({
    title: "AI-Powered Code Intelligence",
    description:
        "Use RepoMind to chat with GitHub repositories and developer profiles, visualize architecture, and run security analysis with Agentic CAG.",
    keywords: [
        "github repo chat",
        "developer profile analysis",
        "architecture flowcharts",
        "repository security scanner",
        "ai code review tool",
    ],
    canonical: "/",
    ogTitle: "AI-Powered Code Intelligence | RepoMind",
    ogDescription: "Chat with GitHub repositories and developer profiles, generate architecture flowcharts, and run security analysis.",
});

export default async function Home() {
    const [latestPosts, trendingRepos, publicStats] = await Promise.all([
        getHomepagePosts(),
        getCuratedRepos("weekly"),
        getPublicStats(),
    ]);

    return (
        <Suspense fallback={null}>
            <HomeClient initialPosts={latestPosts} trendingRepos={trendingRepos} publicStats={publicStats} />
        </Suspense>
    );
}
