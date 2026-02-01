"use client";

import { useEffect, useRef, useState } from "react";
import { MarketSocket } from "@/services/marketSocket.service";
import { QuoteLiveState } from "@/types/market";
import { useWatchlist } from "./watchlist/useWatchlist";

type QuoteMap = Record<string, QuoteLiveState | undefined>;

export function useMarketQuotes(token?: string) {
  const socketRef = useRef<MarketSocket | null>(null);
  const bufferRef = useRef<QuoteMap>({});
  const rafRef = useRef<number | null>(null);
  const subscribedRef = useRef<Set<string>>(new Set());

  const [quotes, setQuotes] = useState<QuoteMap>({});
  const { data: watchlist } = useWatchlist();

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      subscribedRef.current.clear();
      bufferRef.current = {};
      setQuotes({});
      return;
    }

    if (socketRef.current) return;

    const socket = new MarketSocket();
    socketRef.current = socket;

    socket.connect(token, (msg: any) => {
      try {

        /* ===================== SUBSCRIBED MESSAGE ===================== */
        if (msg.status === "subscribed" && msg.symbol) {
          const sym = msg.symbol;
          const cur = bufferRef.current[sym];

          if (cur) {
            const dayClose =
              msg.dayClose !== undefined
                ? String(msg.dayClose)
                : cur.bid;

            bufferRef.current[sym] = {
              ...cur,

              high: msg.dayHigh !== undefined ? Number(msg.dayHigh) : cur.high,
              low: msg.dayLow !== undefined ? Number(msg.dayLow) : cur.low,
              dayOpen: msg.dayOpen !== undefined ? Number(msg.dayOpen) : cur.dayOpen,
              dayClose: msg.dayClose !== undefined ? Number(msg.dayClose) : cur.dayClose,

              bid: dayClose,
              ask: dayClose,
              bidDir: "same",
              askDir: "same",
            };

            scheduleFlush();
          }

          return;
        }

        /* ===================== ORDERBOOK MESSAGE ===================== */
        if (msg.type === "orderbook" && msg.data?.code) {
          const s = msg.data.code;
          const bid = msg.data.bids?.[0];
          const ask = msg.data.asks?.[0];

          // Convert tick_time
          const tickTime = msg.data.tick_time
            ? new Date(Number(msg.data.tick_time)).toLocaleTimeString("en-US", {
                hour12: false,
              })
            : undefined;

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

          if (
            bid &&
            ask &&
            Number(bid.price) > 0 &&
            Number(ask.price) > 0
          ) {

            const currentPrice = Number(bid.price);
            const dayClose = old.dayClose ?? 0;

            let change = 0;
            let changePercent = 0;

            if (dayClose > 0) {
              change = currentPrice - dayClose;
              changePercent = (change / dayClose) * 100;
            }

            bufferRef.current[s] = {
              ...old,

              bid: bid.price,
              ask: ask.price,
              bidVolume: bid.volume,
              askVolume: ask.volume,
              tickTime,

              change,
              changePercent,

              bidDir:
                old.bid === "--"
                  ? "same"
                  : currentPrice > Number(old.bid)
                  ? "up"
                  : currentPrice < Number(old.bid)
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
  }, [token]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !watchlist) return;

    const desired = new Set(watchlist.map((w: any) => w.code));

    for (const item of watchlist) {
      const code = item.code;
      if (!subscribedRef.current.has(code)) {
        subscribedRef.current.add(code);
        bufferRef.current[code] = {
          symbol: code,
          bid: "--",
          ask: "--",
          bidVolume: "--",
          askVolume: "--",
          bidDir: "same",
          askDir: "same",
        } as unknown as QuoteLiveState;

        socket.subscribe(code);
      }
    }

    for (const code of Array.from(subscribedRef.current)) {
      if (!desired.has(code)) {
        subscribedRef.current.delete(code);
        delete bufferRef.current[code];
        socket.unsubscribe(code);
      }
    }

    scheduleFlush();
  }, [watchlist]);

  function scheduleFlush() {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setQuotes({ ...bufferRef.current });
    });
  }

  return quotes;
}
