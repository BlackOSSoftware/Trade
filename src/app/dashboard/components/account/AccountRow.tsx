"use client";

import { useState } from "react";
import {
    ChevronDown,
    MoreVertical,
    ArrowDownCircle,
    ArrowUpCircle,
    BarChart3,
} from "lucide-react";
import { useAccountById } from "@/hooks/accounts/useAccountById";
import AccountDetails from "./AccountDetails";
import { useRouter } from "next/navigation";

export default function AccountRow({
    account,
}: {
    account: {
        _id: string;
        account_number: string;
        plan_name: string;
        balance: number;
        currency: string;
        account_type: string;
    };
}) {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useAccountById(account._id, open);
    const router = useRouter();

    return (
        <div className="card">
            {/* ================= MOBILE VIEW ================= */}
            <div className="lg:hidden p-4 space-y-4">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs">
                        <span className="rounded bg-[var(--bg-glass)] text-[var(--success)] px-2 py-0.5">
                            {account.account_type === "live" ? "Live" : "Demo"}
                        </span>
                        <span className="ml-2 text-lg text-[var(--text-muted)]">
                            {account.plan_name}
                        </span>
                    </div>

                    <button onClick={() => setOpen(!open)}>
                        <ChevronDown
                            size={18}
                            className={`transition ${open ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {/* ACCOUNT NUMBER */}
                <div className="text-sm font-medium">
                    #{account.account_number.replace("AC", "")}
                </div>

                {/* BALANCE */}
                <div className="text-3xl font-semibold">
                    {account.balance.toFixed(2)}{" "}
                    <span className="text-base font-normal">
                        {account.currency}
                    </span>
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                    <Action
                        icon={<BarChart3 />}
                        label="Trade"
                        active
                        onClick={() => router.push(`/dashboard/trade/${account._id}`)}
                    />
                    <Action icon={<ArrowDownCircle />} label="Deposit" />
                    <Action icon={<ArrowUpCircle />} label="Withdraw" />
                    <Action icon={<MoreVertical />} label="More" />
                </div>

                {/* DETAILS */}
                {open && (
                    <div className="mt-4">
                        {isLoading ? (
                            <div className="text-sm text-[var(--text-muted)]">
                                Loading account details…
                            </div>
                        ) : (
                            data && (
                                <div className="rounded-xl bg-[var(--bg-glass)] p-4">
                                    <AccountDetails data={data} />
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* ================= DESKTOP VIEW ================= */}
            <div className="hidden lg:block px-6 py-5">
                <div className="flex items-center justify-between">
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                        <span className="rounded bg-[var(--bg-glass)] text-[var(--success)] px-2 py-0.5 text-xs">
                            {account.account_type === "live" ? "Live" : "Demo"}
                        </span>

                        <div className="font-medium">
                            #{account.account_number.replace("AC", "")}
                            <span className="ml-2 text-lg text-[var(--text-muted)] uppercase">
                                {account.plan_name}
                            </span>
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="text-xl font-semibold">
                        $ {account.balance.toFixed(2)}{" "}
                        <span className="text-sm font-normal">
                            {account.currency}
                        </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push(`/dashboard/trade/${account._id}`)}
                            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black"
                        >
                            Trade
                        </button>

                        <button className="rounded-md bg-[var(--bg-glass)] px-4 py-2 text-sm">
                            Deposit
                        </button>

                        <button className="rounded-md bg-[var(--bg-glass)] px-4 py-2 text-sm">
                            Withdraw
                        </button>

                        <button
                            onClick={() => setOpen(!open)}
                            className="p-1"
                        >
                            <ChevronDown
                                size={18}
                                className={`transition ${open ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {open && (
                    <div className="animate-dropdown mt-4">
                        {isLoading ? (
                            <div className="text-sm text-[var(--text-muted)]">
                                Loading account details…
                            </div>
                        ) : (
                            data && <AccountDetails data={data} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ================= HELPERS ================= */

function Action({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-1 cursor-pointer"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          active
            ? "bg-yellow-400 text-black"
            : "bg-[var(--bg-glass)]"
        }`}
      >
        {icon}
      </div>
      <span className="text-[11px]">{label}</span>
    </div>
  );
}

