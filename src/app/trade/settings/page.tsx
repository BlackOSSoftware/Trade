"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTradeAccount } from "@/hooks/accounts/useAccountById";

import GlobalLoader from "@/app/components/ui/GlobalLoader";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { Toast } from "@/app/components/ui/Toast";
import TopBarSlot from "../components/layout/TopBarSlot";
import TradeTopBar from "../components/layout/TradeTopBar";
import { ChevronRight } from "lucide-react";

export default function TradePage() {
  const router = useRouter();

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ✅ Active trade account (no accountId needed)
  const { data: account, isLoading } = useTradeAccount();

  if (isLoading) {
    return (
      <div className="p-6">
        <GlobalLoader />
      </div>
    );
  }

  if (!account) {
    return <div className="p-6 text-red-500">Account not found</div>;
  }

  return (
    <>
      {/* TOP BAR */}
      <TopBarSlot>
        <TradeTopBar
          title="Account Details"
          showMenu
          right={
            <button
              onClick={() => setShowExitConfirm(true)}
              className="btn btn-ghost text-sm text-red-500"
            >
              Exit
            </button>
          }
        />
      </TopBarSlot>

      {/* ACCOUNT CARD */}
      <div
        className="relative mx-3 mt-3 rounded-xl bg-[var(--bg-glass)] px-4 py-4 cursor-pointer"
      >
        <div className="flex flex-col items-center text-center gap-0.5 py-1">
          <div className="text-lg font-semibold">
            {account?.name}
          </div>

          <div className="text-sm py-1">
            ALS Trade –{" "}
            <span
              className={
                account.account_type === "live"
                ? "text-[var(--text-muted)]"
                  : "text-[var(--success)] font-medium"
              }
            >
              {account.account_type === "live" ? "Demo" : "Live"}
            </span>
          </div>

          <div className="text-sm py-1">
            Ac. No : {account.accountNumber?.replace("AC", "") || "--"}
          </div>

          <div className="text-sm py-1">
            Balance : {account.balance.toFixed(2)} {account.currency}
          </div>
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronRight size={22} />
        </div>
      </div>

      {/* EXIT CONFIRM */}
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

      {/* TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
