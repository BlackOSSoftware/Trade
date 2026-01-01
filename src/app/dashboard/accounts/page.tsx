"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyAccounts } from "@/hooks/useMyAccounts";
import AccountRow from "../components/account/AccountRow";

export default function MyAccountsPage() {
  const { data, isLoading } = useMyAccounts();
  const [tab, setTab] = useState<"live" | "demo">("live");
  const router = useRouter();

  if (isLoading) {
    return <div className="p-6">Loading accounts…</div>;
  }

  const accounts =
    data?.filter((a: any) => a.account_type === tab) ?? [];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-24 md:pb-6">
      {/* ================= HEADER ================= */}
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">
            My accounts
          </h1>

          {/* Desktop CTA */}
          <button
            onClick={() =>
              router.push("/dashboard/accounts/open")
            }
            className="hidden md:flex items-center gap-2 rounded-md bg-[var(--bg-glass)] px-4 py-2 text-sm"
          >
            <Plus size={16} />
            Open account
          </button>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-6 overflow-x-auto border-b border-[var(--border-soft)]">
          {["live", "demo"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`pb-3 text-sm font-medium whitespace-nowrap ${
                tab === t
                  ? "border-b-2 border-[var(--primary)] text-[var(--text-main)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {t === "live" ? "Real accounts" : "Demo accounts"}
            </button>
          ))}
        </div>

        {/* ================= TOOLBAR (DESKTOP ONLY) ================= */}
        <div className="hidden md:flex items-center justify-end">
          

         
        </div>
      </div>

      {/* ================= ACCOUNTS ================= */}
      <div className="px-4 md:px-6 space-y-4">
        {accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border-soft)] p-6 text-center text-sm text-[var(--text-muted)]">
            No {tab === "live" ? "real" : "demo"} accounts found.
          </div>
        ) : (
          accounts.map((acc: any) => (
            <AccountRow key={acc._id} account={acc} />
          ))
        )}
      </div>

      {/* ================= MOBILE STICKY CTA ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border-soft)] bg-[var(--bg-main)] p-4 md:hidden">
        <button
          onClick={() =>
            router.push("/dashboard/accounts/open")
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] py-3 font-medium text-[var(--foreground)]"
        >
          <Plus size={18} />
          Open account
        </button>
      </div>
    </div>
  );
}
