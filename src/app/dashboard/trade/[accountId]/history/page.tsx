"use client";

import { useState, useCallback, memo } from "react";
import { ArrowDownUp, Calendar, RefreshCw } from "lucide-react";

import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";

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

/* ================= ORDER ROW ================= */

const OrderRow = memo(({ order }: { order: Order }) => (
  <div className="border-b border-white/10 px-1 py-1 bg-[var(--bg-plan)]">
    <div className="flex justify-between items-center">
      <div className="font-semibold text-[14px]">
        {order.symbol},{" "}
        <span
          className={
            order.type === "buy"
              ? "text-[var(--mt-blue)]"
              : "text-[var(--mt-red)]"
          }
        >
          {order.type}
        </span>
      </div>

      <div className="text-[11px] text-[var(--text-muted)]">
        {order.time}
      </div>
    </div>
    <div className="flex justify-between items-center">

    <div className="text-[12px] text-[var(--text-muted)] mt-[4px]">
      {order.lot} {order.price}
    </div>

    <div className="text-right text-[11px] font-semibold mt-[2px]">
      {order.status}
    </div>
    </div>
  </div>
));

/* ================= ORDERS LIST ================= */

const OrdersList = memo(({ orders }: { orders: Order[] }) => (
  <div>
    {orders.map((order) => (
      <OrderRow key={order.id} order={order} />
    ))}
  </div>
));

/* ================= MAIN PAGE ================= */

export default function TradeHistory() {
  const [activeTab, setActiveTab] = useState<TabType>("orders");

  const onTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const orderSummary = [
    { label: "Filled", value: "2" },
    { label: "Canceled", value: "0" },
    { label: "Total", value: "2" },
  ];

  const orders: Order[] = [
    {
      id: "1",
      symbol: "EURUSD",
      type: "buy",
      lot: "0.02 / 0.02",
      price: "at market",
      time: "2026.01.15 22:34:34",
      status: "FILLED",
    },
    {
      id: "2",
      symbol: "EURUSD",
      type: "sell",
      lot: "0.02 / 0.02",
      price: "at market",
      time: "2026.01.15 22:34:46",
      status: "FILLED",
    },
  ];

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
              <RefreshCw size={18} />
              <ArrowDownUp size={18} />
              <Calendar size={18} />
            </div>
          }
        />
      </TopBarSlot>

      {/* BODY */}
      <div className="px-2 md:px-4 pt-1 text-[13px] bg-[var(--bg-plan)] min-h-screen">
        <HistoryTabs activeTab={activeTab} onChange={onTabChange} />

        <div className="transition-opacity duration-200">
          {activeTab === "orders" && (
            <>
              <OrdersSummary summary={orderSummary} />
              <OrdersList orders={orders} />
            </>
          )}

          {activeTab === "positions" && (
            <div className="py-6 text-center text-[var(--text-muted)]">
              No positions
            </div>
          )}

          {activeTab === "deals" && (
            <div className="py-6 text-center text-[var(--text-muted)]">
              No deals
            </div>
          )}
        </div>
      </div>
    </>
  );
}
