"use client";

import { useEffect, useRef, useState } from "react";

type LiveAccount = {
  balance: number;
  equity: number;
  usedMargin: number;
  freeMargin: number;
};

export type LivePosition = {
  accountId: string;

  positionId: string;
  symbol: string;

  side: "BUY" | "SELL";

  volume: number;            // lot size
  openPrice: number;
  currentPrice: number;

  floatingPnL: number;

  stopLoss: number | null;
  takeProfit: number | null;

  swap: number;
  commission: number;

  openTime?: string;         // optional (if socket doesn’t send)
};
export type LivePending = {
  orderId: string;
  symbol: string;
  side: "BUY" | "SELL";
  orderType: string;
  price: number;
  volume: number;
  stopLoss: number | null;
  takeProfit: number | null;
  createdAt: number;
  currentPrice?: number;
  status: string;
};


export const useLiveTradeSocket = (accountId?: string) => {
  const wsRef = useRef<WebSocket | null>(null);

  const [account, setAccount] = useState<LiveAccount | null>(null);
  const [positions, setPositions] = useState<
    Record<string, LivePosition>
  >({});
  const [pendingOrders, setPendingOrders] = useState<
    Record<string, LivePending>
  >({});


  useEffect(() => {
    if (!accountId) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_SOKETAPIBASE_URL}/account`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "identify",
          accountId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "live_account") {
          setAccount(message.data);
        }

        if (message.type === "live_position") {
          setPositions((prev) => ({
            ...prev,
            [message.data.positionId]: message.data,
          }));
        }
        if (message.type === "live_pending") {
          setPendingOrders((prev) => ({
            ...prev,
            [message.data.orderId]: message.data,
          }));
        }

      } catch (err) {
        console.error("Socket parse error", err);
      }
    };

    ws.onclose = () => {
      setTimeout(() => {
        wsRef.current = null;
      }, 2000);
    };

    return () => {
      ws.close();
    };
  }, [accountId]);

  return {
    account,
    positions: Object.values(positions),
    pending: Object.values(pendingOrders),
  };
};
