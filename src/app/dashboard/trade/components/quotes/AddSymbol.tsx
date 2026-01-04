// components/quotes/AddSymbol.tsx
"use client";

import { useState } from "react";
import AddSymbolList from "./AddSymbolList";
import { X } from "lucide-react";

export default function AddSymbol({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [folder, setFolder] = useState<null | string>(null);

  if (!open) return null;

  if (folder) {
    return (
      <AddSymbolList
        folder={folder}
        onBack={() => setFolder(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-main)]">
      <div className="flex items-center px-4 py-3 border-b border-[var(--border-soft)]">
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-glass)] transition"
        >
          <X size={18} />
        </button>
        <div className="ml-3 font-semibold text-sm">Add symbol</div>
      </div>

      {["Forex", "Indexes", "Metals", "Nasdaq"].map((f) => (
        <button
          key={f}
          onClick={() => setFolder(f)}
          className="w-full px-4 py-4 border-b border-[var(--border-soft)] flex justify-between items-center hover:bg-[var(--bg-glass)] transition"
        >
          <span className="text-sm">{f}</span>
          <span className="text-[var(--text-muted)] text-lg">›</span>
        </button>
      ))}
    </div>
  );
}
