"use client";

import { useState, useEffect } from "react";
import {
    ChevronDown,
    MoreVertical,
    ArrowDownCircle,
    ArrowUpCircle,
    BarChart3,
    RefreshCw,
} from "lucide-react";
import { useAccountById } from "@/hooks/accounts/useAccountById";
import AccountDetails from "./AccountDetails";
import { useRouter } from "next/navigation";
import { Toast } from "@/app/components/ui/Toast";
import { useResetDemoAccount } from "@/hooks/useResetDemoAccount";

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
    const resetDemo = useResetDemoAccount();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const isDemo = account.account_type === "demo";

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const handleResetDemo = async () => {
        try {
            await resetDemo.mutateAsync(account._id);
            setToast({ message: "Demo balance reset successfully", type: "success" });
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to reset demo balance";
            setToast({ message, type: "error" });
        }
    };

    return (
        <div className="card">
            {/* ================= MOBILE VIEW ================= */}
            <div className="lg:hidden p-1 md:p-4 space-y-4">
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
                <div
                    className={`grid gap-3 text-center text-xs ${
                        isDemo ? "grid-cols-2" : "grid-cols-3"
                    }`}
                >
                    <Action
                        icon={<BarChart3 />}
                        label="Trade"
                        active
                        onClick={() =>
                            router.push(
                                `/trade-login?account=${encodeURIComponent(account.account_number)}`
                            )
                        }
                    />

                    {isDemo ? (
                        <Action
                            icon={<RefreshCw />}
                            label={resetDemo.isPending ? "Resetting..." : "Reset Demo"}
                            onClick={handleResetDemo}
                            disabled={resetDemo.isPending}
                        />
                    ) : (
                        <>
                            <Action
                                icon={<ArrowDownCircle />}
                                label="Deposit"
                                onClick={() =>
                                    router.push(`/dashboard/payments/deposit?account=${account._id}`)
                                }
                            />
                            <Action
                                icon={<ArrowUpCircle />}
                                label="Withdraw"
                                onClick={() =>
                                    router.push(`/dashboard/payments/withdraw?account=${account._id}`)
                                }
                            />
                        </>
                    )}
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
                            onClick={() =>
                                router.push(
                                    `/trade-login?account=${encodeURIComponent(account.account_number)}`
                                )
                            }
                            className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-black"
                        >
                            Trade
                        </button>

                        {isDemo ? (
                            <button
                                onClick={handleResetDemo}
                                disabled={resetDemo.isPending}
                                className="rounded-md bg-[var(--bg-glass)] px-4 py-2 text-sm disabled:opacity-60"
                            >
                                {resetDemo.isPending ? "Resetting..." : "Reset Demo"}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() =>
                                        router.push(`/dashboard/payments/deposit?account=${account._id}`)
                                    }
                                    className="rounded-md bg-[var(--bg-glass)] px-4 py-2 text-sm"
                                >
                                    Deposit
                                </button>

                                <button
                                    onClick={() =>
                                        router.push(`/dashboard/payments/withdraw?account=${account._id}`)
                                    }
                                    className="rounded-md bg-[var(--bg-glass)] px-4 py-2 text-sm"
                                >
                                    Withdraw
                                </button>
                            </>
                        )}

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
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}

/* ================= HELPERS ================= */

function Action({
  icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`flex flex-col items-center gap-1 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
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

