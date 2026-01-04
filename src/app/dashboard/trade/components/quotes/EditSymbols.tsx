// components/quotes/EditSymbols.tsx
"use client";

import { useState } from "react";
import { Reorder, motion } from "framer-motion";
import { Sidebar } from "lucide-react";

const initialSymbols = [
  "EURUSD",
  "GBPUSD",
  "USDCHF",
  "USDJPY",
  "USDCNH",
  "USDRUB",
  "AUDUSD",
  "NZDUSD",
  "USDCAD",
  "USDSEK",
];

export default function EditSymbols({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [symbols, setSymbols] = useState(initialSymbols);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-main)] h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] transition"
          >
            ←
          </button>
          <div className="ml-3 font-semibold text-sm">Selected symbols</div>
        </div>
        <button
          onClick={() => setSymbols(initialSymbols)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)]"
        >
          Reset
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={symbols}
        onReorder={setSymbols}
        className="divide-y divide-[var(--border-soft)]"
      >
        {symbols.map((s) => (
          <Reorder.Item
            key={s}
            value={s}
            className="flex justify-between items-center px-4 py-4 bg-[var(--bg-main)]"
            whileDrag={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.25)" }}
          >
            <div className="text-sm">{s}</div>
            <button className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] cursor-grab active:cursor-grabbing">
              <Sidebar size={16} className="opacity-70" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
