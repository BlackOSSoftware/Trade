"use client";

import { CheckCircle, TriangleDashed } from "lucide-react";

export default function AccountPlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: any;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full transition-all duration-300 ${
        selected ? "scale-[1.02]" : ""
      }`}
    >
      {/* ================= MOBILE : IMAGE STYLE CARD ================= */}
      <div
        className={`md:hidden rounded-2xl bg-[var(--bg-card)] p-6 shadow-lg border ${
          selected
            ? "border-[var(--primary)]"
            : "border-[var(--border-soft)]"
        }`}
      >
        {/* ICON / IMAGE PLACEHOLDER */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-xl bg-[var(--bg-glass)] flex items-center justify-center">
            <TriangleDashed />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="mt-5 text-center text-2xl font-semibold">
          {plan.name}
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          {plan.guidance}
        </p>

        {/* DETAILS */}
        <div className="mt-6 space-y-4 text-sm">
          <Row label="Min deposit" value={`${plan.minDeposit} USD`} />
          <Row label="Spread" value={`From ${plan.spreadPips} pips`} />
          <Row
            label="Max leverage"
            value={`1:${plan.max_leverage}`}
          />
          <Row
            label="Commission"
            value={
              plan.commission_per_lot > 0
                ? `${plan.commission_per_lot} USD / lot`
                : "No commission"
            }
          />
        </div>

        {/* SELECT INDICATOR */}
        {selected && (
          <div className="mt-6 flex justify-center">
            <CheckCircle
              size={22}
              className="text-[var(--primary)]"
            />
          </div>
        )}
      </div>

      {/* ================= DESKTOP : SAME AS BEFORE ================= */}
      <div
        className={`hidden md:flex items-start justify-between gap-4 rounded-xl border p-5 ${
          selected
            ? "border-[var(--primary)] bg-[var(--bg-glass)]"
            : "border-[var(--border-soft)] hover:bg-[var(--bg-glass)]"
        }`}
      >
        {/* LEFT */}
        <div className="flex gap-4">
          <div
            className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
              selected
                ? "border-[var(--primary)]"
                : "border"
            }`}
          >
            {selected && (
              <CheckCircle
                size={16}
                className="text-[var(--primary)]"
              />
            )}
          </div>

          <div>
            <h3 className="font-medium">{plan.name}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {plan.guidance}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-4 gap-8 text-sm text-right">
          <Meta label="Min deposit" value={`${plan.minDeposit} USD`} />
          <Meta label="Min spread" value={`${plan.spreadPips} pips`} />
          <Meta
            label="Max leverage"
            value={`1:${plan.max_leverage}`}
          />
          <Meta
            label="Commission"
            value={
              plan.commission_per_lot > 0
                ? `${plan.commission_per_lot} USD / lot`
                : "No commission"
            }
          />
        </div>
      </div>
    </button>
  );
}

/* ================= HELPERS ================= */

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-[var(--border-soft)] pb-2">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs text-[var(--text-muted)]">
        {label}
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
