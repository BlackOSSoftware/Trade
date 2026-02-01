// hooks/useMarketQuotes.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MarketSocket } from "@/services/marketSocket.service";
import { QuoteLiveState } from "@/types/market";
import { useWatchlist } from "./watchlist/useWatchlist";

/**
 * useMarketQuotes
 * - token: tradeToken (string). If falsy, socket won't connect.
 * - returns a map: { [SYMBOL]: QuoteLiveState }
 *
 * Notes:
 * - No accountId anywhere.
 * - Uses watchlist from useWatchlist() as the source of symbols to subscribe.
 * - Batches updates via requestAnimationFrame to avoid re-render storms.
 */

type QuoteMap = Record<string, QuoteLiveState | undefined>;

export function useMarketQuotes(token?: string) {
  const socketRef = useRef<MarketSocket | null>(null);
  const bufferRef = useRef<QuoteMap>({});
  const rafRef = useRef<number | null>(null);
  const subscribedRef = useRef<Set<string>>(new Set());
  
  const [quotes, setQuotes] = useState<QuoteMap>({});

  // watchlist comes from your existing hook (which uses tradeApi)
  const { data: watchlist } = useWatchlist();

  /* ---------- connect / disconnect socket when token changes ---------- */
  useEffect(() => {
    if (!token) {
      // cleanup if token removed
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      subscribedRef.current.clear();
      bufferRef.current = {};
      setQuotes({});
      return;
    }

    // already connected
    if (socketRef.current) return;

    const socket = new MarketSocket();
    socketRef.current = socket;

    socket.connect(token, (msg: any) => {
      try {
        // handle server "subscribed" acknowledgement message
        if (msg.status === "subscribed" && msg.symbol) {
  const sym = msg.symbol;
  const cur = bufferRef.current[sym];

  if (cur) {
    const dayClose =
      msg.dayClose !== undefined ? String(msg.dayClose) : cur.bid;

    bufferRef.current[sym] = {
      ...cur,
      high: msg.dayHigh ? Number(msg.dayHigh) : cur.high,
      low: msg.dayLow ? Number(msg.dayLow) : cur.low,

      // 🔥 fallback price when market closed
      bid: dayClose,
      ask: dayClose,
      bidDir: "same",
      askDir: "same",
    };

    scheduleFlush();
  }

  return;
}

        // orderbook / market update
        if (msg.type === "orderbook" && msg.data?.code) {
          const s = msg.data.code;
          const bid = msg.data.bids?.[0];
          const ask = msg.data.asks?.[0];

          // if we don't have a buffer entry yet, create a placeholder (so UI shows something)
          if (!bufferRef.current[s]) {
            bufferRef.current[s] = {
              symbol: s,
              bid: "--",
              ask: "--",
              bidVolume: "--",
              askVolume: "--",
              bidDir: "same",
              askDir: "same",
            } as unknown as QuoteLiveState;
          }

          const old = bufferRef.current[s] as any;

          // update only when we have prices
          if (
  bid &&
  ask &&
  Number(bid.price) > 0 &&
  Number(ask.price) > 0
) {

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
            } as unknown as QuoteLiveState;

            scheduleFlush();
          }
        }
      } catch (err) {
        // be resilient to malformed messages
        console.warn("[useMarketQuotes] message handler error", err);
      }
    });

    return () => {
      socket.close();
      socketRef.current = null;
      subscribedRef.current.clear();
      bufferRef.current = {};
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setQuotes({});
    };
    // intentionally run only when token changes
  }, [token]);

  /* ---------- subscribe/unsubscribe when watchlist changes ---------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !watchlist) return;

    // build set of desired symbols
    const desired = new Set(watchlist.map((w: any) => w.code));

    // subscribe new symbols
    for (const item of watchlist) {
      const code = item.code;
      if (!subscribedRef.current.has(code)) {
        subscribedRef.current.add(code);
        // create initial placeholder in buffer
        bufferRef.current[code] = {
          symbol: code,
          bid: "--",
          ask: "--",
          bidVolume: "--",
          askVolume: "--",
          bidDir: "same",
          askDir: "same",
        } as unknown as QuoteLiveState;

        // attempt immediate subscribe; MarketSocket will queue it if socket not open
        socket.subscribe(code);
      }
    }

    // unsubscribe removed symbols
    for (const code of Array.from(subscribedRef.current)) {
      if (!desired.has(code)) {
        subscribedRef.current.delete(code);
        delete bufferRef.current[code];
        socket.unsubscribe(code);
      }
    }

    scheduleFlush();
  }, [watchlist]);

  /* ---------- flush logic (batch updates) ---------- */
  function scheduleFlush() {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      // shallow copy to trigger react updates
      setQuotes({ ...bufferRef.current });
    });
  }

  return quotes;
}
