"use client";

import { useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";

import QuotesList from "../../components/quotes/QuotesList";
import BottomSheet from "../../components/quotes/BottomSheet";
import EditSymbols from "../../components/quotes/EditSymbols";
import AddSymbol from "../../components/quotes/AddSymbol";

import TradeTopBar from "../../components/layout/TradeTopBar";
import TopBarSlot from "../../components/layout/TopBarSlot";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function QuotesPage() {
  const [sheet, setSheet] = useState<null | "actions" | "edit" | "add">(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { accountId } = useParams<{ accountId: string }>();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  useEffect(() => {
    if (mounted && isDesktop) {
      router.replace(`/dashboard/trade/${accountId}`);
    }
  }, [mounted, isDesktop, accountId, router]);

  if (!mounted) return null;
  if (!accessToken || !accountId) return null;

  return (
    <>
      <TopBarSlot>
        <TradeTopBar
          title="Quotes"
          showMenu
          right={
            <div className="flex gap-2">
              <button
                onClick={() => setSheet("add")}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--primary)] text-white"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={() => setSheet("edit")}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-[var(--bg-card)] border"
              >
                <Edit size={18} />
              </button>
            </div>
          }
        />
      </TopBarSlot>

      <div className="text-[var(--text-main)]">
        <QuotesList
          token={accessToken}
          accountId={accountId}
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

        <AddSymbol
          open={sheet === "add"}
          onClose={() => setSheet(null)}
          token={accessToken}
          accountId={accountId}
        />
      </div>
    </>
  );
}

