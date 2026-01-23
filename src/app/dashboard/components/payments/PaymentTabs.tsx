"use client";

import { ArrowLeftRight, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  {
    key: "internal-fund-transfer",
    label: "Swap",
    icon: ArrowLeftRight,
    path: "/dashboard/payments/internal-fund-transfer",
  },
  {
    key: "deposit",
    label: "Deposit",
    icon: ArrowDownCircle,
    path: "/dashboard/payments/deposit",
  },
  {
    key: "withdraw",
    label: "Withdraw",
    icon: ArrowUpCircle,
    path: "/dashboard/payments/withdraw",
  },
];

export default function PaymentTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = tabs.findIndex(tab =>
    pathname.includes(tab.key)
  );

  return (
    <div className="relative flex rounded-xl bg-[var(--bg-glass)] p-1">
      {/* Sliding Active Background */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1 bottom-1 rounded-lg bg-[var(--primary)]"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${(100 / tabs.length) * activeIndex}%`,
        }}
      />

      {tabs.map(({ key, label, icon: Icon, path }, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={key}
            onClick={() => router.push(path)}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors
              ${
                active
                  ? "text-[var(--text-invert)]"
                  : "text-[var(--text-muted)]"
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
