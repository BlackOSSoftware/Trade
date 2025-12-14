"use client";

import { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl p-8">
      {children}
    </div>
  );
}
