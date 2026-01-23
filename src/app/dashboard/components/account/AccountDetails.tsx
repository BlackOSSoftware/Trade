"use client";

import {
  ShieldCheck,
  Layers,
  Percent,
  DollarSign,
  Activity,
  Calendar,
} from "lucide-react";

export default function AccountDetails({ data }: { data: any }) {
  return (
    <div className="mt-4 space-y-4">
      {/* ================= SUMMARY STRIP ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[var(--bg-glass)] p-4">
        <div>
          <div className="text-xs text-[var(--text-muted)]">
            Account status
          </div>
          <div
            className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
              data.status === "active"
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-600"
            }`}
          >
            <ShieldCheck size={14} />
            {data.status.toUpperCase()}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--text-muted)]">
            Account type
          </div>
          <div className="font-medium capitalize">
            {data.account_type}
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-col-3 gap-4 text-sm">
        <InfoCard
          icon={<DollarSign />}
          label="Balance"
          value={`${data.balance} ${data.currency}`}
        />

        <InfoCard
          icon={<Activity />}
          label="Equity"
          value={`${data.equity} ${data.currency}`}
        />

        <InfoCard
          icon={<Layers />}
          label="Leverage"
          value={`1:${data.leverage}`}
        />

        <InfoCard
          icon={<Percent />}
          label="Spread"
          value={`${data.spread_pips} pips (${data.spread_type})`}
        />

        <InfoCard
          icon={<DollarSign />}
          label="Commission / lot"
          value={
            data.commission_per_lot > 0
              ? `${data.commission_per_lot} ${data.currency}`
              : "No commission"
          }
        />

        <InfoCard
          icon={<ShieldCheck />}
          label="Swap"
          value={data.swap_enabled ? "Enabled" : "Disabled"}
        />
      </div>

      {/* ================= FOOTER META ================= */}
      <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-glass)] p-4">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Calendar size={14} />
          Created on
        </div>
        <div className="mt-1 text-sm font-medium">
          {new Date(data.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE CARD ================= */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-white/60 dark:bg-black/20 p-3 sm:p-4 backdrop-blur min-w-0">
      <div className="flex items-start gap-3">
        {/* ICON */}
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-glass)] text-[var(--primary)]">
          {icon}
        </div>

        {/* TEXT */}
        <div className="flex flex-col min-w-0">
          <div className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-tight break-words">
            {label}
          </div>

          <div className="mt-0.5 text-[13px] sm:text-sm font-semibold leading-tight break-words">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

