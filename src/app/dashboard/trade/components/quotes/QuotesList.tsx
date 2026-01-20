"use client";

import { useMarketQuotes } from "@/hooks/useMarketQuotes";
import QuoteRow from "./QuoteRow";

type Props = {
  token: string;
  accountId: string;
  onSelect: (symbol: string) => void;
};

export default function QuotesList({
  token,
  accountId,
  onSelect,
}: Props) {
  const liveQuotes = useMarketQuotes(token, accountId);

  return (
    <div className="pb-[64px]">
      {Object.values(liveQuotes).map((q) => (
        <div
          key={q.symbol}
          onClick={() => onSelect(q.symbol)}
          className="cursor-pointer"
        >
          <QuoteRow live={q} />
        </div>
      ))}
    </div>
  );
}
