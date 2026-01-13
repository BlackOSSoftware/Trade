"use client";

import { useState } from "react";
import { Plus, Edit } from "lucide-react";

import QuotesList from "../../components/quotes/QuotesList";
import BottomSheet from "../../components/quotes/BottomSheet";
import EditSymbols from "../../components/quotes/EditSymbols";
import AddSymbol from "../../components/quotes/AddSymbol";

import TradeTopBar from "../../components/layout/TradeTopBar";
import TopBarSlot from "../../components/layout/TopBarSlot";

export default function QuotesPage() {
  const [sheet, setSheet] = useState<null | "actions" | "edit" | "add">(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {/* 🔝 TOP BAR (same UI as before) */}
      <TopBarSlot>
        <TradeTopBar
          title="Quotes"
          showMenu
          right={
            <div className="flex gap-2">
              <button
                onClick={() => setSheet("add")}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-sm hover:opacity-90 active:scale-95 transition"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={() => setSheet("edit")}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--text-main)] shadow-sm hover:bg-[var(--bg-glass)] active:scale-95 transition"
              >
                <Edit size={18} />
              </button>
            </div>
          }
        />
      </TopBarSlot>

      {/* PAGE CONTENT */}
      <div className="text-[var(--text-main)]">
        <QuotesList
          onSelect={(symbol) => {
            setSelected(symbol);
            setSheet("actions");
          }}
        />

        <BottomSheet
          open={sheet === "actions"}
          onClose={() => setSheet(null)}
          title={selected ? `${selected} · Euro vs US Dollar` : ""}
        />

        <EditSymbols open={sheet === "edit"} onClose={() => setSheet(null)} />
        <AddSymbol open={sheet === "add"} onClose={() => setSheet(null)} />
      </div>
    </>
  );
}
