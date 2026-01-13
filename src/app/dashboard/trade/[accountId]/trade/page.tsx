"use client";

import { useState } from "react";
import {
    ArrowDownUp,
    MoreHorizontal,
    FilePlus,
} from "lucide-react";

import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";

export default function TradePage() {
    const [sortOpen, setSortOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [bulkOpen, setBulkOpen] = useState(false);

    const accountStats = [
        { label: "Balance", value: "100 000.00" },
        { label: "Equity", value: "99 723.53" },
        { label: "Margin", value: "1 170.00" },
        { label: "Free margin", value: "98 553.53" },
        { label: "Margin Level (%)", value: "8 523.38" },
    ];

    const positions = [
        {
            id: "54620509825",
            pair: "USDRUB",
            type: "buy",
            lot: 0.05,
            from: "80.645",
            to: "77.505",
            profit: -202.57,
            openTime: "2026.01.09 16:28:46",
            swap: "0.00",
        },
        {
            id: "54620509826",
            pair: "USDJPY",
            type: "buy",
            lot: 0.04,
            from: "157.915",
            to: "157.912",
            profit: -0.08,
            openTime: "2026.01.09 17:02:11",
            swap: "-0.01",
        },
        {
            id: "54620509827",
            pair: "USDJPY",
            type: "buy",
            lot: 0.04,
            from: "157.914",
            to: "157.912",
            profit: -0.05,
            openTime: "2026.01.09 17:05:44",
            swap: "-0.01",
        },
        {
            id: "54620509828",
            pair: "USDJPY",
            type: "buy",
            lot: 1.04,
            from: "158.024",
            to: "157.912",
            profit: -73.70,
            openTime: "2026.01.09 18:21:09",
            swap: "-1.24",
        },
    ];

    return (
        <>
            {/* 🔝 SAME TOPBAR AS SETTINGS PAGE */}
            <TopBarSlot>
                <TradeTopBar
                    title="Trade"
                    subtitle="-276.47 USD"
                    showMenu
                    right={
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSortOpen(!sortOpen)}>
                                <ArrowDownUp size={18} />
                            </button>

                            <button>
                                <FilePlus size={20} />
                            </button>
                        </div>
                    }
                />
            </TopBarSlot>

            {/* ===== BODY ===== */}
            <div className="px-2 md:px-4 pt-1 text-[13px] bg-[var(--bg-plan)] min-h-auto">
                {/* SUMMARY */}
                <div className="space-y-[6px]">
                    {accountStats.map((row) => (
                        <div
                            key={row.label}
                            className="flex items-center gap-2"
                        >
                            {/* LABEL */}
                            <span className="text-[var(--text-main)] font-semibold whitespace-nowrap">
                                {row.label}:
                            </span>

                            {/* ONLY MIDDLE DOTTED LINE */}
                            <span
                                className="flex-1 h-[6px] translate-y-[5px]"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle, rgba(156,163,175,0.35) .5px, transparent 1.6px)",
                                    backgroundSize: "6px 6px",
                                    backgroundRepeat: "repeat-x",
                                    backgroundPosition: "left center",
                                }}
                            />

                            {/* VALUE */}
                            <span className="font-semibold whitespace-nowrap">
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>


                {/* POSITIONS */}
                <div className="mt-2">
                    <div className="flex justify-between items-center py-[3px] bg-[var(--bg-glass)] ">
                        <span className="text-[var(--text-muted)] font-semibold">Positions</span>
                        <button onClick={() => setBulkOpen(true)}>
                            <MoreHorizontal />
                        </button>
                    </div>

                    {positions.map((pos) => {
                        const expanded = expandedId === pos.id;

                        return (
                            <div key={pos.id} className="border-b border-[color:var(--text-muted)]/20 bg-[var(--bg-plan)] mt-font">
                                <button
                                    onClick={() =>
                                        setExpandedId(expanded ? null : pos.id)
                                    }
                                    className="w-full flex justify-between items-center pt-[10px] pb-[8px]"
                                >
                                    <div className="text-left">
                                        <div className="font-medium font-semibold">
                                            {pos.pair},{" "}
                                            <span className="text-[var(--mt-blue)]">

                                                <span className="text-[var(--mt-blue)]">
                                                    {pos.type}
                                                </span>{" "}
                                                {pos.lot}
                                            </span>
                                        </div>
                                        <div className="mt-price-line">
                                            {pos.from} → {pos.to}
                                        </div>
                                    </div>

                                    <div
                                        className={`font-medium text-[14px] font-semibold ${pos.profit < 0
                                            ? "text-[var(--mt-red)]"
                                            : "text-[var(--mt-blue)]"
                                            }`}
                                    >
                                        {pos.profit.toFixed(2)}
                                    </div>
                                </button>

                                {expanded && pos.openTime && (
                                    <div className="px-[2px] pb-[8px] text-[11px] text-[var(--text-main)] space-y-[3px]">
                                        <div className="opacity-70">#{pos.id}</div>

                                        <div className="flex justify-between">
                                            <span>Open:</span>
                                            <span>{pos.openTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>S/L:</span>
                                            <span>—</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>T/P:</span>
                                            <span>—</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Swap:</span>
                                            <span>{pos.swap}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* BULK OPERATIONS SHEET */}
            {bulkOpen && (
                <div className="fixed  inset-0 z-999 flex items-end justify-center bg-black/50" onClick={() => setBulkOpen(false)}>
                    <div className="w-full max-w-[420px] bg-[var(--bg-plan)] rounded-t-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center py-3 text-sm border-b border-white/10">Bulk Operations</div>


                        <button className="w-full px-4 py-4 text-left border-b border-white/10">Close All Positions</button>
                        <button className="w-full px-4 py-4 text-left">Close Profitable Positions</button>
                    </div>
                </div>
            )}
        </>
    );
}
