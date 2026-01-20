"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MarketSocket } from "@/services/marketSocket.service";
import { fetchWatchlist } from "@/services/watchlist.service";
import { QuoteLiveState } from "@/types/market";

type QuoteMap = Record<string, QuoteLiveState>;

export function useMarketQuotes(token: string, accountId: string) {
  const socketRef = useRef<MarketSocket | null>(null);
  const bufferRef = useRef<QuoteMap>({});
  const frameRef = useRef<number | null>(null);
  const subscribedRef = useRef<Set<string>>(new Set());

  const [quotes, setQuotes] = useState<QuoteMap>({});

  /* 🔑 WATCHLIST AS SOURCE OF TRUTH */
  const watchlistQuery = useQuery({
    queryKey: ["watchlist", accountId],
    queryFn: () => fetchWatchlist(accountId),
    enabled: !!accountId,
  });

  /* 🔹 SOCKET INIT (ONCE) */
  useEffect(() => {
    if (!token || socketRef.current) return;

    const socket = new MarketSocket();
    socketRef.current = socket;

    socket.connect(token, (msg: any) => {
      if (msg.status === "subscribed") {
        const s = msg.symbol;
        if (!bufferRef.current[s]) return;

        bufferRef.current[s] = {
          ...bufferRef.current[s],
          high: Number(msg.dayHigh),
          low: Number(msg.dayLow),
        };
        flush();
        return;
      }

      if (msg.type === "orderbook") {
        const s = msg.data.code;
        const bid = msg.data.bids?.[0];
        const ask = msg.data.asks?.[0];
        if (!bid || !ask) return;

        const old = bufferRef.current[s];
        if (!old) return;

        bufferRef.current[s] = {
          ...old,
          bid: bid.price,
          ask: ask.price,
          bidVolume: bid.volume,
          askVolume: ask.volume,
          bidDir:
            old.bid === "--"
              ? "same"
              : Number(bid.price) > Number(old.bid)
              ? "up"
              : Number(bid.price) < Number(old.bid)
              ? "down"
              : old.bidDir,
          askDir:
            old.ask === "--"
              ? "same"
              : Number(ask.price) > Number(old.ask)
              ? "up"
              : Number(ask.price) < Number(old.ask)
              ? "down"
              : old.askDir,
        };

        flush();
      }
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token]);

  /* 🔹 WATCHLIST SYNC (ADD / REMOVE HANDLER) */
  useEffect(() => {
    if (!watchlistQuery.data || !socketRef.current) return;

    const nextCodes = new Set(
      watchlistQuery.data.map((w) => w.code)
    );

    // ➕ ADD NEW SYMBOLS
    watchlistQuery.data.forEach((w) => {
      if (!subscribedRef.current.has(w.code)) {
        subscribedRef.current.add(w.code);
        bufferRef.current[w.code] = {
          symbol: w.code,
          bid: "--",
          ask: "--",
          bidVolume: "--",
          askVolume: "--",
          bidDir: "same",
          askDir: "same",
        };
        socketRef.current!.subscribe(w.code);
      }
    });

    // ➖ REMOVE SYMBOLS
    Object.keys(bufferRef.current).forEach((code) => {
      if (!nextCodes.has(code)) {
        delete bufferRef.current[code];
        subscribedRef.current.delete(code);
        socketRef.current!.unsubscribe(code);
      }
    });

    flush();
  }, [watchlistQuery.data]);

  function flush() {
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setQuotes({ ...bufferRef.current });
    });
  }

  return quotes;
}
