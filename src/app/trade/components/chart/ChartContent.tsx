"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopBarSlot from "../layout/TopBarSlot";
import TradeTopBar from "../layout/TradeTopBar";

export default function ChartContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol") || "";

  const [theme, setTheme] = useState("dark");
  const [isDesktop, setIsDesktop] = useState(false);

  // Theme sync
  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme") || "dark";
      setTheme(storedTheme);
    };

    updateTheme();
    window.addEventListener("storage", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  // Screen size listener
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    let chartBg = "#000000";

    if (theme === "light") {
      chartBg = "#ffffff";
    } else {
      chartBg = isDesktop ? "#111827" : "#000000";
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
      theme: theme === "light" ? "light" : "dark",
      style: "1",
      locale: "en",
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview_chart",

      backgroundColor: chartBg,

      overrides: {
  "paneProperties.background": chartBg,
  "paneProperties.backgroundType": "solid",

  "paneProperties.vertGridProperties.color":
    theme === "light" ? "#e5e7eb" : "#1f2937",
  "paneProperties.horzGridProperties.color":
    theme === "light" ? "#e5e7eb" : "#1f2937",

  "scalesProperties.textColor":
    theme === "light" ? "#111827" : "#d1d5db",

  "mainSeriesProperties.candleStyle.upColor": "#22c55e",
  "mainSeriesProperties.candleStyle.downColor": "#ef4444",
}

    });


    containerRef.current.appendChild(script);
  }, [symbol, theme, isDesktop]);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[var(--bg-plan)] md:bg-[var(--bg-card)] pb-30 md:pb-0">
      <TopBarSlot>
        <TradeTopBar title="Chart" showMenu />
      </TopBarSlot>

      <div
        ref={containerRef}
        id="tradingview_chart"
        className="flex-1 w-full"
      />
    </div>
  );
}
