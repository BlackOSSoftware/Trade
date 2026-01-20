"use client";

import { useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";

import QuotesList from "./QuotesList";
import BottomSheet from "./BottomSheet";
import EditSymbols from "./EditSymbols";
import AddSymbol from "./AddSymbol";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useParams } from "next/navigation";

type Props = {
  showTopBar?: boolean;
};

export default function QuotesUI({ showTopBar = false }: Props) {
  const [sheet, setSheet] = useState<null | "actions" | "edit" | "add">(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const { accountId } = useParams<{ accountId: string }>();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token)
    if (token) setAccessToken(token);
  }, []);

  if (!accessToken || !accountId) return null;
  return (
    <div className="text-[var(--text-main)]">
      {/* DESKTOP PANEL HEADER (NO GLOBAL TOPBAR) */}
      {showTopBar && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Quotes</div>

          <div className="flex gap-2">
            <button
              onClick={() => setSheet("add")}
              className="h-8 w-8 flex items-center justify-center rounded-full
              bg-[var(--primary)] text-white shadow-sm"
            >
              <Plus size={16} />
            </button>

            <button
              onClick={() => setSheet("edit")}
              className="h-8 w-8 flex items-center justify-center rounded-full
              bg-[var(--bg-card)] border border-[var(--border-soft)]"
            >
              <Edit size={16} />
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <QuotesList
        token={accessToken}
        accountId={accountId}
        onSelect={(symbol) => {
          setSelected(symbol);
          setSheet("actions");
        }}
      />

      {/* ACTIONS */}
      <BottomSheet
        open={sheet === "actions"}
        onClose={() => setSheet(null)}
        title={selected ? `${selected} · Euro vs US Dollar` : ""}
      />

      <EditSymbols open={sheet === "edit"} onClose={() => setSheet(null)} />
      <AddSymbol
        open={sheet === "add"}
        onClose={() => setSheet(null)}
        token={accessToken}
        accountId={accountId}
      />

    </div>
  );
}
