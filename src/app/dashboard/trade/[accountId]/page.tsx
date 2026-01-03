"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccountById } from "@/hooks/accounts/useAccountById";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function TradePage() {
  const { accountId } = useParams<{ accountId: string }>();
  const router = useRouter();

  // 👇 mobile detect
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { data, isLoading } = useAccountById(accountId, true);

  // ✅ ONLY mobile redirect
  useEffect(() => {
    if (isMobile) {
      router.replace(`/dashboard/trade/${accountId}/quotes`);
    }
  }, [isMobile, accountId, router]);

  // loader
  if (isLoading) {
    return (
      <div className="p-6">
        <GlobalLoader />
      </div>
    );
  }

  // while redirecting on mobile → render nothing
  if (isMobile) return null;

  // desktop UI stays SAME
  if (!data) {
    return <div className="p-6 text-red-500">Account not found</div>;
  }

  return (
    <div className="container-pad space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Trading Panel</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Account #{data.account_number.replace("AC", "")}
          </p>
        </div>

        <span className="rounded bg-[var(--bg-glass)] px-3 py-1 text-sm">
          {data.account_type.toUpperCase()}
        </span>
      </div>

      {/* ACCOUNT SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          label="Balance"
          value={`${data.balance.toFixed(2)} ${data.currency}`}
        />
        <InfoCard label="Plan" value={data.plan_name} />
        <InfoCard label="Account Type" value={data.account_type} />
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--bg-glass)] p-4">
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
