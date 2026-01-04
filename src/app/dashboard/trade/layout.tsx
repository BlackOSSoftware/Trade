"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import TradeBottomNav from "./components/TradeBottomNav";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function TradeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* TOP BAR */}
        {/* <header className="h-16 border-b border-[var(--border-soft)] bg-[var(--bg-glass)] flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">
                Trading Panel
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="btn btn-ghost text-sm">
                Deposit
              </button>
              <button className="btn btn-ghost text-sm">
                Withdraw
              </button>

              <button
                onClick={() => setShowExitConfirm(true)}
                className="btn btn-ghost text-sm text-red-500"
              >
                Exit
              </button>
            </div>
          </div>
        </header> */}

        {/* MAIN CONTENT */}
        <main
          className="
    flex-1
    overflow-y-auto
    pb-[64px]
    md:pb-0
  "
        >
          {children}
        </main>

        {/* BOTTOM NAV */}
        <TradeBottomNav />
      </div>

      {/* CONFIRM EXIT MODAL */}
      {showExitConfirm && (
        <ConfirmModal
          title="Exit Trading Panel"
          description="Are you sure you want to exit the trading panel and go back to the dashboard?"
          onCancel={() => setShowExitConfirm(false)}
          onConfirm={() => {
            setShowExitConfirm(false);
            router.push("/dashboard");
          }}
        />  
      )}
    </>
  );
}
