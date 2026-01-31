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
import { useMarketOrder, usePendingOrder } from "@/hooks/trade/useTrade";
import { Toast } from "@/app/components/ui/Toast";

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
    const [sl, setSl] = useState<number | "">("");
    const [tp, setTp] = useState<number | "">("");
    const [specifiedDate, setSpecifiedDate] = useState<Date | null>(null);
    const [openSpecifiedModal, setOpenSpecifiedModal] = useState(false);
    const [toast, setToast] = useState<{
  type: "success" | "error";
  message: string;
} | null>(null);

    const STEP = 0.0001; // adjust per symbol
    const marketMutation = useMarketOrder();
    const pendingMutation = usePendingOrder();

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
    const [orderType, setOrderType] = useState("MARKET EXECUTION");
    const [openType, setOpenType] = useState(false);
    const [price, setPrice] = useState<number | "">("");
    const [expiration, setExpiration] = useState("GTC");
    const [openExpiration, setOpenExpiration] = useState(false);

    const expirationOptions = ["GTC", "TODAY", "SPECIFIED"];
    const orderOptions = [
        "MARKET EXECUTION",
        "BUY LIMIT",
        "SELL LIMIT",
        "BUY STOP",
        "SELL STOP",
    ];


    const [volume, setVolume] = useState<number>(0.01);


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
    const handleMarketOrder = (side: "BUY" | "SELL") => {
  if (!symbol || volume <= 0) return;

  marketMutation.mutate(
    {
      symbol,
      side,
      volume,
      stopLoss: sl === "" ? undefined : sl,
      takeProfit: tp === "" ? undefined : tp,
    },
    {
      onSuccess: (data) => {
        setToast({
          type: "success",
          message: `${side} order executed successfully`,
        });

        setSl("");
        setTp("");
      },
      onError: (err: any) => {
        setToast({
          type: "error",
          message: err?.message || "Order failed",
        });
      },
    }
  );
};


  const handlePendingOrder = () => {
  if (!symbol || volume <= 0 || price === "") return;

  const mapOrderType = {
    "BUY LIMIT": "BUY_LIMIT",
    "SELL LIMIT": "SELL_LIMIT",
    "BUY STOP": "BUY_STOP",
    "SELL STOP": "SELL_STOP",
  } as const;

  const apiOrderType =
    mapOrderType[orderType as keyof typeof mapOrderType];

  if (!apiOrderType) return;

  const side: "BUY" | "SELL" =
    orderType.includes("BUY") ? "BUY" : "SELL";

  // 🧠 Base payload (required fields only)
  const payload: any = {
    symbol,
    side,
    orderType: apiOrderType,
    price: Number(price),
    volume: Number(volume),
  };

  // Optional SL
  if (sl !== "") {
    payload.stopLoss = Number(sl);
  }

  // Optional TP
  if (tp !== "") {
    payload.takeProfit = Number(tp);
  }

  // Expiration logic
  if (expiration === "SPECIFIED") {
    if (!specifiedDate) {
      setToast({
        type: "error",
        message: "Please select expiration date",
      });
      return;
    }

    payload.expireType = "TIME";
    payload.expireAt = specifiedDate.toISOString();
  } else {
    payload.expireType = expiration; // GTC or TODAY
  }

  pendingMutation.mutate(payload, {
    onSuccess: () => {
      setToast({
        type: "success",
        message: `${side} ${apiOrderType} placed successfully`,
      });

      setPrice("");
      setSl("");
      setTp("");
    },
    onError: (err: any) => {
      setToast({
        type: "error",
        message: err?.message || "Order failed",
      });
    },
  });
};

    function formatDateTime(date: Date) {
        const pad = (n: number) => n.toString().padStart(2, "0");

        return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
            date.getDate()
        )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }


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
                <div className="relative border-b border-gray-800 py-3">

                    {/* Selected Value */}
                    <div
                        onClick={() => setOpenType((p) => !p)}
                        className="text-center text-sm text-[var(--text-main)] cursor-pointer relative select-none"
                    >
                        {orderType}

                        {/* Bottom-right corner triangle (like textarea resize) */}
                        <span className="absolute right-0 top-4 text-xl text-gray-500">
                            ▾
                        </span>
                    </div>

                    {/* Dropdown */}
                    {openType && (
                        <div className="absolute left-0 right-0 top-0 bg-[var(--bg-plan)] border border-gray-700 z-50">
                            {orderOptions.map((opt) => (
                                <div
                                    key={opt}
                                    onClick={() => {
                                        setOrderType(opt);
                                        setOpenType(false);
                                    }}
                                    className="text-center py-3 text-sm text-[var(--text-main)] hover:bg-gray-800 cursor-pointer transition"
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* VOLUME ROW */}
                <div className="flex items-center justify-between px-2 py-3 text-sm select-none border-b border-gray-800">
                    <div className="flex gap-2 text-[var(--text-main)]">
                        {stepButtons
                            .filter((v) => v < 0)
                            .map((v, i) => (
                                <button
                                    key={i}
                                    className="px-2 py-1 rounded text-1xl hover:bg-gray-800 transition-colors"
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

                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={volume}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isNaN(val)) return;
                            setVolume(val < 0.01 ? 0.01 : Number(val.toFixed(2)));
                        }}
                        className="w-20 bg-transparent text-center text-1xl font-bold text-[var(--text-main)] outline-none border-b border-gray-700"
                    />


                    <div className="flex gap-2 text-[var(--mt-blue)]">
                        {stepButtons
                            .filter((v) => v > 0)
                            .map((v, i) => (
                                <button
                                    key={i}
                                    className="px-2 py-1 rounded text-1xl hover:bg-blue-900/50 transition-colors"
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
                <div className="flex justify-around px-6 pb-3 pt-2">
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

                {orderType !== "MARKET EXECUTION" && (
                    <div className="flex items-center justify-center px-6 py-2">

                        <div className="flex items-center gap-3 w-full">

                            {/* Minus */}
                            <button
                                className="text-blue-400 text-xl font-bold"
                                onClick={() => {
                                    const base = price === "" ? Number(live.bid) : price;
                                    const value = Math.max(0, base - STEP);
                                    setPrice(Number(value.toFixed(5)));
                                }}
                            >
                                −
                            </button>

                            {/* Input */}
                            <input
                                type="number"
                                value={price === "" ? "" : price}
                                min="0"
                                step="0.00001"
                                onChange={(e) => {
                                    const val = e.target.value;

                                    if (val === "") {
                                        setPrice("");
                                        return;
                                    }

                                    const num = Number(val);
                                    if (!isNaN(num) && num >= 0) {
                                        setPrice(num);
                                    }
                                }}
                                placeholder="Price"
                                className="flex-1 bg-transparent  border-b border-gray-700 text-center text-white outline-none text-xl"
                            />

                            {/* Plus */}
                            <button
                                className="text-blue-400 text-xl font-bold"
                                onClick={() => {
                                    const base = price === "" ? Number(live.ask) : price;
                                    const value = base + STEP;
                                    setPrice(Number(value.toFixed(5)));
                                }}
                            >
                                +
                            </button>

                        </div>

                    </div>
                )}

                {/* SL / TP INPUTS */}
                <div className="flex justify-around items-center px-6 pb-3 text-white">

                    {/* SL */}
                    <div className="flex items-center gap-3 ">

                        <button
                            className="text-blue-400 text-xl font-bold"
                            onClick={() => {
                                const value =
                                    sl === ""
                                        ? Number(live.bid) - STEP
                                        : sl - STEP;

                                setSl(Number(value.toFixed(5)));
                            }}

                        >
                            −
                        </button>

                        <input
                            type="number"
                            value={sl === "" ? "" : sl}
                            min="0"
                            step="0.00001"
                            onChange={(e) => {
                                const val = e.target.value;

                                if (val === "") {
                                    setSl("");
                                    return;
                                }

                                const num = Number(val);
                                if (!isNaN(num) && num >= 0) {
                                    setSl(num);
                                }
                            }}
                            placeholder="SL"
                            className="w-24 bg-transparent border-b border-gray-700 text-center text-white outline-none text-lg"
                        />

                        <button
                            className="text-blue-400 text-xl font-bold"
                            onClick={() => {
                                const value =
                                    sl === ""
                                        ? Number(live.bid) + STEP
                                        : sl + STEP;

                                setSl(Number(value.toFixed(5)));
                            }}

                        >
                            +
                        </button>

                    </div>

                    {/* TP */}
                    <div className="flex items-center gap-3">

                        <button
                            className="text-blue-400 text-xl font-bold"
                            onClick={() => {
                                const value =
                                    tp === ""
                                        ? Number(live.bid) - STEP
                                        : tp - STEP;

                                setTp(Number(value.toFixed(5)));
                            }}
                        >
                            −
                        </button>

                        <input
                            type="number"
                            value={tp}
                            min="0"
                            step="0.00001"
                            onChange={(e) => {
                                const val = e.target.value;

                                if (val === "") {
                                    setSl("");
                                    return;
                                }

                                const num = Number(val);
                                if (!isNaN(num) && num >= 0) {
                                    setTp(num);
                                }
                            }}

                            placeholder="TP"
                            className="w-24 bg-transparent border-b border-gray-700 text-center text-white outline-none text-lg"
                        />

                        <button
                            className="text-blue-400 text-xl font-bold"
                            onClick={() => {
                                const value =
                                    tp === ""
                                        ? Number(live.bid) + STEP
                                        : tp + STEP;

                                setTp(Number(value.toFixed(5)));
                            }}

                        >
                            +
                        </button>

                    </div>

                </div>

                {orderType !== "MARKET EXECUTION" && (
                    <div className="relative px-3 py-3 border-t border-gray-800">

                        {/* Selector Row */}
                        <div
                            onClick={() => setOpenExpiration((v) => !v)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <span className="text-gray-400 text-sm">
                                Expiration
                            </span>

                            <span className="text-white text-sm">
                                {expiration === "SPECIFIED" && specifiedDate
                                    ? formatDateTime(specifiedDate)
                                    : expiration}
                            </span>

                            <span className="absolute right-0 top-4 text-xl text-gray-500">
                                ▾
                            </span>
                        </div>

                        {/* Dropdown */}
                        {openExpiration && (
                            <div className="absolute left-0 right-0 top-0 mt-2 bg-[var(--bg-plan)] border border-gray-700 z-50">

                                {expirationOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        onClick={() => {
                                            setOpenExpiration(false);

                                            if (opt === "SPECIFIED") {
                                                setOpenSpecifiedModal(true);
                                            } else {
                                                setExpiration(opt);
                                                setSpecifiedDate(null);
                                            }
                                        }}

                                        className="text-right px-6 py-3 text-sm text-white hover:bg-gray-800 cursor-pointer transition"
                                    >
                                        {opt}
                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                )}



                <Suspense>
                    <LiveChart
                        key={symbol}   // 👈 add this
                        bid={Number(live.bid)}
                        ask={Number(live.ask)}
                    />
                </Suspense>

                {orderType === "MARKET EXECUTION" && (
                    <div className="text-center text-xs text-gray-400 py-2 px-6">
                        Attention! The trade will be executed at market conditions,
                        difference with requested price may be significant!
                    </div>
                )}


                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-[var(--bg-plan)]">

                    {orderType === "MARKET EXECUTION" ? (
                        <div className="grid grid-cols-2">
                            <button
  disabled={marketMutation.isPending}
  className="text-red-500 py-4 text-xl font-bold border-r border-gray-800 hover:bg-red-900/20 transition-colors disabled:opacity-50"
  onClick={() => handleMarketOrder("SELL")}
>
  {marketMutation.isPending ? "PROCESSING..." : "SELL"}
  <div className="text-xs font-normal">BY MARKET</div>
</button>


                           <button
  disabled={marketMutation.isPending}
  className="text-blue-400 py-4 text-xl font-bold hover:bg-blue-900/20 transition-colors disabled:opacity-50"
  onClick={() => handleMarketOrder("BUY")}
>
  {marketMutation.isPending ? "PROCESSING..." : "BUY"}
  <div className="text-xs font-normal">BY MARKET</div>
</button>

                        </div>
                    ) : (
                        <button
  disabled={pendingMutation.isPending}
  className="w-full py-4 text-xl font-bold text-[var(--text-main)] hover:bg-white/10 transition-colors disabled:opacity-50"
  onClick={handlePendingOrder}
>
  {pendingMutation.isPending ? "PROCESSING..." : "PLACE"}
</button>

                    )}

                </div>

            </div>
            {openSpecifiedModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">

                    <div className="bg-[var(--bg-plan)] w-[90%] max-w-md rounded-2xl p-6">

                        <div className="text-center text-xl font-semibold mb-6">
                            Expiration
                        </div>

                        <div className="space-y-4">

                            <input
                                type="date"
                                className="w-full bg-transparent border-b border-gray-700 py-2 outline-none"
                                onChange={(e) => {
                                    const current = specifiedDate || new Date();
                                    const [y, m, d] = e.target.value.split("-");
                                    const newDate = new Date(current);
                                    newDate.setFullYear(Number(y));
                                    newDate.setMonth(Number(m) - 1);
                                    newDate.setDate(Number(d));
                                    setSpecifiedDate(newDate);
                                }}
                            />

                            <input
                                type="time"
                                step="60"
                                className="w-full bg-transparent border-b border-gray-700 py-2 outline-none"
                                onChange={(e) => {
                                    const current = specifiedDate || new Date();
                                    const [h, min] = e.target.value.split(":");
                                    const newDate = new Date(current);
                                    newDate.setHours(Number(h));
                                    newDate.setMinutes(Number(min));
                                    setSpecifiedDate(newDate);
                                }}
                            />
                        </div>

                        <div className="flex justify-between mt-8">

                            <button
                                className="text-blue-400"
                                onClick={() => setOpenSpecifiedModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="text-blue-400"
                                onClick={() => {
                                    if (!specifiedDate) return;

                                    setExpiration("SPECIFIED");
                                    setOpenSpecifiedModal(false);
                                }}
                            >
                                OK
                            </button>

                        </div>
                    </div>
                </div>
            )}
    {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
  />
)}


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
