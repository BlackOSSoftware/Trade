"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { ArrowLeft } from "lucide-react";
import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
type SplitPrice = {
    int: string;
    normal: string;
    big: string;
    small?: string;
};

function splitPrice(price?: string): SplitPrice {
    if (!price || isNaN(Number(price))) {
        return {
            int: "0",
            normal: "",
            big: "00",
        };
    }

    const [intPart, decimalRaw = ""] = price.split(".");
    const decimals = decimalRaw;

    // No decimal
    if (decimals.length === 0) {
        return { int: intPart, normal: "", big: "" };
    }

    // Exactly 2 decimals → both BIG
    if (decimals.length === 2) {
        return {
            int: intPart,
            normal: "",
            big: decimals,
        };
    }

    // 3 or more decimals
    if (decimals.length >= 3) {
        return {
            int: intPart,
            normal: decimals.slice(0, decimals.length - 3),
            big: decimals.slice(decimals.length - 3, decimals.length - 1),
            small: decimals.slice(-1),
        };
    }

    // Only 1 decimal
    return {
        int: intPart,
        normal: decimals,
        big: "",
    };
}

export default function NewOrderPage() {
    const { accountId } = useParams<{ accountId: string }>();
    const search = useSearchParams();
    const router = useRouter();
    const symbol = search.get("symbol") || "";

    const [token, setToken] = useState("");
    const [volume, setVolume] = useState(0.01);

    useEffect(() => {
        const t = localStorage.getItem("accessToken");
        if (t) setToken(t);
    }, []);

    const quotes = useMarketQuotes(
        token ?? "",
        accountId
    );

    const live = quotes[symbol];

    const midPrice = useMemo(() => {
        if (!live) return 0;
        const bid = Number(live.bid);
        const ask = Number(live.ask);
        if (isNaN(bid) || isNaN(ask)) return 0;
        return (bid + ask) / 2;
    }, [live]);

    const stepButtons = useMemo(() => {
        if (!midPrice) return [];
        if (midPrice < 1) return [-0.5, -0.1, -0.01, 0.01, 0.1, 0.5];
        return [-5, -1, -0.1, 0.1, 1, 5];
    }, [midPrice]);

    if (!live) return (
        <>
            <GlobalLoader />
        </>
    );

    const bidColor =
        live.bidDir === "up"
            ? "text-[var(--mt-blue)]"
            : live.bidDir === "down"
                ? "text-[var(--mt-red)]"
                : "text-white";

    const askColor =
        live.askDir === "up"
            ? "text-[var(--mt-blue)]"
            : live.askDir === "down"
                ? "text-[var(--mt-red)]"
                : "text-white";

    return (
        <>
            <TopBarSlot>
                <TradeTopBar
                    title={symbol}
                    subtitle={getSymbolName(symbol)}
                    showMenu={false}
                    right={
                        <button onClick={() => router.back()}>
                            <ArrowLeft size={22} />
                        </button>
                    }
                />
            </TopBarSlot>

            <div className="fixed inset-1 z-[99] bg-[var(--bg-plan)] text-white flex flex-col overflow-hidden pt-12">

                {/* MARKET EXECUTION */}
                <div className="text-center py-3 border-b border-gray-800">
                    <div className="text-sm text-gray-400">Market Execution</div>
                </div>

                {/* VOLUME ROW */}
                <div className="flex items-center justify-between px-4 py-3 text-sm select-none">

                    {/* LEFT (MINUS SIDE) */}
                    <div className="flex gap-5 text-[var(--text-main)]">
                        {stepButtons
                            .filter(v => v < 0)
                            .map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setVolume(prev => {
                                            const next = +(prev + v).toFixed(2);
                                            return next < 0.01 ? 0.01 : next;
                                        })
                                    }
                                >
                                    {v}
                                </button>
                            ))}
                    </div>

                    {/* CENTER VOLUME */}
                    <div className="text-3xl font-bold text-[var(--text-main)] tracking-wide mx-2">
                        {volume.toFixed(2)}
                    </div>

                    {/* RIGHT (PLUS SIDE) */}
                    <div className="flex gap-5 text-[var(--mt-blue)]">
                        {stepButtons
                            .filter(v => v > 0)
                            .map((v, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setVolume(prev => +(prev + v).toFixed(2))
                                    }
                                >
                                    +{v}
                                </button>
                            ))}
                    </div>

                </div>




                {/* LIVE PRICES */}
                <div className="flex justify-around px-6 py-6">

                    {/* BID */}
                    <div className={`font-bold ${bidColor}`}>
                        {(() => {
                            const bid = splitPrice(live.bid);
                            return (
                                <div className="text-right leading-none">
                                    <span className="text-2xl">{bid.int}.</span>

                                    {/* NORMAL DECIMALS */}
                                    {bid.normal && (
                                        <span className="text-2xl">
                                            {bid.normal}
                                        </span>
                                    )}

                                    {/* BIG LAST 2 */}
                                    {bid.big && (
                                        <span className="text-4xl">
                                            {bid.big}
                                        </span>
                                    )}

                                    {/* SMALL LAST 1 */}
                                    {bid.small && (
                                        <sup className="text-lg relative -top-3 ml-[2px]">
                                            {bid.small}
                                        </sup>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    {/* ASK */}
                    <div className={`font-bold ${askColor}`}>
                        {(() => {
                            const ask = splitPrice(live.ask);
                            return (
                                <div className="text-right leading-none">
                                    <span className="text-2xl">{ask.int}.</span>

                                    {ask.normal && (
                                        <span className="text-2xl">
                                            {ask.normal}
                                        </span>
                                    )}

                                    {ask.big && (
                                        <span className="text-4xl">
                                            {ask.big}
                                        </span>
                                    )}

                                    {ask.small && (
                                        <sup className="text-lg relative -top-3 ml-[2px]">
                                            {ask.small}
                                        </sup>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                </div>
                {/* LIVE CHART */}
                <LiveChart
                    bid={Number(live.bid)}
                    ask={Number(live.ask)}
                />
                {/* WARNING */}
                <div className="text-center text-xs text-gray-400 py-4 px-6">
                    Attention! The trade will be executed at market conditions,
                    difference with requested price may be significant!
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 border-t border-gray-800">
                    <button className="bg-[var(--bg-plan)] text-red-500 py-5 text-xl font-bold border-r border-gray-800">
                        SELL
                        <div className="text-xs font-normal">BY MARKET</div>
                    </button>

                    <button className="bg-[var(--bg-plan)] text-blue-400 py-5 text-xl font-bold">
                        BUY
                        <div className="text-xs font-normal">BY MARKET</div>
                    </button>
                </div>

            </div>
        </>
    );
}

/* ------------------- SAFE LIVE CHART ------------------- */


function LiveChart({ bid, ask }: { bid: number; ask: number }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [bidTicks, setBidTicks] = useState<number[]>([]);
    const [askTicks, setAskTicks] = useState<number[]>([]);
    const [width, setWidth] = useState(400); // safe default

    const HEIGHT = 280;
    const STEP = 6;
    const MAX_POINTS = 400;
    const ANCHOR_PERCENT = 0.65;
    const PRICE_SCALE_WIDTH = 70;
    const GRID_COUNT = 9; // 8–10 levels

    // measure width once mounted
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const resize = () => {
            const w = el.getBoundingClientRect().width - PRICE_SCALE_WIDTH;
            if (w > 0) setWidth(w);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // push new ticks
    useEffect(() => {
        if (!isFinite(bid) || !isFinite(ask)) return;

        setBidTicks((p) => [...p.slice(-MAX_POINTS + 1), bid]);
        setAskTicks((p) => [...p.slice(-MAX_POINTS + 1), ask]);
    }, [bid, ask]);

    const len = Math.min(bidTicks.length, askTicks.length);
    if (len < 2) {
        return (
            <div
                ref={containerRef}
                className="relative bg-[var(--bg-plan)]"
                style={{ height: HEIGHT }}
            />
        );
    }

    const bids = bidTicks.slice(-len);
    const asks = askTicks.slice(-len);

    const all = [...bids, ...asks];
    const rawMax = Math.max(...all);
    const rawMin = Math.min(...all);

    // 🔥 Smooth auto vertical scaling
    const padding = (rawMax - rawMin) * 0.25 || 0.0001;
    const max = rawMax + padding;
    const min = rawMin - padding;
    const range = max - min;

    const scaleY = (p: number) =>
        ((max - p) / range) * HEIGHT;

    const totalWidth = (len - 1) * STEP;
    const anchorX = width * ANCHOR_PERCENT;
    const offset = totalWidth > anchorX ? totalWidth - anchorX : 0;

    const buildPath = (data: number[]) =>
        data
            .map((p, i) => {
                const x = i * STEP - offset;
                const y = scaleY(p);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

    const bidPath = buildPath(bids);
    const askPath = buildPath(asks);

    const currentBid = bids[len - 1];
    const currentAsk = asks[len - 1];

    const bidY = scaleY(currentBid);
    const askY = scaleY(currentAsk);

    // grid levels
    const levels = Array.from({ length: GRID_COUNT }, (_, i) => {
        const price = max - (range / (GRID_COUNT - 1)) * i;
        const y = (i / (GRID_COUNT - 1)) * HEIGHT;
        return { price, y };
    });

    return (
        <div
            ref={containerRef}
            className="relative bg-[var(--bg-plan)] overflow-hidden"
            style={{ height: HEIGHT }}
        >
            {/* GRID BACKGROUND */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {levels.map((l, i) => (
                    <line
                        key={i}
                        x1="0"
                        x2={width}
                        y1={l.y}
                        y2={l.y}
                        stroke="rgba(255,255,255,0.12)"
                        strokeDasharray="4 6"
                    />
                ))}
            </svg>

            {/* CHART AREA */}
            <div
                className="absolute left-0 top-0 bottom-0 overflow-hidden"
                style={{ right: PRICE_SCALE_WIDTH }}
            >
                <svg width={width + 200} height={HEIGHT}>
                    <path
                        d={askPath}
                        stroke="#ff4d4d"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        d={bidPath}
                        stroke="#4aa3ff"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </div>

            {/* PRICE SCALE */}
            <div
                className="absolute right-0 top-0 h-full flex flex-col justify-between pr-2 text-xs text-gray-400"
                style={{ width: PRICE_SCALE_WIDTH }}
            >
                {levels.map((l, i) => (
                    <div key={i}>{l.price.toFixed(5)}</div>
                ))}
            </div>

            {/* LIVE PRICE TAGS */}
            <div
                className="absolute right-0 pr-2 py-1 text-xs rounded-l"
                style={{
                    top: askY - 10,
                    background: "var(--mt-red)",
                    color: "white",
                    width: PRICE_SCALE_WIDTH,
                    textAlign: "right",
                }}
            >
                {currentAsk.toFixed(5)}
            </div>

            <div
                className="absolute right-0 px-2 py-1 text-xs rounded-l"
                style={{
                    top: bidY - 10,
                    background: "#4aa3ff",
                    color: "white",
                    width: PRICE_SCALE_WIDTH,
                    textAlign: "right",
                }}
            >
                {currentBid.toFixed(5)}
            </div>
        </div>
    );
}



/* ------------------- SYMBOL NAME ------------------- */

function getSymbolName(sym: string) {
    const map: Record<string, string> = {
        EURUSD: "Euro vs US Dollar",
        GBPUSD: "Pound Sterling vs US Dollar",
        USDJPY: "US Dollar vs Yen",
    };
    return map[sym] || sym;
}
