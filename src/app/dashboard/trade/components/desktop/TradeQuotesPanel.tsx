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
        borderRight: "1px solid var(--border-soft)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {quotesOpen && (
        <div className="w-full h-full flex flex-col">
          {/* <div
            className="px-4 py-3 text-sm font-semibold"
            style={{
              borderBottom: "1px solid var(--border-soft)",
            }}
          >
            Quotes
          </div> */}

          <div className="flex-1 overflow-y-auto px-2 py-2">
            <QuotesUI showTopBar />
          </div>
        </div>
      )}
    </aside>
  );
}
