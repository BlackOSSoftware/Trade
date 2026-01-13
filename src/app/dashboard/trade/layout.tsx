"use client";

import { ReactNode } from "react";
import TradeBottomNav from "./components/layout/TradeBottomNav";

export default function TradeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col mt-font mt-numbers">
      {/* TOP BAR SLOT */}
      <div id="trade-topbar-slot" />

      <main className="flex-1 overflow-y-auto pb-[64px] mt-14">
        {children}
      </main>

      <TradeBottomNav />
    </div>
  );
}
