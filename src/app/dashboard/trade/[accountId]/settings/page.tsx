"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { useAccountById } from "@/hooks/accounts/useAccountById";
import { useMyAccounts } from "@/hooks/useMyAccounts";
import { useUserMe } from "@/hooks/useUser";

import AccountSwitcher from "../../components/AccountSwitcher";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";
import ConfirmModal from "@/app/components/ui/ConfirmModal";
import { Toast } from "@/app/components/ui/Toast";

export default function TradePage() {
  const { accountId } = useParams<{ accountId: string }>();
  const router = useRouter();

  const [openSwitcher, setOpenSwitcher] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
 const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { data, isLoading } = useAccountById(accountId, true);
  const { data: accounts } = useMyAccounts();
  const { data: userData } = useUserMe();

  if (isLoading) {
    return (
      <div className="p-6">
        <GlobalLoader />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-red-500">Account not found</div>;
  }

  return (
    <>
      {/* TOP BAR */}
      <TopBarSlot>
        <TradeTopBar
          title="Settings"
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
      

      {/* ACCOUNT HEADER */}
      <div
        onClick={() => setOpenSwitcher(true)}
        className="relative mx-3 mt-3 rounded-xl bg-[var(--bg-glass)] px-4 py-4 cursor-pointer"
      >
        <div className="flex flex-col items-center text-center gap-0.5 py-1">
          <div className="text-lg font-semibold">
            {userData?.name}
          </div>

          <div className="text-sm py-1">
            ALS Trade –{" "}
            <span
              className={
                data.account_type === "live"
                  ? "text-[var(--success)] font-medium"
                  : "text-[var(--text-muted)]"
              }
            >
              {data.account_type === "live" ? "Live" : "Demo"}
            </span>
          </div>

          <div className="text-sm py-1">
            Ac. No : {data.account_number.replace("AC", "")}
          </div>

          <div className="text-sm py-1">
            Balance : {data.balance.toFixed(2)} {data.currency}
          </div>
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronRight size={22} />
        </div>
      </div>

      {/* ACCOUNT SWITCHER */}
      {openSwitcher && accounts && (
        <AccountSwitcher
          accounts={accounts}
          currentAccountId={accountId}
          onClose={() => setOpenSwitcher(false)}
          onSwitched={(accNo) => {
            setToast({ message: `Successfully switched to account ${accNo}`, type: "success" });
            setTimeout(() => setToast(null), 2500);
          }}
        />
      )}

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
