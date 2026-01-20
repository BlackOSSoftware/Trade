"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";

import TradeBottomNav from "./components/layout/TradeBottomNav";
import { TradeSidebarProvider } from "./components/layout/TradeSidebarContext";
import TradeSidebar from "./components/layout/TradeSidebar";

import { useAccountById } from "@/hooks/accounts/useAccountById";
import { useUserMe } from "@/hooks/useUser";

import { TradeDesktopProvider } from "./[accountId]/desktop/TradeDesktopContext";
import TradeDesktopSidebar from "./[accountId]/desktop/TradeDesktopSidebar";
import TradeQuotesPanel from "./[accountId]/desktop/TradeQuotesPanel";

export default function TradeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { accountId } = useParams<{ accountId: string }>();
  const { data: account } = useAccountById(accountId, true);
  const { data: user } = useUserMe();

  return (
    <TradeSidebarProvider>
      <TradeDesktopProvider>
        <TradeLayoutInner
          account={account}
          userName={user?.name ?? ""}
        >
          {children}
        </TradeLayoutInner>
      </TradeDesktopProvider>
    </TradeSidebarProvider>
  );
}

import { useTradeDesktop } from "./[accountId]/desktop/TradeDesktopContext";

function TradeLayoutInner({
  children,
  account,
  userName,
}: {
  children: ReactNode;
  account: any;
  userName: string;
}) {
  const { quotesOpen } = useTradeDesktop();

  return (
    <div className="min-h-screen mt-font mt-numbers">
      {/* ============ MOBILE / TABLET ============ */}
      <div className="md:hidden flex flex-col min-h-screen">
        <div id="trade-topbar-slot" />

        <main className="flex-1 overflow-y-auto pb-[64px] mt-14">
          {children}
        </main>

        <TradeBottomNav />

        {account && (
          <TradeSidebar
            userName={userName}
            accountType={account.account_type}
            accountNumber={account.account_number.replace("AC", "")}
          />
        )}
      </div>

      {/* ============ DESKTOP ============ */}
      <div className="hidden md:flex min-h-screen bg-[var(--bg-plan)] md:bg-[var(--bg-main)]">
        {/* ICON ONLY SIDEBAR */}
        <TradeDesktopSidebar />

        {/* MAIN CONTENT - FIXED POSITIONING */}
        <main
          className={`
            flex-1 overflow-y-auto transition-all duration-300 ease-in-out
            ${quotesOpen ? "ml-[406px]" : "ml-[56px]"}
          `}
        >
          {children}
        </main>

        {/* QUOTES PANEL - FIXED */}
        <TradeQuotesPanel />
      </div>
    </div>
  );
}
