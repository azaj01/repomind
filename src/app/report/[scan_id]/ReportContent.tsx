"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { StoredScan } from "@/lib/services/scan-storage";
import type { PriorScanDiff, ReportFindingView } from "@/lib/services/report-service";
import { getCanonicalSiteUrl } from "@/lib/site-url";
import { trackReportConversion } from "@/app/actions";
import { CodeBlock } from "@/components/CodeBlock";
import { LoginModal } from "@/components/LoginModal";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Copy,
    Flame,
    Info,
    MessageCircle,
    Shield,
    ShieldAlert,
    X,
} from "lucide-react";
import { toast } from "sonner";
import ShareButton from "./ShareButton";
import { ExportButtons } from "./components/ExportButtons";

const PENDING_FIX_STORAGE_KEY = "repomind_pending_fix_chat_v1";

const severityConfig = {
    critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: Flame },
    high: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: AlertTriangle },
    medium: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: AlertCircle },
    low: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Info },
    info: { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: CheckCircle },
} as const;

const confidenceConfig = {
    high: { label: "High Confidence", className: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
    medium: { label: "Medium Confidence", className: "text-yellow-300 border-yellow-500/30 bg-yellow-500/10" },
    low: { label: "Low Confidence", className: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10" },
} as const;

function SeverityBadge({ severity }: { severity: keyof typeof severityConfig }) {
    const config = severityConfig[severity] || severityConfig.info;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">{severity}</span>
        </span>
    );
}

function ConfidenceBadge({ confidence }: { confidence?: ReportFindingView["finding"]["confidence"] }) {
    if (!confidence) {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-zinc-700 bg-zinc-800 text-zinc-300">
                Confidence: Not Scored
            </span>
        );
    }

    const config = confidenceConfig[confidence];
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
            {config.label}
        </span>
    );
}

interface ReportContentProps {
    scan: StoredScan;
    priorScanDiff: PriorScanDiff;
    topFixes: ReportFindingView[];
    findingViews: ReportFindingView[];
    hasPreviousScan: boolean;
    isSharedView: boolean;
    canShareReport: boolean;
    canGenerateOutreach: boolean;
    shareMode: "canonical" | "copy-current-url";
    reportExpiresAt: number;
}

