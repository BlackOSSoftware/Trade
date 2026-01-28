"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";

export default function Chart() {
  const containerRef = useRef<HTMLDivElement>(null);
const searchParams = useSearchParams();
const symbol = searchParams.get("symbol") || "";

 useEffect(() => {
  if (!containerRef.current) return;

  containerRef.current.innerHTML = "";

  const isDesktop = window.innerWidth >= 768;
  const savedTheme = localStorage.getItem("theme"); 

  let bgColor = "#000000";

  if (savedTheme === "light") {
    bgColor = "#ffffff";
  } else {
    bgColor = isDesktop ? "#111827" : "#000000";
  }

  const resolveSymbol = (s: string) => {
    if (!s) return "FX:EURUSD";
    if (s.includes(":")) return s;
    if (s.endsWith("USDT") || s.endsWith("BTC")) {
      return `BINANCE:${s}`;
    }
    return `FX:${s}`;
  };

  const script = document.createElement("script");
  script.src =
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  script.type = "text/javascript";
  script.async = true;

  script.innerHTML = JSON.stringify({
    autosize: true,
    symbol: resolveSymbol(symbol),
    interval: "15",
    timezone: "Asia/Kolkata",
    theme: savedTheme === "light" ? "light" : "dark",
    style: "1",
    locale: "en",
    hide_side_toolbar: false,
    allow_symbol_change: true,
    container_id: "tradingview_chart",

    overrides: {
      "paneProperties.background": bgColor,
      "paneProperties.vertGridProperties.color":
        savedTheme === "light" ? "#e5e7eb" : "#1f2937",
      "paneProperties.horzGridProperties.color":
        savedTheme === "light" ? "#e5e7eb" : "#1f2937",
      "scalesProperties.textColor":
        savedTheme === "light" ? "#111827" : "#9ca3af",

      "mainSeriesProperties.candleStyle.upColor": "#22c55e",
      "mainSeriesProperties.candleStyle.downColor": "#ef4444",
      "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
      "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
      "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
      "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
    },
  });

  containerRef.current.appendChild(script);
}, [symbol]);


  return (
    <>
    <TopBarSlot>
            <TradeTopBar
              title="Chart"
              showMenu
              
            />
          </TopBarSlot>
    <div className="w-full h-full min-h-screen bg-[var(--bg-plan)] md:bg-[var(--bg-card)]">
      <div
        ref={containerRef}
        id="tradingview_chart"
        className="w-full h-[calc(100vh-60px)]"
        />
    </div>
        </>
  );
}
