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
    <div className="text-[var(--text-main)] mt-2">
      {showTopBar && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">
            Quotes
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSheet("add")}
              className="h-12 w-12 flex items-center justify-center text-[var(--text-main)]"
            >
              <Plus size={22} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => setSheet("edit")}
              className="h-12 w-12 flex items-center justify-center text-[var(--text-main)]"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18" />
                <path d="M12 3l9 9-9 9-9-9z" opacity="0" />
                <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
              </svg>
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
