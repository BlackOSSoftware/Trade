"use client";

import {
    Plus,
    Check,
    Search,
    Folder,
    Home,
    X,
    ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
    useInstrumentSearch,
    useSegmentInstruments,
    useWatchlistActions,
    useWatchlist,
} from "@/queries/watchlist.queries";

type Mode = "idle" | "search" | "segment";

const SEGMENTS = [
    { key: "FOREX", label: "Forex", },
    { key: "INDEX", label: "Indexes", },
    { key: "METAL", label: "Metals", },
    { key: "CRYPTO", label: "CRYPTO", },
];

export default function AddSymbolSearch({
    token,
    accountId,
}: {
    token: string;
    accountId: string;
}) {
    const [q, setQ] = useState("");
    const [segment, setSegment] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("idle");

    const dq = useDebounce(q, 300);

    /* SOURCE OF TRUTH */
    const watchlistQuery = useWatchlist(accountId);
    const watchlistSet = useMemo(
        () => new Set((watchlistQuery.data ?? []).map((w) => w.code)),
        [watchlistQuery.data]
    );

    const searchQuery = useInstrumentSearch(dq);
    const segmentQuery = useSegmentInstruments(segment, accountId);
    const { add, remove } = useWatchlistActions(accountId);

    let data: any[] = [];
    if (mode === "search") data = searchQuery.data ?? [];
    if (mode === "segment") data = segmentQuery.data ?? [];

    const resetToHome = () => {
        setMode("idle");
        setSegment(null);
        setQ("");
    };

    return (
        <>
            {/* SEARCH BAR */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-soft)]">
                <Search size={16} className="text-[var(--text-muted)]" />

                <input
                    value={q}
                    onChange={(e) => {
                        const v = e.target.value;
                        setQ(v);
                        setSegment(null);
                        setMode(v.length >= 2 ? "search" : "idle");
                    }}
                    placeholder="Find symbols"
                    className="flex-1 bg-transparent outline-none text-sm"
                />

                {q && (
                    <button
                        onClick={() => {
                            setQ("");
                            setMode("idle");
                        }}
                    >
                        <X size={16} className="text-[var(--text-muted)]" />
                    </button>
                )}
            </div>

            {/* BREADCRUMB / HOME */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-soft)] text-sm">
                <button
                    onClick={resetToHome}
                    className="flex items-center gap-1 text-[var(--text-muted)]"
                >
                    <Home size={16} />

                </button>

                {mode === "segment" && segment && (
                    <>
                        <ChevronRight size={14} className="text-[var(--text-muted)]" />
                        <span className="font-medium">
                            {SEGMENTS.find((s) => s.key === segment)?.label}
                        </span>
                    </>
                )}
            </div>

            {/* SEGMENT FOLDERS */}
            {mode === "idle" &&
                SEGMENTS.map((s) => {
                    const addedCount =
                        watchlistQuery.data?.filter(
                            (w) => w.segment === s.key
                        ).length ?? 0;

                    return (
                        <button
                            key={s.key}
                            onClick={() => {
                                setSegment(s.key);
                                setMode("segment");
                                setQ("");
                            }}
                            className="w-full px-4 py-4 flex items-center justify-between border-b border-[var(--border-soft)]"
                        >
                            <div className="flex items-center gap-3">
                                <Folder
                                    size={18}
                                    className="text-yellow-400 shrink-0"
                                    strokeWidth={2.2}
                                    fill="currentColor"
                                />
                                <span className="text-sm">{s.label}</span>
                            </div>

                            <ChevronRight size={16} className="text-[var(--text-muted)]" />
                        </button>
                    );
                })}

            {/* SYMBOL LIST */}
            {(mode === "search" || mode === "segment") &&
                data.map((i) => {
                    const isAdded = watchlistSet.has(i.code);

                    return (
                        <div
                            key={i.code}
                            className="px-4 py-4 border-b border-[var(--border-soft)] flex justify-between items-center"
                        >
                            <div>
                                <div className="text-sm">{i.code}</div>
                                <div className="text-xs text-[var(--text-muted)]">
                                    {i.name}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    isAdded ? remove.mutate(i.code) : add.mutate(i.code)
                                }
                                className={`h-7 w-7 rounded-full flex items-center justify-center
                  ${isAdded
                                        ? "bg-[var(--primary)] text-white"
                                        : "border border-[var(--border-soft)]"
                                    }`}
                            >
                                {isAdded ? <Check size={14} /> : <Plus size={14} />}
                            </button>
                        </div>
                    );
                })}
        </>
    );
}
