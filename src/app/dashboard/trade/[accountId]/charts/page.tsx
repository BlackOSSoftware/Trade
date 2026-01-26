"use client";

import { useEffect, useRef } from "react";

export default function Chart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "FX:EURUSD",
      interval: "15",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview_chart",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full min-h-screen bg-[var(--bg-main)]">
      <div
        ref={containerRef}
        id="tradingview_chart"
        className="w-full h-[calc(100vh-60px)]"
      />
    </div>
  );
}
