"use client";

import { ReactNode } from "react";
import { TradeSidebarProvider } from "./components/layout/TradeSidebarContext";
import TradeBottomNav from "./components/layout/TradeBottomNav";
import TradeSidebar from "./components/layout/TradeSidebar";
import { TradeDesktopProvider, useTradeDesktop } from "./components/desktop/TradeDesktopContext";
import TradeDesktopSidebar from "./components/desktop/TradeDesktopSidebar";
import TradeQuotesPanel from "./components/desktop/TradeQuotesPanel";
import { useTradeAccount } from "@/hooks/accounts/useAccountById";
import { LanguageProvider } from "./components/LanguageProvider";

export default function TradeLayoutClient({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <LanguageProvider>

            <TradeSidebarProvider>
                <TradeDesktopProvider>
                    <TradeLayoutInner>
                        {children}
                    </TradeLayoutInner>
                </TradeDesktopProvider>
            </TradeSidebarProvider>
        </LanguageProvider>
    );
}

function TradeLayoutInner({
    children,
}: {
    children: ReactNode;
}) {
    const { quotesOpen } = useTradeDesktop();
    const { data: account } = useTradeAccount();// comes from global state

    return (
        <div className="min-h-screen mt-font mt-numbers bg-[var(--bg-plan)] md:bg-[var(--bg-card)]">

            {/* ============ MOBILE / TABLET ============ */}
            <div className="md:hidden flex flex-col min-h-screen">
                <div id="trade-topbar-slot" />

                <main className="flex-1 overflow-y-auto pb-[64px] md:pb-0 mt-14">
                    {children}
                </main>

                <TradeBottomNav />

                <TradeSidebar />

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