export function ReportContent({
    scan,
    priorScanDiff,
    topFixes,
    findingViews,
    hasPreviousScan,
    isSharedView,
    canShareReport,
    canGenerateOutreach,
    shareMode,
    reportExpiresAt,
}: ReportContentProps) {
    const baseUrl = getCanonicalSiteUrl();
    const reportRef = useRef<HTMLDivElement>(null);
    const date = new Date(scan.timestamp);
    const { data: session } = useSession();
    const router = useRouter();
    const [previewFinding, setPreviewFinding] = useState<ReportFindingView | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginCallbackUrl, setLoginCallbackUrl] = useState<string | undefined>(undefined);

    const topFixesByFingerprint = useMemo(() => {
        const fpSet = new Set(topFixes.map((item) => item.fingerprint));
        return findingViews.filter((view) => fpSet.has(view.fingerprint)).slice(0, 3);
    }, [findingViews, topFixes]);

    useEffect(() => {
        if (!session?.user) return;

        const raw = sessionStorage.getItem(PENDING_FIX_STORAGE_KEY);
        if (!raw) return;

        try {
            const pending = JSON.parse(raw) as { scanId?: string; chatHref?: string };
            if (pending.scanId !== scan.id || typeof pending.chatHref !== "string") {
                return;
            }

            sessionStorage.removeItem(PENDING_FIX_STORAGE_KEY);
            void trackReportConversion("report_fix_login_completed", scan.id);
            void trackReportConversion("report_fix_chat_started", scan.id);
            router.push(pending.chatHref);
        } catch {
            sessionStorage.removeItem(PENDING_FIX_STORAGE_KEY);
        }
    }, [router, scan.id, session?.user]);

    const handleCopyPrompt = async (view: ReportFindingView) => {
        if (!session?.user) {
            const callbackUrl = window.location.href;
            sessionStorage.setItem(
                PENDING_FIX_STORAGE_KEY,
                JSON.stringify({ scanId: scan.id, chatHref: view.chatHref })
            );
            setLoginCallbackUrl(callbackUrl);
            setShowLoginModal(true);
            void trackReportConversion("report_fix_login_gate_shown", scan.id);
            return;
        }

        try {
            await navigator.clipboard.writeText(view.fixPrompt);
            void trackReportConversion("report_fix_prompt_copied", scan.id);
            toast.success("Fix prompt copied");
        } catch {
            toast.error("Failed to copy prompt");
        }
    };

    const openPromptPreview = (view: ReportFindingView) => {
        if (!session?.user) {
            const callbackUrl = window.location.href;
            sessionStorage.setItem(
                PENDING_FIX_STORAGE_KEY,
                JSON.stringify({ scanId: scan.id, chatHref: view.chatHref })
            );
            setLoginCallbackUrl(callbackUrl);
            setShowLoginModal(true);
            void trackReportConversion("report_fix_login_gate_shown", scan.id);
            return;
        }
        setPreviewFinding(view);
        void trackReportConversion("report_fix_prompt_previewed", scan.id);
    };

    const handleContinueFixInChat = () => {
        if (!previewFinding) return;

        if (session?.user) {
            void trackReportConversion("report_fix_chat_started", scan.id);
            router.push(previewFinding.chatHref);
            return;
        }

        const callbackUrl = window.location.href;
        sessionStorage.setItem(
            PENDING_FIX_STORAGE_KEY,
            JSON.stringify({ scanId: scan.id, chatHref: previewFinding.chatHref })
        );
        setLoginCallbackUrl(callbackUrl);
        setShowLoginModal(true);
        setPreviewFinding(null);
        void trackReportConversion("report_fix_login_gate_shown", scan.id);
    };

    const handleFalsePositive = () => {
        void trackReportConversion("report_false_positive_flagged", scan.id);
        toast.success("Feedback received. We'll use this signal to improve scan quality.");
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 selection:bg-indigo-500/30">
            <div className="max-w-4xl mx-auto space-y-8" ref={reportRef}>
                <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Shield className="w-5 h-5" />
                                <span className="text-sm font-medium tracking-wide uppercase">
                                    {isSharedView ? "Shared Security Report" : "Security Report"}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                                <span className="text-zinc-500 font-normal">{scan.owner} / </span>
                                {scan.repo}
                            </h1>
                            <div className="text-sm text-zinc-400 flex flex-wrap items-center gap-3">
                                <span>Scanned on {date.toLocaleDateString()} at {date.toLocaleTimeString()}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs">
                                    {scan.depth === "deep" ? "Deep Analysis" : "Quick Scan"}
                                </span>
                                {isSharedView && (
                                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                                        Shared via signed link
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="print:hidden flex flex-col gap-3 lg:items-end">
                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                <button
                                    onClick={() => router.push(`/chat?q=${encodeURIComponent(`${scan.owner}/${scan.repo}`)}`)}
                                    className="flex items-center justify-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-all border border-white/10 whitespace-nowrap"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Open Repo Chat
                                </button>
                                {canShareReport && (
                                    <ShareButton
                                        scanId={scan.id}
                                        canGenerateOutreach={canGenerateOutreach}
                                        shareMode={shareMode}
                                        reportExpiresAt={reportExpiresAt}
                                    />
                                )}
                            </div>
                            <ExportButtons scan={scan} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(Object.keys(severityConfig) as Array<keyof typeof severityConfig>).map((sev) => {
                        const count = scan.summary[sev] || 0;
                        const config = severityConfig[sev];
                        const Icon = config.icon;

                        return (
                            <div key={sev} className={`p-4 rounded-xl border ${count > 0 ? config.border : "border-white/5"} ${count > 0 ? config.bg : "bg-zinc-900/50"} flex flex-col items-center justify-center text-center`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon className={`w-4 h-4 ${count > 0 ? config.color : "text-zinc-600"}`} />
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${count > 0 ? config.color : "text-zinc-500"}`}>{sev}</span>
                                </div>
                                <span className={`text-3xl font-bold ${count > 0 ? "text-white" : "text-zinc-700"}`}>{count}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 bg-zinc-900/70 border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <h3 className="text-lg font-medium text-zinc-100">What Changed Since Last Scan</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-zinc-400 bg-zinc-950">
                            {hasPreviousScan ? "Compared to previous scan" : "Baseline scan"}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">
                        {hasPreviousScan
                            ? "Use this delta to prioritize newly introduced risk, then resolve historical findings."
                            : "No earlier scan found for this repository yet. This report is your baseline for future change tracking."}
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                            <p className="text-xs uppercase tracking-wider text-red-300">New</p>
                            <p className="text-2xl font-bold text-white mt-1">{priorScanDiff.new}</p>
                        </div>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                            <p className="text-xs uppercase tracking-wider text-emerald-300">Resolved</p>
                            <p className="text-2xl font-bold text-white mt-1">{priorScanDiff.resolved}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-500/20 bg-zinc-500/10 p-4">
                            <p className="text-xs uppercase tracking-wider text-zinc-300">Unchanged</p>
                            <p className="text-2xl font-bold text-white mt-1">{priorScanDiff.unchanged}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-zinc-900 border border-white/10 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-medium text-zinc-100">Fix These First</h3>
                        <span className="text-xs text-zinc-400 border border-white/10 rounded-full px-2.5 py-1">
                            Ranked by impact, confidence, and exploitability
                        </span>
                    </div>
                    {topFixesByFingerprint.length === 0 ? (
                        <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/60 text-sm text-zinc-400">
                            No vulnerabilities to prioritize in this scan.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topFixesByFingerprint.map((view, rank) => (
                                <div key={`${view.fingerprint}:${rank}`} className="p-4 rounded-xl border border-white/10 bg-zinc-950/50 flex flex-col gap-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-1">
                                                Priority #{rank + 1}
                                            </span>
                                            <SeverityBadge severity={view.finding.severity as keyof typeof severityConfig} />
                                            <ConfidenceBadge confidence={view.finding.confidence} />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-100">{view.finding.title}</p>
                                        <p className="text-xs text-zinc-400">
                                            {view.finding.file}{view.finding.line ? `:${view.finding.line}` : ""} • Triage score {view.triageScore}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleCopyPrompt(view)}
                                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-all"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy Fix Prompt
                                        </button>
                                        <button
                                            onClick={() => openPromptPreview(view)}
                                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Fix in Repo Chat
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b border-white/10 pb-2">Detailed Findings ({findingViews.length})</h3>

                    {findingViews.length === 0 ? (
                        <div className="p-8 text-center bg-zinc-900/50 border border-white/5 rounded-xl">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                            <h4 className="text-zinc-300 font-medium mb-1">No vulnerabilities found</h4>
                            <p className="text-zinc-500 text-sm">This repository looks clean based on the scan configuration.</p>
                        </div>
                    ) : (
                        findingViews.map((view) => (
                            <div key={`${view.fingerprint}:${view.index}`} className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden shadow-lg" style={{ pageBreakInside: "avoid" }}>
                                <div className="p-5 border-b border-white/5 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <SeverityBadge severity={view.finding.severity as keyof typeof severityConfig} />
                                            <span className="px-2.5 py-1 bg-zinc-800 rounded-full text-xs font-mono text-zinc-300 border border-zinc-700">
                                                {view.finding.type}
                                            </span>
                                            <ConfidenceBadge confidence={view.finding.confidence} />
                                            {(view.finding.cwe || view.finding.cvss) && (
                                                <span className="text-xs text-zinc-500 flex items-center gap-2">
                                                    {view.finding.cwe && <span>{view.finding.cwe}</span>}
                                                    {view.finding.cvss && <span>CVSS: {view.finding.cvss}</span>}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-medium text-zinc-100">{view.finding.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-2 print:hidden">
                                        <button
                                            onClick={() => handleCopyPrompt(view)}
                                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-all"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy Prompt
                                        </button>
                                        <button
                                            onClick={() => openPromptPreview(view)}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Fix in Repo Chat
                                        </button>
                                        <button
                                            onClick={handleFalsePositive}
                                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold transition-all border border-zinc-700"
                                        >
                                            <ShieldAlert className="w-4 h-4" />
                                            False Positive
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5 space-y-6">
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Proof</h5>
                                        <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300 whitespace-pre-wrap">
                                            {view.proof}
                                        </div>
                                        <p className="text-xs text-zinc-500">{view.confidenceRationale}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Impact</h5>
                                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
                                            {view.impact}
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex flex-col">
                                        <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Recommendation</h5>
                                        <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg">
                                            <p className="text-sm text-indigo-200">{view.finding.recommendation}</p>
                                        </div>
                                    </div>

                                    {view.finding.snippet && (
                                        <div className="space-y-2 pt-2">
                                            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Context Snippet</h5>
                                            <CodeBlock
                                                language={view.finding.file.split(".").pop() || "text"}
                                                value={view.finding.snippet}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="pt-8 text-center text-sm text-zinc-600 no-export">
                    <p>Generated by <a href={baseUrl} className="font-semibold text-zinc-500 hover:text-indigo-400 transition-colors">RepoMind</a> — The AI developer sidekick.</p>
                </div>
            </div>

            {previewFinding && (
                <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10">
                            <div>
                                <h4 className="text-sm font-semibold text-white">Fix Prompt Preview</h4>
                                <p className="text-xs text-zinc-400">
                                    {previewFinding.finding.file}{previewFinding.finding.line ? `:${previewFinding.finding.line}` : ""}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewFinding(null)}
                                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <CodeBlock language="markdown" value={previewFinding.fixPrompt} />
                        </div>
                        <div className="p-4 border-t border-white/10 flex flex-wrap justify-end gap-2">
                            <button
                                onClick={() => handleCopyPrompt(previewFinding)}
                                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-all"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Prompt
                            </button>
                            <button
                                onClick={handleContinueFixInChat}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Continue to Repo Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                title="Sign in to start remediation chat"
                description="Your prompt preview is ready. Sign in to continue in Repo Chat with the prefilled fix prompt."
                callbackUrl={loginCallbackUrl}
            />
        </div>
    );
}
