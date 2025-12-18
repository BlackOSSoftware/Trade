"use client";

import { CheckCircle } from "lucide-react";

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-[200]
      animate-slideIn rounded-xl
      bg-[var(--bg-card)] border border-[var(--border-soft)]
      shadow-2xl px-4 py-3 flex items-center gap-2">
      <CheckCircle size={18} className="text-[var(--success)]" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
