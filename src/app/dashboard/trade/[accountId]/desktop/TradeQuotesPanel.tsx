"use client";

import { useTradeDesktop } from "./TradeDesktopContext";
import QuotesUI from "../../components/quotes/QuotesUI";

export default function TradeQuotesPanel() {
  const { quotesOpen } = useTradeDesktop();

  return (
    <aside
      className={`
        hidden md:block fixed top-0 h-full z-30
        bg-[var(--bg-main)] border-r border-white/10
        transition-all duration-300 ease-in-out
        ${quotesOpen ? "left-[56px] w-auto" : "left-[56px] w-0"}
      `}
    >
      {quotesOpen && (
        <div className="w-auto h-full p-1 text-sm overflow-y-auto mt-4">
          <QuotesUI showTopBar />
        </div>
      )}
    </aside>
  );
}
