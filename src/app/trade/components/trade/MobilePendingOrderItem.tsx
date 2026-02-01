"use client";

import { useLongPress } from "../../trade/page";

type MobilePendingOrderItemProps = {
    order: any;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    onLongPress: (order: any) => void;
};

export default function MobilePendingOrderItem({
    order,
    expandedId,
    setExpandedId,
    onLongPress,
}: MobilePendingOrderItemProps) {

    const expanded = expandedId === order.orderId;

    const longPress = useLongPress(() => {
        onLongPress(order);
    });

    return (
        <div
            {...longPress}
            onContextMenu={(e) => e.preventDefault()}
            className="border-b border-[color:var(--text-muted)]/20 bg-[var(--bg-plan)]"
        >
            <button
                onClick={() =>
                    setExpandedId(expanded ? null : order.orderId)
                }
                className="w-full flex justify-between items-center pt-[10px] pb-[8px]"
            >
                <div className="text-left">
                    <div className="font-semibold">
                        {order.symbol},{" "}
                        <span
                            className={
                                order.side === "BUY"
                                    ? "text-[var(--mt-blue)]"
                                    : "text-[var(--mt-red)]"
                            }
                        >
                            {order.side} {order.volume}
                        </span>
                    </div>

                    <div className="mt-price-line">
                        {order.price} → {order.currentPrice ?? "-"}
                    </div>
                </div>

                <div className="font-semibold mt-price-line">
                    {order.status}
                </div>
            </button>

            {expanded && (
                <div className="px-[2px] pb-[8px] text-[11px] space-y-[3px] grid grid-cols-2">
                    <div className="opacity-70 mr-2">
                        #{order.orderId.slice(0, 10)}
                    </div>

                    <div className="flex justify-between mr-2">
                        <span>Created:</span>
                        <span>
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between mr-2">
                        <span>S / L:</span>
                        <span>{order.stopLoss ?? "-"}</span>
                    </div>

                    <div className="flex justify-between mr-2">
                        <span>T / P:</span>
                        <span>{order.takeProfit ?? "-"}</span>
                    </div>

                    <div className="flex justify-between mr-2">
                        <span>Type:</span>
                        <span>{order.orderType}</span>
                    </div>

                    <div className="flex justify-between mr-2">
                        <span>Status:</span>
                        <span>{order.status}</span>
                    </div>
                </div>
            )}
        </div>
    );
}