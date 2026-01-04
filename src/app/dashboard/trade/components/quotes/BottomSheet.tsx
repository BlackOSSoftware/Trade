// components/quotes/BottomSheet.tsx
"use client";

import { HexagonIcon, X } from "lucide-react";
import { useEffect } from "react";

export default function BottomSheet({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
}) {
  // ESC to close (optional)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0  animate-fadeIn"
      />

      {/* Sheet */}
      <div className="relative z-10 w-full bg-[var(--mt-dim)] shadow-xl animate-slideUp">
        {/* drag handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-[var(--border-soft)]" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
          <div className="text-sm font-medium truncate">{title}</div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] transition"
          >
            <X className="text-[var(--text-muted)]" size={18} />
          </button>
        </div>

        <div className="py-1">
          {["New Order", "Chart", "Properties", "Market Statistics"].map(
            (item) => (
              <button
                key={item}
                className="w-full px-5 py-4 text-left text-sm border-b border-[var(--border-soft)] hover:bg-[var(--bg-glass)] active:bg-[var(--bg-main)] transition"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
