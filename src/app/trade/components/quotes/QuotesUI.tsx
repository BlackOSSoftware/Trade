"use client";

import { useState } from "react";
import { Plus, Edit } from "lucide-react";

import QuotesList from "./QuotesList";
import BottomSheet from "./BottomSheet";
import EditSymbols from "./EditSymbols";
import AddSymbol from "./AddSymbol";

type Props = {
  showTopBar?: boolean;
};

export default function QuotesUI({ showTopBar = false }: Props) {
  const [sheet, setSheet] =
    useState<null | "actions" | "edit" | "add">(null);
  const [selected, setSelected] =
    useState<string | null>(null);

  return (
    <div className="text-[var(--text-main)] mt-4">
      {showTopBar && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">
            Quotes
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSheet("add")}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-sm"
            >
              <Plus size={16} />
            </button>

            <button
              onClick={() => setSheet("edit")}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)]"
            >
              <Edit size={16} />
            </button>
          </div>
        </div>
      )}

      <QuotesList
        onSelect={(symbol) => {
          setSelected(symbol);
          setSheet("actions");
        }}
      />

      <BottomSheet
        open={sheet === "actions"}
        onClose={() => setSheet(null)}
        title={selected ?? ""}
      />

      <EditSymbols
        open={sheet === "edit"}
        onClose={() => setSheet(null)}
      />

      <AddSymbol
        open={sheet === "add"}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
