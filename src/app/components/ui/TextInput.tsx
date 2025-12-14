"use client";

import { LucideIcon } from "lucide-react";

type PremiumInputProps = {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (v: string) => void;
  icon?: LucideIcon;
};

export function PremiumInput({
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
}: PremiumInputProps) {
  const filled = value.length > 0;

  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-3 top-4 text-[var(--text-muted)]"
        />
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          peer w-full rounded-lg border border-[var(--border-glass)]
          bg-[var(--bg-card)] px-3 ${Icon ? "pl-9" : "pl-3"}
          pt-5 pb-2 text-sm outline-none transition
          focus:border-[var(--primary)]
          focus:ring-1 focus:ring-[var(--primary)]
        `}
      />

      <label
        className={`
          absolute ${Icon ? "left-9" : "left-3"}
          bg-[var(--bg-card)] px-1 text-[var(--text-muted)]
          transition-all pointer-events-none
          ${filled ? "-top-2 text-xs" : "top-3 text-sm"}
          peer-focus:-top-2 peer-focus:text-xs
          peer-focus:text-[var(--primary)]
        `}
      >
        {label}
      </label>
    </div>
  );
}
