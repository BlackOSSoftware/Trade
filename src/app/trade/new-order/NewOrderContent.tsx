"use client";
export const dynamic = "force-dynamic";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef, useCallback, Suspense } from "react";
import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import { ArrowLeft, CircleDollarSign, DollarSignIcon } from "lucide-react";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
import TopBarSlot from "../components/layout/TopBarSlot";
import TradeTopBar from "../components/layout/TradeTopBar";
import LiveChart from "../components/new-order/chart";
import { useWatchlist } from "@/hooks/watchlist/useWatchlist";

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

    if (decimals.length === 0) {
        return { int: intPart, normal: "", big: "" };
    }

    if (decimals.length === 2) {
        return {
            int: intPart,
            normal: "",
            big: decimals,
        };
    }

    if (decimals.length >= 3) {
        return {
            int: intPart,
            normal: decimals.slice(0, decimals.length - 3),
            big: decimals.slice(decimals.length - 3, decimals.length - 1),
            small: decimals.slice(-1),
        };
    }

    return {
        int: intPart,
        normal: decimals,
        big: "",
    };
}

export default function NewOrderPage() {
    const search = useSearchParams();
    const router = useRouter();
    const symbol = search.get("symbol") || "";
    const { data: watchlist } = useWatchlist();
    const [openWatchlist, setOpenWatchlist] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpenWatchlist(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Fix 1: Initialize with immediate token fetch
    const [token, setToken] = useState<string>("");
    const [isTokenReady, setIsTokenReady] = useState(false);
    const tokenRef = useRef<string>("");

    // ✅ Fix 2: Synchronous token fetch on mount + optimistic loading
    useEffect(() => {
        const fetchToken = () => {
            const local = localStorage.getItem("accessToken");
            const cookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("tradeToken="))
                ?.split("=")[1];

            const finalToken = local || cookie || "";

            tokenRef.current = finalToken;
            setToken(finalToken);
            setIsTokenReady(true);
        };

        fetchToken();
    }, []);

    // ✅ Fix 3: Pass ref.current instead of state to avoid re-renders
    const quotes = useMarketQuotes(token);
    const live = token ? quotes[symbol] : undefined;

    const [volume, setVolume] = useState(0.01);

    const midPrice = useMemo(() => {
        if (!live?.bid || !live?.ask) return 0;
        const bid = Number(live.bid);
        const ask = Number(live.ask);
        if (isNaN(bid) || isNaN(ask)) return 0;
        return (bid + ask) / 2;
    }, [live?.bid, live?.ask]);

    const stepButtons = useMemo(() => {
        if (!midPrice) return [];
        if (midPrice < 1) return [-0.5, -0.1, -0.01, 0.01, 0.1, 0.5];
        return [-5, -1, -0.1, 0.1, 1, 5];
    }, [midPrice]);

    // ✅ Fix 4: Proper loading states - separate token vs data loading
    if (!isTokenReady) {
        return <GlobalLoader />;
    }

    if (!tokenRef.current || !live) {
        return (
            <div className="fixed inset-0 z-[99] bg-[var(--bg-plan)] text-white flex flex-col items-center justify-center pt-12">
                <GlobalLoader />
                <div className="mt-4 text-sm text-gray-400">
                    Loading {symbol} market data...
                </div>
            </div>
        );
    }

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
                    showBack
                    title={symbol}
                    subtitle={getSymbolName(symbol)}
                    showMenu={false}
                    right={
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setOpenWatchlist((p) => !p)}>
                                <DollarSignIcon size={22} />
                            </button>

                            {openWatchlist && (
                                <div className="
            absolute right-0 mt-2
            w-20
            max-h-64 overflow-y-auto
            rounded-lg border shadow-lg
            z-[999]
        "
                                    style={{
                                        backgroundColor: "var(--bg-muted-card)",
                                        borderColor: "var(--border-soft)"
                                    }}
                                >
                                    {watchlist?.map((item: any) => (
                                        <div
                                            key={item.code}
                                            onClick={() => {
                                                setOpenWatchlist(false);
                                                router.push(`/trade/new-order?symbol=${item.code}`);
                                            }}
                                            className="
                        px-4 py-3 text-sm cursor-pointer
                        hover:bg-[var(--bg-plan)]
                        border-b last:border-none
                    "
                                            style={{ borderColor: "var(--border-soft)" }}
                                        >
                                            {item.code}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    }
                />
            </TopBarSlot>

            <div className="fixed inset-0 z-[99] bg-[var(--bg-plan)] md:static md:z-auto md:min-h-screen md:px-6 md:py-10 md:bg-[var(--bg-main)] text-white flex flex-col overflow-hidden pt-12 md:pt-0 ">
                {/* MARKET EXECUTION */}
                <div className="text-center py-3 border-b border-gray-800">
                    <div className="text-sm text-gray-400">Market Execution</div>
                </div>

                {/* VOLUME ROW */}
                <div className="flex items-center justify-between px-4 py-3 text-sm select-none">
                    <div className="flex gap-5 text-[var(--text-main)]">
                        {stepButtons
                            .filter((v) => v < 0)
                            .map((v, i) => (
                                <button
                                    key={i}
                                    className="px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
                                    onClick={() =>
                                        setVolume((prev) => {
                                            const next = +(prev + v).toFixed(2);
                                            return next < 0.01 ? 0.01 : next;
                                        })
                                    }
                                >
                                    {v}
                                </button>
                            ))}
                    </div>

                    <div className="text-3xl font-bold text-[var(--text-main)] tracking-wide mx-2">
                        {volume.toFixed(2)}
                    </div>

                    <div className="flex gap-5 text-[var(--mt-blue)]">
                        {stepButtons
                            .filter((v) => v > 0)
                            .map((v, i) => (
                                <button
                                    key={i}
                                    className="px-2 py-1 rounded text-xs hover:bg-blue-900/50 transition-colors"
                                    onClick={() =>
                                        setVolume((prev) => +(prev + v).toFixed(2))
                                    }
                                >
                                    +{v}
                                </button>
                            ))}
                    </div>
                </div>

                {/* LIVE PRICES */}
                <div className="flex justify-around px-6 py-6">
                    <div className={`font-bold ${bidColor}`}>
                        {(() => {
                            const bid = splitPrice(live.bid);
                            return (
                                <div className="text-right leading-none">
                                    <span className="text-2xl">{bid.int}.</span>
                                    {bid.normal && (
                                        <span className="text-2xl">{bid.normal}</span>
                                    )}
                                    {bid.big && (
                                        <span className="text-4xl">{bid.big}</span>
                                    )}
                                    {bid.small && (
                                        <sup className="text-lg relative -top-3 ml-[2px]">
                                            {bid.small}
                                        </sup>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    <div className={`font-bold ${askColor}`}>
                        {(() => {
                            const ask = splitPrice(live.ask);
                            return (
                                <div className="text-right leading-none">
                                    <span className="text-2xl">{ask.int}.</span>
                                    {ask.normal && (
                                        <span className="text-2xl">{ask.normal}</span>
                                    )}
                                    {ask.big && (
                                        <span className="text-4xl">{ask.big}</span>
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

                        <Suspense>

                <LiveChart
                    key={symbol}   // 👈 add this
                    bid={Number(live.bid)}
                    ask={Number(live.ask)}
                    />
                    </Suspense>

                <div className="text-center text-xs text-gray-400 py-4 px-6">
                    Attention! The trade will be executed at market conditions,
                    difference with requested price may be significant!
                </div>

                <div className="grid grid-cols-2 border-t border-gray-800">
                    <button className="bg-[var(--bg-plan)] text-red-500 py-5 text-xl font-bold border-r border-gray-800 hover:bg-red-900/20 transition-colors">
                        SELL
                        <div className="text-xs font-normal">BY MARKET</div>
                    </button>

                    <button className="bg-[var(--bg-plan)] text-blue-400 py-5 text-xl font-bold hover:bg-blue-900/20 transition-colors">
                        BUY
                        <div className="text-xs font-normal">BY MARKET</div>
                    </button>
                </div>
            </div>
        </>
    );
}

function getSymbolName(sym: string) {
    const map: Record<string, string> = {
        EURUSD: "Euro vs US Dollar",
        GBPUSD: "Pound Sterling vs US Dollar",
        USDJPY: "US Dollar vs Yen",
    };
    return map[sym] || sym;
}
