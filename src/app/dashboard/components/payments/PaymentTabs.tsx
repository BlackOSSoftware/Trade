"use client";

import { ArrowLeftRight, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { key: "swap", label: "Swap", icon: ArrowLeftRight, path: "/dashboard/payments/swap" },
  { key: "deposit", label: "Deposit", icon: ArrowDownCircle, path: "/dashboard/payments/deposit" },
  { key: "withdraw", label: "Withdraw", icon: ArrowUpCircle, path: "/dashboard/payments/withdraw" },
];

export default function PaymentTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-2 rounded-xl bg-[var(--bg-glass)] p-1">
      {tabs.map(({ key, label, icon: Icon, path }) => {
        const active = pathname.includes(key);
        return (
          <button
            key={key}
            onClick={() => router.push(path)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition
              ${
                active
                  ? "bg-[var(--primary)] text-[var(--text-invert)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-glass)]"
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
