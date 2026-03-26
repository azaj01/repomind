import { ProfileLoader } from "@/components/ProfileLoader";
import { RepoLoader } from "@/components/RepoLoader";
import { redirect } from "next/navigation";
import { normalizeGitHubInput } from "@/lib/utils";
import {
    buildOgImageUrl,
    buildProfileChatTitle,
    buildRepoChatTitle,
    chatIntentDescription,
    createSeoMetadata,
    inferChatIntent,
} from "@/lib/seo";

import type { Metadata } from "next";

function buildChatRobots(): NonNullable<Metadata["robots"]> {
    return {
        index: false,
        follow: true,
        googleBot: {
            index: false,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    };
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; prompt?: string }>;
}): Promise<Metadata> {
    const { q: rawQuery, prompt } = await searchParams;
    const query = rawQuery ? normalizeGitHubInput(rawQuery) : "";
    const intent = inferChatIntent(prompt);

    if (!query) {
        const metadata = createSeoMetadata({
            title: "Chat",
            description: "Paste a GitHub repository or developer profile to analyze it with RepoMind.",
            canonical: "/chat",
            ogTitle: "RepoMind chat",
            ogDescription: "Chat with GitHub repositories and developer profiles using Agentic CAG.",
        });
        metadata.robots = buildChatRobots();
        return metadata;
    }

    const canonicalQuery = prompt
        ? `/chat?q=${encodeURIComponent(query)}&prompt=${encodeURIComponent(prompt)}`
        : `/chat?q=${encodeURIComponent(query)}`;

    if (!query.includes("/")) {
        const title = buildProfileChatTitle(query, undefined, intent);
        const description = `${chatIntentDescription(intent)} Explore projects, skills, and contributions with RepoMind.`;
        const metadata = createSeoMetadata({
            title,
            description,
            canonical: canonicalQuery,
            ogImage: buildOgImageUrl("marketing", { variant: "home" }),
            ogTitle: title,
            ogDescription: description,
        });
        metadata.robots = buildChatRobots();
        return metadata;
    }

    const [owner, repo] = query.split("/");
    const title = buildRepoChatTitle(owner, repo, intent);
    const description = `${chatIntentDescription(intent)} Ask about architecture, dependencies, and implementation details.`;
    const metadata = createSeoMetadata({
        title,
        description,
        canonical: canonicalQuery,
        ogImage: buildOgImageUrl("marketing", { variant: "home" }),
        ogTitle: title,
        ogDescription: description,
    });
    metadata.robots = buildChatRobots();
    return metadata;
}

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; prompt?: string }>;
}) {
    const { q: rawQuery, prompt } = await searchParams;
    const query = rawQuery ? normalizeGitHubInput(rawQuery) : undefined;

    if (!query) {
        redirect("/");
    }

    // If it's a profile query (no slash), load immediately with ProfileLoader
    if (!query.includes("/")) {
        return <ProfileLoader username={query} />;
    }

    // For repos, use RepoLoader for client-side loading
    return <RepoLoader query={query} initialPrompt={prompt} />;
}
