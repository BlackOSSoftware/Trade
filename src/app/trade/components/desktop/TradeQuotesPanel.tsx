"use client";

import { useTradeDesktop } from "./TradeDesktopContext";
import QuotesUI from "../quotes/QuotesUI";

export default function TradeQuotesPanel() {
  const { quotesOpen } = useTradeDesktop();

  return (
    <aside
      className={`
        hidden md:flex fixed top-0 h-full z-30
        transition-all duration-300 ease-in-out
        ${quotesOpen ? "left-[68px] w-[340px]" : "left-[68px] w-0"}
      `}
      style={{
        background: "var(--bg-card)",
        overflow: "hidden",
      }}
    >
      {quotesOpen && (
        <div className="w-full h-full flex flex-col">
          {/* PANEL HEADER */}
          <div
            className="px-4 py- flex items-center justify-between"
            style={{
              borderBottom: "1px solid var(--border-soft)",
            }}
          >
          </div>

          {/* PANEL CONTENT */}
          <div className="flex-1 overflow-y-auto px-2 ">
            <QuotesUI showTopBar />
          </div>
        </div>
      )}
    </aside>
  );
}
