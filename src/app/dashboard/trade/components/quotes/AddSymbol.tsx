"use client";

import { useEffect, useState } from "react";
import { X, ArrowLeft, Home } from "lucide-react";
import { createPortal } from "react-dom";
import AddSymbolList from "./AddSymbolList";
import AddSymbolSearch from "./AddSymbolSearch";

export default function AddSymbol({
  open,
  onClose,
  token,
  accountId,
}: {
  open: boolean;
  onClose: () => void;
  token: string;
  accountId: string;
}) {
  const [folder, setFolder] = useState<null | string>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    folder ? (
      <AddSymbolList
        folder={folder}
        onBack={() => setFolder(null)}
        onClose={onClose}
      />
    ) : (
      <div className="fixed inset-0 z-[9999] bg-[var(--bg-main)] bg-[var(--bg-plan)] md:bg-[var(--bg-main)] pl-0 md:pl-14 w-auto md:w-99">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-soft)]">
          <button onClick={onClose}>
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 font-semibold text-sm">
            Add symbol
          </div>

         
        </div>

        {/* SEARCH + SEGMENTS */}
        <AddSymbolSearch token={token} accountId={accountId} />
        
      </div>
    ),
    document.body
  );
}
