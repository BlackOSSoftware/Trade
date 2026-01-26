"use client";

import { useState } from "react";
import {
    ArrowDownUp,
    MoreHorizontal,
    FilePlus,
} from "lucide-react";

import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";

type AccountStat = {
    label: string;
    value: string;
};

type Position = {
    id: string;
    pair: string;
    type: string;
    lot: number;
    from: string;
    to: string;
    profit: number;
    openTime: string;
    swap: string;
};

export default function TradePage() {
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [bulkOpen, setBulkOpen] = useState<boolean>(false);

    const accountStats: AccountStat[] = [
        { label: "Balance", value: "100 000.00" },
        { label: "Equity", value: "99 723.53" },
        { label: "Margin", value: "1 170.00" },
        { label: "Free margin", value: "98 553.53" },
        { label: "Margin Level (%)", value: "8 523.38" },
    ];

    const positions: Position[] = [
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
            profit: -73.7,
            openTime: "2026.01.09 18:21:09",
            swap: "-1.24",
        },
    ];

    return (
        <>
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

            <div className="px-2 md:px-0  text-[13px] bg-[var(--bg-plan)] md:bg-[var(--bg-card)] h-full overflow-y-auto">

                {/* ================= MOBILE (UNCHANGED) ================= */}
                <div className="md:hidden">

                    <div className="space-y-[6px]">
                        {accountStats.map((row) => (
                            <div key={row.label} className="flex items-center gap-2">
                                <span className="text-[var(--text-main)] font-semibold whitespace-nowrap">
                                    {row.label}:
                                </span>

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

                                <span className="font-semibold whitespace-nowrap">
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2">
                        <div className="flex justify-between items-center py-[3px] bg-[var(--bg-glass)]">
                            <span className="text-[var(--text-muted)] font-semibold">
                                Positions
                            </span>
                            <button onClick={() => setBulkOpen(true)}>
                                <MoreHorizontal />
                            </button>
                        </div>

                        {positions.map((pos) => {
                            const expanded = expandedId === pos.id;

                            return (
                                <div
                                    key={pos.id}
                                    className="border-b border-[color:var(--text-muted)]/20 bg-[var(--bg-plan)] mt-font"
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedId(expanded ? null : pos.id)
                                        }
                                        className="w-full flex justify-between items-center pt-[10px] pb-[8px]"
                                    >
                                        <div className="text-left">
                                            <div className="font-semibold">
                                                {pos.pair},{" "}
                                                <span className="text-[var(--mt-blue)]">
                                                    {pos.type} {pos.lot}
                                                </span>
                                            </div>
                                            <div className="mt-price-line">
                                                {pos.from} → {pos.to}
                                            </div>
                                        </div>

                                        <div
                                            className={`font-semibold ${pos.profit < 0
                                                    ? "text-[var(--mt-red)]"
                                                    : "text-[var(--mt-blue)]"
                                                }`}
                                        >
                                            {pos.profit.toFixed(2)}
                                        </div>
                                    </button>

                                    {expanded && (
                                        <div className="px-[2px] pb-[8px] text-[11px] space-y-[3px]">
                                            <div className="opacity-70">#{pos.id}</div>
                                            <div className="flex justify-between">
                                                <span>Open:</span>
                                                <span>{pos.openTime}</span>
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

                {/* ================= DESKTOP ================= */}
                <div className="hidden md:block pt-4">

                    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-md overflow-hidden shadow-sm">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)] bg-[var(--bg-glass)]">
                            <div className="font-semibold text-[14px]">
                                Positions ({positions.length})
                            </div>
                        </div>

                        {/* Column Header */}
                        <div className="grid grid-cols-12 px-4 py-2 text-[12px] font-semibold text-[var(--text-muted)] border-b border-[var(--border-soft)]">
                            <div>ID</div>
                            <div>TIME</div>
                            <div>SYMBOL</div>
                            <div>ORDER</div>
                            <div>LOT</div>
                            <div>PRICE</div>
                            <div>SL</div>
                            <div>TP</div>
                            <div>SWAP</div>
                            <div>LTP</div>
                            <div className="col-span-2 text-right">PROFIT</div>
                        </div>

                        {/* Rows */}
                        {positions.length > 0 ? (
                            positions.map((pos) => (
                                <div
                                    key={pos.id}
                                    className="grid grid-cols-12 px-4 py-2 text-[13px] border-b border-[var(--border-soft)] hover:bg-[var(--bg-glass)] transition"
                                >
                                    <div>{pos.id}</div>
                                    <div>{pos.openTime}</div>
                                    <div className="font-semibold">{pos.pair}</div>
                                    <div className="text-[var(--mt-blue)]">
                                        {pos.type}
                                    </div>
                                    <div>{pos.lot}</div>
                                    <div>{pos.from}</div>
                                    <div>-</div>
                                    <div>-</div>
                                    <div>{pos.swap}</div>
                                    <div>{pos.to}</div>

                                    <div
                                        className={`col-span-2 text-right font-semibold ${pos.profit < 0
                                                ? "text-[var(--mt-red)]"
                                                : "text-[var(--mt-blue)]"
                                            }`}
                                    >
                                        {pos.profit.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-[var(--text-muted)]">
                                No Order(s) Found
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
