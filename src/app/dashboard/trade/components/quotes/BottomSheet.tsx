// components/quotes/BottomSheet.tsx
"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
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
const isDesktop = useMediaQuery("(min-width: 768px)");
  if (!open) return null;

return (
  <div
  className={`
    ${isDesktop ? "absolute" : "fixed"}
    inset-0 flex items-end
  `}
>
    {/* Backdrop */}
    <div
      onClick={onClose}
      className="absolute inset-0 animate-fadeIn"
      style={{ background: "rgba(0,0,0,0.45)" }}
    />

    {/* Sheet */}
    <div
      className="relative z-10 w-full animate-slideUp"
      style={{
        background: "var(--bg-card)",
        borderTopLeftRadius: "18px",
        borderTopRightRadius: "18px",
        border: "1px solid var(--border-soft)",
        maxHeight: "75vh",
      }}
    >
      {/* Drag Handle */}
      <div className="flex justify-center pt-3">
        <div
          className="h-1.5 w-12 rounded-full"
          style={{ background: "var(--border-soft)" }}
        />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="text-sm font-medium truncate">
          {title}
        </div>

        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] transition"
        >
          ✕
        </button>
      </div>

      {/* Actions */}
      <div className="overflow-y-auto">
        {["New Order", "Chart", "Properties", "Market Statistics"].map(
          (item) => (
            <button
              key={item}
              className="w-full px-6 py-4 text-left text-sm transition"
              style={{
                borderBottom: "1px solid var(--border-soft)",
              }}
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
