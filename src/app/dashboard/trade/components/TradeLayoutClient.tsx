"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";


import { useAccountById } from "@/hooks/accounts/useAccountById";
import { TradeSidebarProvider } from "./layout/TradeSidebarContext";
import { TradeDesktopProvider, useTradeDesktop } from "./desktop/TradeDesktopContext";
import TradeBottomNav from "./layout/TradeBottomNav";
import TradeSidebar from "./layout/TradeSidebar";
import TradeDesktopSidebar from "./desktop/TradeDesktopSidebar";
import TradeQuotesPanel from "./desktop/TradeQuotesPanel";
import { useUserMe } from "@/hooks/useUser";


export default function TradeLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const { accountId } = useParams<{ accountId: string }>();
  const { data: account } = useAccountById(accountId, true);
//   const { data: user } = useUserMe();

  return (
    <TradeSidebarProvider>
      <TradeDesktopProvider>
        <TradeLayoutInner
          account={account}
          userName= ""
        >
          {children}
        </TradeLayoutInner>
      </TradeDesktopProvider>
    </TradeSidebarProvider>
  );
}

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
      <div className="hidden md:flex min-h-screen bg-[var(--bg-plan)] md:bg-[var(--bg-card)]">
        <TradeDesktopSidebar />

        <main
          className={`
            flex-1 overflow-y-auto transition-all duration-300 ease-in-out
            ${quotesOpen ? "ml-[408px]" : "ml-[68px]"}
          `}
        >
          {children}
        </main>

        <TradeQuotesPanel />
      </div>
    </div>
  );
}
