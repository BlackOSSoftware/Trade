"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useAccountById } from "@/hooks/accounts/useAccountById";
import { useMyAccounts } from "@/hooks/useMyAccounts";
import AccountSwitcher from "../../components/AccountSwitcher";
import { useUserMe } from "@/hooks/useUser";
import { ChevronRight } from "lucide-react";
import GlobalLoader from "@/app/components/ui/GlobalLoader";

export default function TradePage() {
    const { accountId } = useParams<{ accountId: string }>();
    const [openSwitcher, setOpenSwitcher] = useState(false);

    const { data, isLoading } = useAccountById(accountId, true);
    const { data: accounts } = useMyAccounts();
    const { data: userData } = useUserMe();

    if (isLoading) {
        return <div className="p-6"><GlobalLoader /></div>;
    }

    if (!data) {
        return <div className="p-6 text-red-500">Account not found</div>;
    }

    return (
        <>
            {/* ===== MT5 STYLE ACCOUNT HEADER ===== */}
            <div
                onClick={() => setOpenSwitcher(true)}
                className="
    relative
    mx-3 mt-3
    rounded-xl
    bg-[var(--bg-glass)]
    px-4 py-4
    cursor-pointer
  "
            >
                {/* CENTER CONTENT */}
                <div className="flex flex-col items-center text-center gap-0.5 py-1">
                    {/* NAME */}
                    <div className="text-lg font-semibold text-[var(--text-inverted)]">
                        {userData?.name}
                    </div>

                    {/* BROKER + TYPE */}
                    <div className="text-sm text-[var(--text-main)] py-1">
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


                    {/* ACCOUNT NUMBER */}
                    <div className="text-sm text-[var(--text-main)] py-1">
                        Ac. No : {data.account_number.replace("AC", "")}
                    </div>

                    {/* BALANCE */}
                    <div className="text-sm text-[var(--text-main)] py-1">
                        Balance : {data.balance.toFixed(2)} {data.currency}
                    </div>
                </div>

                {/* RIGHT ARROW */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]">
                    <ChevronRight size={22} />
                </div>
            </div>

            {/* ACCOUNT SWITCHER */}
            {openSwitcher && accounts && (
                <AccountSwitcher
                    accounts={accounts}
                    currentAccountId={accountId}
                    onClose={() => setOpenSwitcher(false)}
                />
            )}
        </>
    );
}
