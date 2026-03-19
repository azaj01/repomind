import { Loader2 } from "lucide-react";

interface StreamStatusProps {
    message?: string;
    isStreaming: boolean;
}

export function StreamStatus({ message, isStreaming }: StreamStatusProps) {
    if (!isStreaming || !message) return null;

    return (
        <div className="not-prose mb-1.5 w-full max-w-full rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2.5 min-h-10 overflow-hidden">
            <div className="flex items-center gap-2 text-sm leading-5 text-zinc-300 min-w-0">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400 shrink-0" />
                <span className="truncate flex-1 min-w-0">{message}</span>
            </div>
        </div>
    );
}
