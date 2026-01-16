"use client";

import { useRouter } from "next/navigation";

export default function AccountSwitcher({
  accounts,
  currentAccountId,
  onClose,
  onSwitched,
}: {
  accounts: any[];
  currentAccountId: string;
  onClose: () => void;
  onSwitched: (accountNumber: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[var(--bg-main)] p-4 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Account List</h2>
          <button onClick={onClose} className="text-xl">
            ×
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-2">
          {accounts.map((acc) => {
            const active = acc._id === currentAccountId;

            return (
              <button
                key={acc._id}
                disabled={active}
                onClick={() => {
                  router.push(`/dashboard/trade/${acc._id}/settings`);
                  onSwitched(acc.account_number.replace("AC", ""));
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg
                  ${
                    active
                      ? "bg-[var(--primary)]/10 border border-[var(--primary)] opacity-70"
                      : "bg-[var(--bg-glass)] hover:bg-[var(--bg-glass)]/80"
                  }`}
              >
                <div className="text-left">
                  <div className="text-sm font-medium">
                    Ac. No: {acc.account_number.replace("AC", "")}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    Balance: {acc.balance.toFixed(2)}
                  </div>
                </div>

                <span
                  className={`text-xs ${
                    acc.account_type === "live"
                      ? "text-[var(--success)] font-medium"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {acc.account_type.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
