"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Toast } from "@/app/components/ui/Toast";
import TopBarSlot from "../../components/layout/TopBarSlot";
import TradeTopBar from "../../components/layout/TradeTopBar";
import LiveChart from "../../components/new-order/chart";
import { useTradeAccount } from "@/hooks/accounts/useAccountById";
import { useLiveTradeSocket } from "@/hooks/useLiveTradeSocket";
import GlobalLoader from "@/app/components/ui/GlobalLoader";
import { useModifyPosition } from "@/hooks/trade/useModifyPosition";

export default function ModifyPositionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { mutate, isPending } = useModifyPosition();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: tradeAccount } = useTradeAccount();
  const accountId = tradeAccount?.accountId;
  const { positions } = useLiveTradeSocket(accountId);

  const position = useMemo(
    () => positions.find((p) => p.positionId === id),
    [positions, id]
  );

  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [takeProfit, setTakeProfit] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  const STEP = 0.0001;

  useEffect(() => {
  if (!position || initialized) return;

  setStopLoss(position.stopLoss ?? null);
  setTakeProfit(position.takeProfit ?? null);

  setInitialized(true);
}, [position, initialized]);


  if (!position) {
    return (
      <div className="p-6">
        <GlobalLoader />
      </div>
    );
  }

  const currentPrice = Number(position.currentPrice);
  const isBuy = position.side === "BUY";

  const handleModify = () => {
    if (stopLoss === null || takeProfit === null) {
      return setToast({
        type: "error",
        message: "Please enter both SL and TP",
      });
    }

    if (stopLoss === takeProfit) {
      return setToast({
        type: "error",
        message: "SL and TP cannot be same",
      });
    }

    if (isBuy) {
      if (stopLoss >= currentPrice)
        return setToast({ type: "error", message: "SL must be below price" });

      if (takeProfit <= currentPrice)
        return setToast({ type: "error", message: "TP must be above price" });

      if (takeProfit <= stopLoss)
        return setToast({ type: "error", message: "TP must be greater than SL" });
    } else {
      if (stopLoss <= currentPrice)
        return setToast({ type: "error", message: "SL must be above price" });

      if (takeProfit >= currentPrice)
        return setToast({ type: "error", message: "TP must be below price" });

      if (takeProfit >= stopLoss)
        return setToast({ type: "error", message: "TP must be less than SL" });
    }

    mutate(
      {
        positionId: id,
        stopLoss,
        takeProfit,
      },
      {
        onSuccess: () => {
          setToast({
            type: "success",
            message: "Position modified successfully",
          });

          setTimeout(() => {
            router.push("/trade/trade");
          }, 1000);
        },
        onError: (err: any) => {
          setToast({
            type: "error",
            message: err?.message || "Modify failed",
          });
        },
      }
    );
  };

  return (
    <>
      <TopBarSlot>
        <TradeTopBar
          title="Modify Position"
          subtitle={`#${id.slice(0, 10)}`}
          showBack
        />
      </TopBarSlot>

      <div className="md:hidden flex flex-col bg-[var(--bg-plan)]">

        {/* SL / TP */}
        <div className="flex justify-around items-center px-6 pb-3 text-[var(--text-main)]">

          {/* SL */}
          <div className="flex items-center gap-3 border-b border-[var(--warning)] pb-1">

            <button
              className="text-[var(--mt-blue)] text-xl font-bold"
              onClick={() => {
                const base = stopLoss ?? currentPrice;
                setStopLoss(Number((base - STEP).toFixed(5)));
              }}
            >
              −
            </button>

            <input
              type="number"
              value={stopLoss ?? ""}
              onChange={(e) =>
                setStopLoss(e.target.value === "" ? null : Number(e.target.value))
              }
              step="0.00001"
              className="w-24 bg-transparent text-center text-lg outline-none"
              placeholder="SL"
            />

            <button
              className="text-[var(--mt-blue)] text-xl font-bold"
              onClick={() => {
                const base = stopLoss ?? currentPrice;
                setStopLoss(Number((base + STEP).toFixed(5)));
              }}
            >
              +
            </button>
          </div>

          {/* TP */}
          <div className="flex items-center gap-3 border-b border-[var(--success)] pb-1">

            <button
              className="text-[var(--mt-blue)] text-xl font-bold"
              onClick={() => {
                const base = takeProfit ?? currentPrice;
                setTakeProfit(Number((base - STEP).toFixed(5)));
              }}
            >
              −
            </button>

            <input
              type="number"
              value={takeProfit ?? ""}
              onChange={(e) =>
                setTakeProfit(e.target.value === "" ? null : Number(e.target.value))
              }
              step="0.00001"
              className="w-24 bg-transparent text-center text-lg outline-none"
              placeholder="TP"
            />

            <button
              className="text-[var(--mt-blue)] text-xl font-bold"
              onClick={() => {
                const base = takeProfit ?? currentPrice;
                setTakeProfit(Number((base + STEP).toFixed(5)));
              }}
            >
              +
            </button>
          </div>

        </div>

        <LiveChart
          bid={currentPrice}
          ask={currentPrice}
          sl={stopLoss ?? undefined}
          tp={takeProfit ?? undefined}
        />

        <div className="fixed bottom-16 w-full p-4 border-t border-[var(--border-soft)]">
          <button
            onClick={handleModify}
            disabled={isPending}
            className="w-full py-4 rounded-xl bg-[var(--mt-grey)] text-white font-semibold"
          >
            {isPending ? "Modifying..." : "MODIFY"}
          </button>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
