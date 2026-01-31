"use client";

import { useMemo, useState } from "react";
import {
    ArrowDownUp,
    MoreHorizontal,
    FilePlus,
} from "lucide-react";
import TopBarSlot from "../components/layout/TopBarSlot";
import TradeTopBar from "../components/layout/TradeTopBar";
import { useTradeAccount } from "@/hooks/accounts/useAccountById";
import { useLiveTradeSocket } from "@/hooks/useLiveTradeSocket";

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
    stopLoss?: number | null;
    takeProfit?: number | null;
};

export default function TradePage() {
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [bulkOpen, setBulkOpen] = useState<boolean>(false);
    const { data: tradeAccount } = useTradeAccount();

    const accountId = tradeAccount?.accountId;

    const { account, positions } = useLiveTradeSocket(accountId);
    const marginLevel =
        account && account.usedMargin > 0
            ? ((account.equity / account.usedMargin) * 100).toFixed(2)
            : "0.00";

    const accountStats: AccountStat[] = account
        ? [
            { label: "Balance", value: account.balance.toFixed(2) },
            { label: "Equity", value: account.equity.toFixed(2) },
            { label: "Margin", value: account.usedMargin.toFixed(2) },
            { label: "Free margin", value: account.freeMargin.toFixed(2) },
            { label: "Margin Level (%)", value: marginLevel },
        ]
        : [];



    const livePositions: Position[] = useMemo(() => {
        return positions.map((pos) => ({
            id: pos.positionId,
            pair: pos.symbol,
            type: pos.side.toLowerCase(),
            lot: pos.volume ?? 0,
            from: pos.openPrice?.toFixed(2) ?? "-",
            to: pos.currentPrice?.toFixed(2) ?? "-",
            profit: pos.floatingPnL ?? 0,
           openTime: pos.openTime
  ? new Date(Number(pos.openTime)).toLocaleString()
  : "-",

            swap: pos.swap?.toFixed(2) ?? "0.00",
            stopLoss: pos.stopLoss ?? null,
            takeProfit: pos.takeProfit ?? null,
        }));
    }, [positions]);



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

                        </div>

                        {livePositions.map((pos) => {
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
                                                <span
                                                    className={
                                                        pos.type === "buy"
                                                            ? "text-[var(--mt-blue)]"
                                                            : "text-[var(--mt-red)]"
                                                    }
                                                >
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
                                        <div className="px-[2px] pb-[8px] text-[11px] space-y-[3px] grid grid-cols-2">
                                            <div className="opacity-70 mr-2">
                                                #{pos.id.slice(0, 10)}
                                            </div>

                                            <div className="flex justify-between mr-2">
                                                <span>Open:</span>
                                                <span>{pos.openTime || "-"}</span>
                                            </div>

                                            <div className="flex justify-between mr-2">
                                                <span>S / L:</span>
                                                <span>{pos.stopLoss ?? "-"}</span>
                                            </div>

                                            <div className="flex justify-between mr-2">
                                                <span>Swap:</span>
                                                <span>{pos.swap ?? "-"}</span>
                                            </div>

                                            <div className="flex justify-between mr-2">
                                                <span>T / P:</span>
                                                <span>{pos.takeProfit ?? "-"}</span>
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
                        {livePositions.length > 0 ? (
                            livePositions.map((pos) => (
                                <div
                                    key={pos.id}
                                    className="grid grid-cols-12 px-4 py-2 text-[13px] border-b border-[var(--border-soft)] hover:bg-[var(--bg-glass)] transition"
                                >
                                    <div>{pos.id.slice(0, 10)}</div>
                                    <div>{pos.openTime}</div>
                                    <div className="font-semibold">{pos.pair}</div>
                                    <div className={
                                        pos.type === "buy"
                                            ? "text-[var(--mt-blue)]"
                                            : "text-[var(--mt-red)]"
                                    }
                                    >
                                        {pos.type} {pos.lot}
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
