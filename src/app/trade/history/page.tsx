"use client";

import { useState, useCallback, memo, useMemo } from "react";
import { ArrowDownUp, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { useRef, useEffect } from "react";
import TopBarSlot from "../components/layout/TopBarSlot";
import TradeTopBar from "../components/layout/TradeTopBar";
import { useTradeSummary } from "@/hooks/history/useTradeSummary";
import { useTradePositions } from "@/hooks/history/useTradePositions";
import { useTradeOrders } from "@/hooks/history/useTradeOrders";
import { useTradeDeals } from "@/hooks/history/useTradeDeals";
import { useLongPress } from "../trade/page";
import HistoryActionSheet from "../components/history/HistoryActionSheet";


/* ================= TYPES ================= */

type TabType = "positions" | "orders" | "deals";

type Order = {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  lot: string;
  price: string;
  time: string;
  status: string;
};

/* ================= TABS ================= */
const LongPressRow = ({
  children,
  onLongPress,
}: {
  children: React.ReactNode;
  onLongPress: () => void;
}) => {
  const longPress = useLongPress(onLongPress);

  return (
    <div
      {...longPress}
      onContextMenu={(e) => e.preventDefault()}
      className="select-none"
    >
      {children}
    </div>
  );
};

const HistoryTabs = memo(
  ({
    activeTab,
    onChange,
  }: {
    activeTab: TabType;
    onChange: (t: TabType) => void;
  }) => (
    <div className="flex border-b border-white/10 mb-3 overflow-hidden relative">
      {(["positions", "orders", "deals"] as TabType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-3 text-center font-semibold uppercase text-[12px] relative
            transition-all duration-300 ease-in-out
            ${activeTab === tab
              ? "text-[var(--mt-blue)] z-10"
              : "text-[var(--text-muted)]"
            }`}
        >
          {tab}
        </button>
      ))}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-[var(--mt-blue)] transition-all duration-300 ease-in-out w-1/3"
        style={{
          transform: `translateX(${(["positions", "orders", "deals"] as TabType[]).indexOf(activeTab) * 100}%)`
        }}
      />
    </div>
  )
);


/* ================= SUMMARY (ORDERS ONLY) ================= */

const OrdersSummary = memo(
  ({ summary }: { summary: { label: string; value: string }[] }) => (
    <div className="space-y-[6px] mb-3">
      {summary.map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          <span className="font-semibold whitespace-nowrap">
            {row.label}:
          </span>

          <span
            className="flex-1 h-[6px] translate-y-[5px] mx-1"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(156,163,175,0.35) .5px, transparent 1.6px)",
              backgroundSize: "8px 6px",
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
  )
);




export default function TradeHistory() {
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  const getProfitColor = (value: number) => {
    if (value < 0) return "text-[var(--mt-red)]";
    return "text-[var(--mt-blue)]";
  };

  const onTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const { data: summary } = useTradeSummary();
  const {
    data: positionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTradePositions();


  const {
    data: ordersPages,
    fetchNextPage: fetchNextOrders,
    hasNextPage: hasNextOrders,
    isFetchingNextPage: isFetchingOrders,
  } = useTradeOrders();


  const orderSummaryData =
    ordersPages?.pages[0]?.summary;

  const {
    data: dealsPages,
    fetchNextPage: fetchNextDeals,
    hasNextPage: hasNextDeals,
    isFetchingNextPage: isFetchingDeals,
  } = useTradeDeals();




  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        if (activeTab === "positions" && hasNextPage) {
          fetchNextPage();
        }

        if (activeTab === "orders" && hasNextOrders) {
          fetchNextOrders();
        }

        if (activeTab === "deals" && hasNextDeals) {
          fetchNextDeals();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [
    activeTab,
    hasNextPage,
    hasNextOrders,
    hasNextDeals,
    fetchNextPage,
    fetchNextOrders,
    fetchNextDeals,
  ]);


  useEffect(() => {
    if (!loadMoreRef.current || activeTab !== "deals") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextDeals) {
          fetchNextDeals();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [activeTab, hasNextDeals, fetchNextDeals]);
  useEffect(() => {
    if (!loadMoreRef.current || activeTab !== "orders") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextOrders) {
          fetchNextOrders();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [activeTab, hasNextOrders, fetchNextOrders]);

  const rawOrders =
    ordersPages?.pages.flatMap((p) => p.orders) || [];

  const rawPositions =
    positionsData?.pages.flatMap((p) => p.positions) || [];

  const rawDeals =
    dealsPages?.pages.flatMap((p) => p.deals) || [];
  const allPositions = useMemo(() => {
    return selectedSymbol
      ? rawPositions.filter((p) => p.symbol === selectedSymbol)
      : rawPositions;
  }, [rawPositions, selectedSymbol]);

  const allOrders = useMemo(() => {
    return selectedSymbol
      ? rawOrders.filter((o) => o.symbol === selectedSymbol)
      : rawOrders;
  }, [rawOrders, selectedSymbol]);

  const allDeals = useMemo(() => {
    return selectedSymbol
      ? rawDeals.filter((d) => d.symbol === selectedSymbol)
      : rawDeals;
  }, [rawDeals, selectedSymbol]);

  const allSymbols = useMemo(() => {
    const set = new Set<string>();

    rawOrders.forEach((o) => set.add(o.symbol));
    rawPositions.forEach((p) => set.add(p.symbol));
    rawDeals.forEach((d) => set.add(d.symbol));

    return Array.from(set);
  }, [rawOrders, rawPositions, rawDeals]);

  const positionSummary = summary
    ? [
      { label: "Profit", value: summary.totalPnL.toFixed(2), raw: summary.totalPnL },
      { label: "Deposit", value: summary.totalDeposit.toFixed(2) },
      { label: "Swap", value: summary.totalSwap.toFixed(2) },
      { label: "Commission", value: summary.totalCommission.toFixed(2) },
      { label: "Balance", value: summary.balance.toFixed(2) },
    ]
    : [];

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSymbolOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <TopBarSlot>
        <TradeTopBar
          title="History"
          subtitle="All symbols"
          showMenu
          right={
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setSymbolOpen((prev) => !prev)}
                  className="flex items-center gap-1 font-semibold text-[14px] text-[var(--text-main)]"
                >
                  <DollarSign size={16} />

                </button>

                {symbolOpen && (
                  <div className="absolute right-0 mt-2 w-22 bg-[var(--bg-muted-card)] border border-[var(--border-soft)] rounded-md shadow-lg z-50 animate-dropdown">

                    {/* ALL OPTION */}
                    <div
                      onClick={() => {
                        setSelectedSymbol(null);
                        setSymbolOpen(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-[var(--bg-glass)] text-[13px]"
                    >
                      ALL
                    </div>

                    {allSymbols.map((sym) => (
                      <div
                        key={sym}
                        onClick={() => {
                          setSelectedSymbol(sym);
                          setSymbolOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-[var(--bg-glass)] text-[13px] ${selectedSymbol === sym
                          ? "text-[var(--mt-blue)] font-semibold"
                          : ""
                          }`}
                      >
                        {sym}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <ArrowDownUp size={18} />
              <Calendar size={18} />
            </div>
          }
        />
      </TopBarSlot>

      {/* BODY */}
      <div className="px-2 md:px-4 pt-1 text-[13px] bg-[var(--bg-plan)] md:bg-[var(--bg-card)]  h-[calc(100vh-60px)] overflow-y-auto pb-7">
        <HistoryTabs activeTab={activeTab} onChange={onTabChange} />

        <div className="transition-opacity duration-200">
          {activeTab === "orders" && (
            <>
              {/* SUMMARY */}
              {orderSummaryData && (
                <div className="space-y-[6px] mb-3">
                  <OrdersSummary
                    summary={[
                      {
                        label: "Filled",
                        value: orderSummaryData.totalFilled.toString(),
                      },
                      {
                        label: "Canceled",
                        value: orderSummaryData.totalCancelled.toString(),
                      },
                      {
                        label: "Total",
                        value: orderSummaryData.totalOrders.toString(),
                      },
                    ]}
                  />
                </div>
              )}

              {/* ORDERS LIST */}
              {allOrders.map((order: any) => {
                const isBuy = order.side === "BUY";

                return (
                  <LongPressRow
                    key={order.orderId}
                    onLongPress={() => {
                      setSelectedItem(order);
                      setShowSheet(true);
                    }}
                  >

                    <div
                      onClick={() => toggleExpand(order.orderId)}
                      className={`
    py-1 cursor-pointer active:bg-white/5
    ${expandedId !== order.orderId
                          ? "border-b border-[var(--border-grey)]"
                          : ""}
  `}>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold text-[15px] mt-font">
                            {order.symbol},{" "}
                            <span
                              className={
                                isBuy
                                  ? "text-[var(--mt-blue)] font-medium"
                                  : "text-[var(--mt-red)] font-medium"
                              }
                            >
                              {isBuy ? "buy" : "sell"}
                            </span>
                          </div>

                          <div className="mt-price-line">
                            {order.qty.toFixed(2)} / {order.qty.toFixed(2)} at{" "}
                            {order.orderType.toLowerCase()}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[12px] text-[var(--mt-dim)]">
                            {new Date(order.openTime).toLocaleString()}
                          </div>
                          <div className="mt-profit text-[var(--mt-dim)] text-[13px]">
                            {order.status === "CLOSED" ? "FILLED" : order.status}
                          </div>

                        </div>
                      </div>
                    </div>

                    {expandedId === order.orderId && (
                      <div className="pb-3 text-[12px] text-[var(--mt-dim)] border-b border-[var(--border-grey)] space-y-1 animate-fadeIn grid grid-cols-1 ">

                        <div className="w-50">#{order.orderId.slice(0, 10)}</div>

                        <div className="flex justify-between w-50">
                          <span>S / L:</span>
                          <span>{order.stopLoss ?? "-"}</span>
                        </div>

                        <div className="flex justify-between w-50">
                          <span>T / P:</span>
                          <span>{order.takeProfit ?? "-"}</span>
                        </div>

                      </div>
                    )}
                  </LongPressRow>
                );
              })}

              <div
                ref={loadMoreRef}
                className="h-10 flex items-center justify-center"
              >
                {isFetchingOrders && (
                  <span className="text-xs text-[var(--text-muted)]">
                    Loading more...
                  </span>
                )}
              </div>
            </>
          )}


          {activeTab === "positions" && (

            <>

              {/* SUMMARY */}
              <div className="space-y-[6px] mb-3">

                {positionSummary.map((row) => (
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

                    <span
                      className={`font-semibold whitespace-nowrap ${row.label === "Profit"
                        ? row.raw >= 0
                          ? "text-[var(--mt-blue)]"
                          : "text-[var(--mt-red)]"
                        : ""
                        }`}
                    >
                      {row.value}
                    </span>

                  </div>
                ))}
              </div>
              {/* <div className="border-t border-b border-[var(--border-soft)] bg-[var(--bg-plan)]py-3 mt-3">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-[16px] mt-font">
                    Balance
                  </div>

                  <div className="text-right">
                    <div className="text-[12px] text-[var(--mt-grey)] mt-font">
                      {new Date().toLocaleString()}
                    </div>

                    <div className="mt-profit text-[15px] text-[var(--mt-blue)]">
                      {summary?.balance?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div> */}


              {/* POSITIONS LIST */}
              {allPositions.map((pos: any) => {

                return (
                  <LongPressRow
                    key={pos.orderId}
                    onLongPress={() => {
                      setSelectedItem(pos);
                      setShowSheet(true);
                    }}
                  >
                    {/* MAIN ROW */}
                    <div
                      onClick={() => toggleExpand(pos.orderId)}
                      className={`
    py-1 cursor-pointer active:bg-white/5
    ${expandedId !== pos.orderId
                          ? "border-b border-[var(--border-grey)]"
                          : ""}
  `}
                    >

                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold text-[15px] mt-font">
                            {pos.symbol},{" "}
                            <span
                              className={` ${pos.side === "BUY"
                                ? "text-[var(--mt-blue)] font-medium"
                                : "text-[var(--mt-red)] font-medium"
                                } `}
                            >
                              {pos.side.toLowerCase()} {pos.qty.toFixed(2)}
                            </span>
                          </div>

                          <div className="mt-price-line">
                            {pos.openPrice}{" "}
                            {pos.closePrice ? `→ ${pos.closePrice}` : ""}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[12px] text-[var(--mt-dim)]">
                            {new Date(pos.openTime).toLocaleString()}
                          </div>

                          <div
                            className={`mt-profit ${pos.profitLoss > 0
                              ? "text-[var(--mt-blue)]"
                              : pos.profitLoss < 0
                                ? "text-[var(--mt-red)]"
                                : ""
                              }`}
                          >
                            {pos.profitLoss !== 0
                              ? Math.abs(pos.profitLoss).toFixed(2)
                              : ""}
                          </div>

                        </div>
                      </div>
                    </div>


                    {/* EXPANDED DETAILS */}
                   {expandedId === pos.orderId && (
  <div className="pb-3 border-b border-[var(--border-grey)] animate-fadeIn">
    <div className="text-[12px] text-[var(--mt-dim)] mt-font space-y-1 grid grid-cols-2">

      <div className="mr-2">#{pos.orderId.slice(0, 10)}</div>

      <div className="flex justify-between mr-2">
        <span>{pos.status}</span>
        <span>{pos.openPrice}</span>
      </div>

      <div className="flex justify-between mr-2">
        <span>S/L:</span>
        <span>{pos.stopLoss ?? "-"}</span>
      </div>

      <div className="flex justify-between mr-2">
        <span>Swap:</span>
        <span>{pos.swap.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mr-2">
        <span>T/P:</span>
        <span>{pos.takeProfit ?? "-"}</span>
      </div>

      <div className="flex justify-between mr-2">
        <span>Commission:</span>
        <span>{pos.commission.toFixed(2)}</span>
      </div>

    </div>
  </div>
)}

                  </LongPressRow>
                );
              })}


              {/* LOAD MORE TRIGGER */}
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {isFetchingNextPage && (
                  <span className="text-[var(--text-muted)] text-xs">
                    Loading more...
                  </span>
                )}
              </div>
            </>
          )}

          {activeTab === "deals" && (
            <>
              {/* SUMMARY */}
              <div className="space-y-[6px] mb-3">
                {positionSummary.map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="font-semibold whitespace-nowrap">
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

                    <span
                      className={`font-semibold whitespace-nowrap ${row.label === "Profit"
                        ? row.raw >= 0
                          ? "text-[var(--mt-blue)]"
                          : "text-[var(--mt-red)]"
                        : ""
                        }`}
                    >
                      {row.value}
                    </span>

                  </div>
                ))}
              </div>



              {/* DEALS LIST */}
              {allDeals.map((deal: any) => {
                const isBuy = deal.type.includes("BUY");
                const pnlColor =
                  deal.pnl < 0
                    ? "text-[var(--mt-red)]"
                    : "text-[var(--mt-blue)]";

                return (
                  <LongPressRow
                    key={deal.tradeId + deal.date}
                    onLongPress={() => {
                      setSelectedItem(deal);
                      setShowSheet(true);
                    }}
                  >
                    <div
                      onClick={() => toggleExpand(deal.tradeId + deal.date)}
                      className={`
    py-1 cursor-pointer active:bg-white/5
    ${expandedId !== deal.tradeId + deal.date
                          ? "border-b border-[var(--border-grey)]"
                          : ""}
  `}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold text-[15px] mt-font">
                            {deal.symbol},{" "}
                            <span
                              className={
                                deal.type.includes("BUY")
                                  ? "text-[var(--mt-blue)] font-medium"
                                  : "text-[var(--mt-red)] font-medium"
                              }
                            >
                              {deal.type
                                .toLowerCase()
                                .replace("_", ", ")}
                            </span>

                          </div>

                          <div className="mt-price-line">
                            {deal.volume} at {deal.price}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[12px] text-[var(--mt-dim)]">
                            {new Date(deal.date).toLocaleString()}
                          </div>

                          {deal.pnl !== 0 && (
                            <div
                              className={`mt-profit ${deal.pnl > 0
                                ? "text-[var(--mt-blue)]  font-medium"
                                : deal.pnl < 0
                                  ? "text-[var(--mt-red)] font-medium"
                                  : ""
                                }`}
                            >
                              {deal.pnl !== 0
                                ? Math.abs(deal.pnl).toFixed(2)
                                : ""}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {expandedId === deal.tradeId + deal.date && (
                      <div className=" pb-3 text-[12px] text-[var(--mt-dim)] space-y-1 animate-fadeIn grid grid-cols-2 border-b border-[var(--border-grey)]">

                        <div className="flex justify-between mr-2">
                          <span>Deal:</span>
                          <span>{deal.tradeId.slice(0, 10)}</span>
                        </div>
                        <div className="flex justify-between mr-2">
                          <span>Swap:</span>
                          <span>{deal.swap.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between mr-2">
                          <span>Order:</span>
                          <span>{deal.tradeId.slice(0, 10)}</span>
                        </div>
                        <div className="flex justify-between mr-2">
                          <span>Charges:</span>
                          <span>{deal.commission.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between mr-2">
                          <span>Position:</span>
                          <span>{deal.tradeId.slice(0, 10)}</span>
                        </div>


                      </div>
                    )}
                  </LongPressRow>
                );
              })}

              <div
                ref={loadMoreRef}
                className="h-10 flex items-center justify-center"
              >
                {isFetchingDeals && (
                  <span className="text-xs text-[var(--text-muted)]">
                    Loading more...
                  </span>
                )}
              </div>
            </>
          )}


        </div>
      </div>
      <HistoryActionSheet
        item={selectedItem}
        type={
          activeTab === "positions"
            ? "position"
            : activeTab === "orders"
              ? "order"
              : "deal"
        }
        open={showSheet}
        onClose={() => setShowSheet(false)}
      />


    </>
  );
}
