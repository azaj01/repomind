import { normalizeMetaText, truncateMetaText, inferChatIntent, chatIntentLabel, chatIntentDescription, buildReportSummaryDescription } from "./seo";

export interface OgCardStat {
    label: string;
    value: string;
}

export interface OgCardSpec {
    eyebrow: string;
    title: string;
    description: string;
    asset: string;
    assetAlt: string;
    accent: string;
    chips: string[];
    stats: OgCardStat[];
    avatar?: string;
    avatarLabel?: string;
    footer?: string;
}

const DEFAULT_FOOTER = "Agentic CAG for GitHub repositories and developer profiles.";

const MARKETING_PRESETS: Record<string, Omit<OgCardSpec, "asset" | "assetAlt" | "accent" | "footer"> & { asset: string; accent: string }> = {
    home: {
        eyebrow: "Homepage",
        title: "Chat with any GitHub repo or profile",
        description: "Instant architecture flowcharts, repository chat, developer profile analysis, and security scans.",
        asset: "/assets/landing_page.png",
        accent: "#8b5cf6",
        chips: ["Repo chat", "Profile intel", "Security scans"],
        stats: [
            { label: "Mode", value: "Agentic CAG" },
            { label: "Output", value: "Flowcharts" },
        ],
    },
    blog: {
        eyebrow: "Insights",
        title: "RepoMind Engineering Notes",
        description: "Deep dives into Agentic CAG, AI code analysis, and product strategy.",
        asset: "/assets/repomind_capabilities.png",
        accent: "#22c55e",
        chips: ["Engineering", "Security", "Product"],
        stats: [
            { label: "Reading", value: "Guides" },
            { label: "Focus", value: "Practical" },
        ],
    },
    solutions: {
        eyebrow: "Solutions",
        title: "Pick the right RepoMind workflow",
        description: "Repository analysis, AI code review, and security scanning in one product.",
        asset: "/assets/dashboard_overview.png",
        accent: "#38bdf8",
        chips: ["Analysis", "Review", "Security"],
        stats: [
            { label: "Paths", value: "3" },
            { label: "Coverage", value: "Full repo" },
        ],
    },
    compare: {
        eyebrow: "Compare",
        title: "RepoMind versus old workflows",
        description: "See why high-context analysis beats snippet-first tooling for real repositories.",
        asset: "/assets/architecture_example.png",
        accent: "#a855f7",
        chips: ["CAG", "RAG", "Code review"],
        stats: [
            { label: "Signal", value: "Higher" },
            { label: "Setup", value: "None" },
        ],
    },
    explore: {
        eyebrow: "Explore",
        title: "SEO topic clusters and guide ideas",
        description: "Browse the public content map for RepoMind's repository analysis and security pages.",
        asset: "/assets/architecture_example.png",
        accent: "#14b8a6",
        chips: ["Topic pages", "Guides", "Comparisons"],
        stats: [
            { label: "Clusters", value: "Live" },
            { label: "Intent", value: "Search" },
        ],
    },
    trending: {
        eyebrow: "Trending",
        title: "The hottest GitHub repositories this week",
        description: "Explore the projects getting attention now and chat with them instantly.",
        asset: "/assets/dashboard_starred_repos.png",
        accent: "#60a5fa",
        chips: ["Weekly", "Popular", "Repo chat"],
        stats: [
            { label: "Freshness", value: "Weekly" },
            { label: "Focus", value: "Trending" },
        ],
    },
    "github-repository-analysis": {
        eyebrow: "Analysis",
        title: "Evaluate unfamiliar repositories fast",
        description: "Understand architecture, code quality, and repository risk before you adopt or contribute.",
        asset: "/assets/dashboard_overview.png",
        accent: "#f59e0b",
        chips: ["Due diligence", "Architecture", "Risk"],
        stats: [
            { label: "Surface", value: "Full repo" },
            { label: "Speed", value: "Fast" },
        ],
    },
    "ai-code-review-tool": {
        eyebrow: "Code Review",
        title: "Review implementation with full context",
        description: "Context-aware code review across the repository, not just isolated diffs.",
        asset: "/assets/dashboard_recent_scans.png",
        accent: "#8b5cf6",
        chips: ["Context", "Review", "Feedback"],
        stats: [
            { label: "Blind spots", value: "Lower" },
            { label: "Loop", value: "Faster" },
        ],
    },
    "security-scanner": {
        eyebrow: "Security",
        title: "Find and fix vulnerabilities faster",
        description: "Actionable findings, severity context, and a path straight into Repo Chat remediation.",
        asset: "/assets/security_report.png",
        accent: "#ef4444",
        chips: ["Findings", "Triage", "Remediation"],
        stats: [
            { label: "Signal", value: "Actionable" },
            { label: "Outcome", value: "Fixes" },
        ],
    },
    about: {
        eyebrow: "About",
        title: "Why RepoMind exists",
        description: "We help developers understand codebases faster with AI that respects source context.",
        asset: "/assets/landing_page.png",
        accent: "#14b8a6",
        chips: ["Mission", "Clarity", "Context"],
        stats: [
            { label: "Focus", value: "Teams" },
            { label: "Goal", value: "Clarity" },
        ],
    },
    faq: {
        eyebrow: "FAQ",
        title: "Questions about RepoMind",
        description: "Answers about repository chat, security scanning, and analysis workflows.",
        asset: "/assets/repomind_capabilities.png",
        accent: "#38bdf8",
        chips: ["Help", "How it works", "Limits"],
        stats: [
            { label: "Support", value: "Self-serve" },
            { label: "Docs", value: "Live" },
        ],
    },
    privacy: {
        eyebrow: "Privacy",
        title: "How RepoMind handles data",
        description: "Privacy guidance for account data, usage analytics, and scan-related information.",
        asset: "/assets/security_report.png",
        accent: "#0ea5e9",
        chips: ["Retention", "Account data", "Audit trail"],
        stats: [
            { label: "Policy", value: "Live" },
            { label: "Scope", value: "Clear" },
        ],
    },
    terms: {
        eyebrow: "Terms",
        title: "RepoMind usage terms",
        description: "Guidelines for using RepoMind responsibly across public and authorized workflows.",
        asset: "/assets/architecture_example.png",
        accent: "#f59e0b",
        chips: ["Usage", "Policy", "Compliance"],
        stats: [
            { label: "Status", value: "Live" },
            { label: "Coverage", value: "Platform" },
        ],
    },
    "coming-soon": {
        eyebrow: "Roadmap",
        title: "Something new is coming",
        description: "Preview the next RepoMind feature or page that is on the roadmap.",
        asset: "/assets/dashboard_recent_scans.png",
        accent: "#a855f7",
        chips: ["In progress", "Fresh build", "Watch this space"],
        stats: [
            { label: "Status", value: "Soon" },
            { label: "Mode", value: "Preview" },
        ],
    },
};

