// components/quotes/QuotesList.tsx
"use client";

import QuoteRow from "./QuoteRow";

export type QuoteData = {
  symbol: string;
  change: string;
  percent: string;
  bid: string;
  bidSup: string;
  ask: string;
  askSup: string;
  low: string;
  high: string;
  time: string;
  bars: string;
};

const symbols: QuoteData[] = [
  {
    symbol: "EURUSD",
    change: "-4",
    percent: "-0.03%",
    bid: "1.1719",
    bidSup: "3",
    ask: "1.1727",
    askSup: "1",
    low: "1.17181",
    high: "1.17193",
    time: "00:05:00",
    bars: "78",
  },
  {
    symbol: "GBPUSD",
    change: "-12",
    percent: "-0.09%",
    bid: "1.3446",
    bidSup: "8",
    ask: "1.3461",
    askSup: "8",
    low: "1.34443",
    high: "1.34468",
    time: "00:05:00",
    bars: "150",
  },
  {
    symbol: "USDCHF",
    change: "-28",
    percent: "-0.16%",
    bid: "0.7910",
    bidSup: "7",
    ask: "0.7927",
    askSup: "2",
    low: "0.79036",
    high: "0.79107",
    time: "00:05:01",
    bars: "165",
  },
  {
    symbol: "USDJPY",
    change: "-9",
    percent: "-0.06%",
    bid: "156.73",
    bidSup: "1",
    ask: "156.79",
    askSup: "0",
    low: "156.688",
    high: "156.731",
    time: "00:05:03",
    bars: "59",
  },
  {
    symbol: "USDCNH",
    change: "-13",
    percent: "-0.02%",
    bid: "6.9648",
    bidSup: "0",
    ask: "6.9735",
    askSup: "3",
    low: "6.96480",
    high: "6.96663",
    time: "00:05:02",
    bars: "873",
  },
  {
    symbol: "USDRUB",
    change: "0",
    percent: "0.00%",
    bid: "78.19",
    bidSup: "1",
    ask: "80.98",
    askSup: "8",
    low: "78.191",
    high: "78.191",
    time: "10:00:03",
    bars: "2797",
  },
  {
    symbol: "AUDUSD",
    change: "-121",
    percent: "-0.18%",
    bid: "0.6680",
    bidSup: "2",
    ask: "0.6685",
    askSup: "0",
    low: "0.66764",
    high: "0.66802",
    time: "00:04:35",
    bars: "48",
  },
  {
    symbol: "NZDUSD",
    change: "-67",
    percent: "-0.12%",
    bid: "0.5760",
    bidSup: "8",
    ask: "0.5769",
    askSup: "7",
    low: "0.57496",
    high: "0.57608",
    time: "00:05:01",
    bars: "89",
  },
  {
    symbol: "USDCAD",
    change: "+17",
    percent: "0.01%",
    bid: "1.3731",
    bidSup: "1",
    ask: "1.3747",
    askSup: "2",
    low: "1.37255",
    high: "1.37328",
    time: "00:05:00",
    bars: "161",
  },
  {
    symbol: "USDSEK",
    change: "+829",
    percent: "0.09%",
    bid: "9.2085",
    bidSup: "6",
    ask: "9.2234",
    askSup: "5",
    low: "9.20512",
    high: "9.22401",
    time: "00:05:00",
    bars: "311",
  },
];


type QuotesListProps = {
  onSelect: (symbol: string) => void;
};

export default function QuotesList({ onSelect }: QuotesListProps) {
  return (
    <div className="pb-[64px]">
      {symbols.map((s) => (
        <div
          key={s.symbol}
          onClick={() => onSelect(s.symbol)}
          className="cursor-pointer"
        >
          <QuoteRow data={s} />
        </div>
      ))}
    </div>
  );
}
