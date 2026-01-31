// components/quotes/QuotesList.tsx
"use client";

import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import QuoteRow from "./QuoteRow";
import { QuoteLiveState } from "@/types/market";

type Props = {
  onSelect: (symbol: string) => void;
};

function getTradeTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  const local = localStorage.getItem("accessToken");
  if (local) return local;
  const cookie = document.cookie.split("; ").find((r) => r.trim().startsWith("tradeToken="));
  return cookie ? cookie.split("=")[1] : null;
}

export default function QuotesList({ onSelect }: Props) {
  const token = getTradeTokenFromStorage() ?? undefined;
  const liveQuotes = useMarketQuotes(token);

  // filter out undefined entries (TypeScript-safe)
  const rows = Object.values(liveQuotes).filter(
    (q): q is QuoteLiveState => !!q && !!(q as any).symbol
  );

  return (
    <div className="pb-[64px]">
      {rows.map((q) => (
        <div key={q.symbol} onClick={() => onSelect(q.symbol)} className="cursor-pointer">
          <QuoteRow live={q} />
        </div>
      ))}
    </div>
  );
}