const MARKETING_ASSET_FALLBACKS: Record<string, string> = {
    home: "/assets/landing_page.png",
    blog: "/assets/repomind_capabilities.png",
    solutions: "/assets/dashboard_overview.png",
    compare: "/assets/architecture_example.png",
    explore: "/assets/architecture_example.png",
    trending: "/assets/dashboard_starred_repos.png",
    "github-repository-analysis": "/assets/dashboard_overview.png",
    "ai-code-review-tool": "/assets/dashboard_recent_scans.png",
    "security-scanner": "/assets/security_report.png",
    about: "/assets/landing_page.png",
    faq: "/assets/repomind_capabilities.png",
    privacy: "/assets/security_report.png",
    terms: "/assets/architecture_example.png",
    "coming-soon": "/assets/dashboard_recent_scans.png",
};

function safeInt(value: string | null | undefined): number | null {
    if (typeof value !== "string") return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function assetUrl(baseUrl: string, asset: string | null | undefined, fallback: string): string {
    const resolved = normalizeMetaText(asset) || fallback;
    try {
        return new URL(resolved, baseUrl).toString();
    } catch {
        return new URL(fallback, baseUrl).toString();
    }
}

function normalizeAccent(value: string | null | undefined, fallback: string): string {
    const resolved = normalizeMetaText(value);
    return resolved || fallback;
}

function makeProfileAvatar(baseUrl: string, username: string): string {
    return new URL(`https://github.com/${encodeURIComponent(username)}.png?size=256`, baseUrl).toString();
}

function makeOwnerAvatar(baseUrl: string, owner: string): string {
    return new URL(`https://github.com/${encodeURIComponent(owner)}.png?size=256`, baseUrl).toString();
}

function marketingSpec(page: string | null, baseUrl: string, overrides: Partial<OgCardSpec> = {}): OgCardSpec {
    const normalizedPage = normalizeMetaText(page).toLowerCase() || "home";
    const preset = MARKETING_PRESETS[normalizedPage] ?? MARKETING_PRESETS.home;
    const fallbackAsset = MARKETING_ASSET_FALLBACKS[normalizedPage] ?? MARKETING_ASSET_FALLBACKS.home;

    return {
        eyebrow: overrides.eyebrow ?? preset.eyebrow,
        title: overrides.title ? truncateMetaText(overrides.title, 90) : preset.title,
        description: overrides.description ? truncateMetaText(overrides.description, 170) : preset.description,
        asset: assetUrl(baseUrl, overrides.asset, fallbackAsset),
        assetAlt: overrides.assetAlt ?? preset.title,
        accent: normalizeAccent(overrides.accent, preset.accent),
        chips: overrides.chips ?? preset.chips,
        stats: overrides.stats ?? preset.stats,
        avatar: overrides.avatar ? assetUrl(baseUrl, overrides.avatar, fallbackAsset) : undefined,
        avatarLabel: overrides.avatarLabel,
        footer: overrides.footer ?? DEFAULT_FOOTER,
    };
}

function repoSpec(params: URLSearchParams, baseUrl: string): OgCardSpec {
    const owner = normalizeMetaText(params.get("owner")) || "developer";
    const repo = normalizeMetaText(params.get("repo")) || "repository";
    const description = truncateMetaText(params.get("description") || "Analyze architecture, code quality, and security with RepoMind.", 170);
    const stars = safeInt(params.get("stars"));
    const forks = safeInt(params.get("forks"));
    const language = normalizeMetaText(params.get("language"));
    const mode = inferChatIntent(params.get("mode"));
    const accent = normalizeAccent(params.get("accent"), mode === "security" ? "#ef4444" : "#60a5fa");

    const chips = [
        mode === "general" ? "Repo chat" : `${chatIntentLabel(mode)} chat`,
        stars !== null ? `${stars.toLocaleString()} stars` : "Live context",
        language ? language : "GitHub repo",
    ];

    const stats: OgCardStat[] = [
        { label: "Stars", value: stars !== null ? stars.toLocaleString() : "Live" },
        { label: "Forks", value: forks !== null ? forks.toLocaleString() : "Context" },
        { label: "Lang", value: language || "GitHub" },
    ];

    return {
        eyebrow: mode === "general" ? "Repository Chat" : `${chatIntentLabel(mode)} Repo Chat`,
        title: truncateMetaText(`${owner}/${repo}`, 90),
        description: mode === "general" ? description : `${chatIntentDescription(mode)} ${description}`,
        asset: assetUrl(baseUrl, params.get("asset"), "/assets/repo_profile.png"),
        assetAlt: `${owner}/${repo} repository preview`,
        accent,
        chips,
        stats,
        avatar: makeOwnerAvatar(baseUrl, owner),
        avatarLabel: owner,
        footer: DEFAULT_FOOTER,
    };
}

function profileSpec(params: URLSearchParams, baseUrl: string): OgCardSpec {
    const username = normalizeMetaText(params.get("username")) || "developer";
    const name = normalizeMetaText(params.get("name"));
    const bio = truncateMetaText(params.get("bio") || "Developer profile analysis with cross-repo context.", 170);
    const repos = safeInt(params.get("repos"));
    const followers = safeInt(params.get("followers"));
    const following = safeInt(params.get("following"));
    const mode = inferChatIntent(params.get("mode"));
    const accent = normalizeAccent(params.get("accent"), "#14b8a6");

    return {
        eyebrow: mode === "general" ? "Developer Profile" : `${chatIntentLabel(mode)} Profile`,
        title: truncateMetaText(name ? `${name} (@${username})` : `@${username}`, 90),
        description: mode === "general"
            ? bio
            : `${chatIntentDescription(mode)} ${bio}`,
        asset: assetUrl(baseUrl, params.get("asset"), `https://github.com/${encodeURIComponent(username)}.png?size=512`),
        assetAlt: `${username} profile avatar`,
        accent,
        chips: [
            repos !== null ? `${repos.toLocaleString()} repos` : "Profile intel",
            followers !== null ? `${followers.toLocaleString()} followers` : "Cross-repo",
            following !== null ? `${following.toLocaleString()} following` : "Open source",
        ],
        stats: [
            { label: "Repos", value: repos !== null ? repos.toLocaleString() : "Live" },
            { label: "Followers", value: followers !== null ? followers.toLocaleString() : "Profile" },
            { label: "Following", value: following !== null ? following.toLocaleString() : "Context" },
        ],
        avatar: makeProfileAvatar(baseUrl, username),
        avatarLabel: username,
        footer: DEFAULT_FOOTER,
    };
}

function reportSpec(params: URLSearchParams, baseUrl: string): OgCardSpec {
    const owner = normalizeMetaText(params.get("owner")) || "developer";
    const repo = normalizeMetaText(params.get("repo")) || "repository";
    const critical = safeInt(params.get("critical")) ?? 0;
    const high = safeInt(params.get("high")) ?? 0;
    const medium = safeInt(params.get("medium")) ?? 0;
    const low = safeInt(params.get("low")) ?? 0;
    const health = safeInt(params.get("health"));
    const grade = normalizeMetaText(params.get("grade"));
    const trend = normalizeMetaText(params.get("trend"));
    const depth = normalizeMetaText(params.get("depth"));
    const shared = normalizeMetaText(params.get("shared"));
    const accent = normalizeAccent(params.get("accent"), critical > 0 ? "#ef4444" : "#22c55e");

    return {
        eyebrow: shared ? "Shared Security Report" : "Security Report",
        title: truncateMetaText(`${owner}/${repo}`, 90),
        description: buildReportSummaryDescription({
            critical,
            high,
            medium,
            low,
            score: health ?? undefined,
            grade: grade || undefined,
            trend: trend || undefined,
        }),
        asset: assetUrl(baseUrl, params.get("asset"), "/assets/security_report.png"),
        assetAlt: `${owner}/${repo} security report preview`,
        accent,
        chips: [
            health !== null ? `Health ${health}/100` : "Security scan",
            grade ? `Grade ${grade}` : `${critical + high + medium + low} findings`,
            depth || "RepoMind report",
        ],
        stats: [
            { label: "Critical", value: critical.toLocaleString() },
            { label: "High", value: high.toLocaleString() },
            { label: "Medium", value: medium.toLocaleString() },
        ],
        avatar: makeOwnerAvatar(baseUrl, owner),
        avatarLabel: owner,
        footer: DEFAULT_FOOTER,
    };
}

function blogSpec(params: URLSearchParams, baseUrl: string): OgCardSpec {
    const title = normalizeMetaText(params.get("title")) || "RepoMind Insights";
    const description = truncateMetaText(params.get("description") || "Engineering notes, security writeups, and product thinking from RepoMind.", 170);
    const category = normalizeMetaText(params.get("category")) || "Insights";
    const author = normalizeMetaText(params.get("author"));
    const readTime = normalizeMetaText(params.get("readTime"));
    const accent = normalizeAccent(params.get("accent"), "#a855f7");

    return {
        eyebrow: "Blog",
        title: truncateMetaText(title, 90),
        description,
        asset: assetUrl(baseUrl, params.get("image"), "/assets/repomind_capabilities.png"),
        assetAlt: `${title} cover image`,
        accent,
        chips: [
            category,
            author || "RepoMind",
            readTime || "Fresh insight",
        ],
        stats: [
            { label: "Format", value: "Article" },
            { label: "Lens", value: "Engineering" },
        ],
        footer: DEFAULT_FOOTER,
    };
}

function topicSpec(params: URLSearchParams, baseUrl: string): OgCardSpec {
    const topic = normalizeMetaText(params.get("topic")) || "topic";
    const description = truncateMetaText(params.get("description") || `Curated open-source repositories for ${topic}.`, 170);
    const repos = safeInt(params.get("repos"));
    const stars = safeInt(params.get("stars"));
    const topRepo = normalizeMetaText(params.get("topRepo"));
    const accent = normalizeAccent(params.get("accent"), "#38bdf8");

    return {
        eyebrow: "Topic Hub",
        title: truncateMetaText(`Best ${topic} repositories`, 90),
        description,
        asset: assetUrl(baseUrl, params.get("asset"), "/assets/architecture_example.png"),
        assetAlt: `${topic} repository topic preview`,
        accent,
        chips: [
            repos !== null ? `${repos.toLocaleString()} repos` : "Curated",
            stars !== null ? `${stars.toLocaleString()} stars` : "Search intent",
            topRepo || "GitHub topics",
        ],
        stats: [
            { label: "Repos", value: repos !== null ? repos.toLocaleString() : "Live" },
            { label: "Stars", value: stars !== null ? stars.toLocaleString() : "Topics" },
        ],
        footer: DEFAULT_FOOTER,
    };
}

export function resolveOgCardSpec(params: URLSearchParams, baseUrl: string): OgCardSpec {
    const rawType = normalizeMetaText(params.get("type")).toLowerCase();

    if (rawType === "repo") {
        return repoSpec(params, baseUrl);
    }
    if (rawType === "profile") {
        return profileSpec(params, baseUrl);
    }
    if (rawType === "report") {
        return reportSpec(params, baseUrl);
    }
    if (rawType === "blog") {
        return blogSpec(params, baseUrl);
    }
    if (rawType === "topic") {
        return topicSpec(params, baseUrl);
    }
    if (rawType === "marketing") {
        return marketingSpec(params.get("variant"), baseUrl, {
            title: params.get("title") ?? undefined,
            description: params.get("description") ?? undefined,
            asset: params.get("asset") ?? undefined,
            assetAlt: params.get("assetAlt") ?? undefined,
            accent: params.get("accent") ?? undefined,
            eyebrow: params.get("eyebrow") ?? undefined,
            avatar: params.get("avatar") ?? undefined,
            avatarLabel: params.get("avatarLabel") ?? undefined,
            footer: params.get("footer") ?? undefined,
        });
    }

    return marketingSpec("home", baseUrl);
}

function statToneBorder(index: number, accent: string): string {
    return index % 2 === 0 ? accent : "rgba(255,255,255,0.08)";
}

export function OgCard({ spec }: { spec: OgCardSpec }) {
    const titleLength = spec.title.length;
    const titleFontSize = titleLength > 90 ? 56 : titleLength > 70 ? 60 : 68;
    const descriptionFontSize = spec.description.length > 150 ? 28 : 30;

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#09090b",
                backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.28), transparent 26%), radial-gradient(circle at 80% 18%, rgba(59, 130, 246, 0.22), transparent 24%), linear-gradient(135deg, #09090b 0%, #111827 52%, #020617 100%)",
                color: "#fff",
                padding: "48px 56px",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "84px 84px",
                    opacity: 0.4,
                    pointerEvents: "none",
                }}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "999px",
                        border: `1px solid ${spec.accent}`,
                        backgroundColor: "rgba(9, 9, 11, 0.7)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 18px 50px rgba(0, 0, 0, 0.28)",
                    }}
                >
                    <div
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "10px",
                            background: `linear-gradient(135deg, ${spec.accent}, rgba(255,255,255,0.92))`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#09090b",
                            fontWeight: 800,
                            fontSize: "14px",
                        }}
                    >
                        RM
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>RepoMind</div>
                        <div style={{ fontSize: "11px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.18em" }}>Agentic CAG</div>
                    </div>
                </div>

                <div
                    style={{
                        padding: "10px 14px",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                        color: "#d4d4d8",
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                    }}
                >
                    {spec.eyebrow}
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 0.9fr",
                    gap: "36px",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 2,
                    flex: 1,
                    minHeight: 0,
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 12px",
                                borderRadius: "999px",
                                border: `1px solid ${spec.accent}`,
                                color: spec.accent,
                                backgroundColor: "rgba(255,255,255,0.03)",
                                fontSize: "12px",
                                fontWeight: 700,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                marginBottom: "18px",
                            }}
                        >
                            {spec.eyebrow}
                        </div>
                        <div
                            style={{
                                fontSize: `${titleFontSize}px`,
                                lineHeight: 1.02,
                                letterSpacing: "-0.05em",
                                fontWeight: 800,
                                maxWidth: "780px",
                                overflowWrap: "break-word",
                                wordBreak: "normal",
                                whiteSpace: "normal",
                                textShadow: "0 18px 40px rgba(0, 0, 0, 0.38)",
                            }}
                        >
                            {spec.title}
                        </div>
                    </div>

                    <div
                        style={{
                            maxWidth: "780px",
                            fontSize: `${descriptionFontSize}px`,
                            lineHeight: 1.35,
                            color: "#d4d4d8",
                            overflowWrap: "break-word",
                            wordBreak: "normal",
                            whiteSpace: "normal",
                        }}
                    >
                        {spec.description}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                        {spec.chips.map((chip) => (
                            <div
                                key={chip}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "999px",
                                    border: `1px solid ${spec.accent}`,
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    boxShadow: `0 0 0 1px rgba(255,255,255,0.02) inset`,
                                }}
                            >
                                {chip}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        alignSelf: "stretch",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "14px 16px",
                            borderRadius: "24px",
                            border: `1px solid ${spec.accent}`,
                            backgroundColor: "rgba(255,255,255,0.04)",
                            boxShadow: "0 24px 70px rgba(0, 0, 0, 0.24)",
                        }}
                    >
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "18px",
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.08)",
                                flexShrink: 0,
                                backgroundColor: "rgba(255,255,255,0.04)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {spec.avatar ? (
                                <img
                                    src={spec.avatar}
                                    alt={spec.avatarLabel ?? spec.assetAlt}
                                    width={56}
                                    height={56}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{ color: spec.accent, fontWeight: 800, fontSize: "20px" }}>RM</div>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                            <div style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {spec.title}
                            </div>
                            <div style={{ fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                                {spec.eyebrow}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            position: "relative",
                            flex: 1,
                            borderRadius: "28px",
                            overflow: "hidden",
                            border: `1px solid ${spec.accent}`,
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                            boxShadow: "0 28px 90px rgba(0, 0, 0, 0.36)",
                            minHeight: 0,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: `radial-gradient(circle at 20% 20%, ${spec.accent}33, transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 30%)`,
                                pointerEvents: "none",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                zIndex: 2,
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            {spec.stats.slice(0, 2).map((stat, index) => (
                                <div
                                    key={`${stat.label}-${stat.value}`}
                                    style={{
                                        padding: "10px 12px",
                                        minWidth: "92px",
                                        borderRadius: "18px",
                                        border: `1px solid ${statToneBorder(index, spec.accent)}`,
                                        backgroundColor: "rgba(9, 9, 11, 0.72)",
                                        backdropFilter: "blur(12px)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                    }}
                                >
                                    <div style={{ fontSize: "10px", color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "18px",
                            }}
                        >
                            <img
                                src={spec.asset}
                                alt={spec.assetAlt}
                                width={520}
                                height={420}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "20px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    boxShadow: "0 18px 60px rgba(0, 0, 0, 0.28)",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                        }}
                    >
                        {spec.stats.map((stat) => (
                            <div
                                key={`${stat.label}-${stat.value}-footer`}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "10px 14px",
                                    borderRadius: "999px",
                                    border: `1px solid rgba(255,255,255,0.12)`,
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    color: "#fff",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                }}
                            >
                                <span style={{ color: spec.accent, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "10px" }}>
                                    {stat.label}
                                </span>
                                <span>{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 2,
                    marginTop: "12px",
                    paddingTop: "18px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <div style={{ fontSize: "14px", color: "#a1a1aa", maxWidth: "70%" }}>
                    {spec.footer ?? DEFAULT_FOOTER}
                </div>
                <div
                    style={{
                        padding: "10px 14px",
                        borderRadius: "999px",
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: `1px solid ${spec.accent}`,
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                    }}
                >
                    {spec.eyebrow}
                </div>
            </div>
        </div>
    );
}
