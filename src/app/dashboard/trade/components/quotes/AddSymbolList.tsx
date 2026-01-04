// components/quotes/AddSymbolList.tsx
"use client";

import { Plus, X } from "lucide-react";


export default function AddSymbolList({
  folder,
  onBack,
  onClose,
}: {
  folder: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const items = ["AUDCAD", "AUDCHF", "AUDJPY", "AUDNZD", "AUDUSD"];

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-main)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)]">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] transition"
          >
            ←
          </button>
          <div className="ml-3 font-semibold text-sm">{folder}</div>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] transition"
        >
          <X size={18} />
        </button>
      </div>

      {items.map((s, i) => (
        <div
          key={s}
          className="px-4 py-4 border-b border-[var(--border-soft)] flex justify-between items-center"
        >
          <div className="text-sm">{s}</div>
          <button
            className={`h-7 w-7 flex items-center justify-center rounded-full text-xs font-semibold transition
              ${
                i < 2
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border-soft)] text-[var(--text-main)] bg-[var(--bg-card)]"
              }`}
          >
            {i < 2 ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>
      ))}
    </div>
  );
}
