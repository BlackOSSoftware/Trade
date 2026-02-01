'use client';
import { useEffect, useRef, useState } from "react";

export default function LiveChart({
    bid,
    ask,
    sl,
    tp,
    pendingPrice
}: {
    bid: number;
    ask: number;
    sl?: number;
    tp?: number;
    pendingPrice?: number;
}) {

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [bidTicks, setBidTicks] = useState<number[]>([]);
    const [askTicks, setAskTicks] = useState<number[]>([]);
    const [width, setWidth] = useState(400); // safe default

    const HEIGHT = 280;
    const STEP = 6;
    const MAX_POINTS = 400;
    const ANCHOR_PERCENT = 0.65;
    const PRICE_SCALE_WIDTH = 70;
    const GRID_COUNT = 9; // 8–10 levels

    // measure width once mounted
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const resize = () => {
            const w = el.getBoundingClientRect().width - PRICE_SCALE_WIDTH;
            if (w > 0) setWidth(w);
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    // push new ticks
    useEffect(() => {
        if (!isFinite(bid) || !isFinite(ask)) return;

        setBidTicks((p) => [...p.slice(-MAX_POINTS + 1), bid]);
        setAskTicks((p) => [...p.slice(-MAX_POINTS + 1), ask]);
    }, [bid, ask]);

    const len = Math.min(bidTicks.length, askTicks.length);
    if (len < 2) {
        return (
            <div
                ref={containerRef}
                className="relative bg-[var(--bg-plan)]"
                style={{ height: HEIGHT }}
            />
        );
    }

    const bids = bidTicks.slice(-len);
    const asks = askTicks.slice(-len);

    const all = [...bids, ...asks];
    const rawMax = Math.max(...all);
    const rawMin = Math.min(...all);

    // 🔥 Smooth auto vertical scaling
    const padding = (rawMax - rawMin) * 0.25 || 0.0001;
    const max = rawMax + padding;
    const min = rawMin - padding;
    const range = max - min;

    const scaleY = (p: number) =>
        ((max - p) / range) * HEIGHT;

    const totalWidth = (len - 1) * STEP;
    const anchorX = width * ANCHOR_PERCENT;
    const offset = totalWidth > anchorX ? totalWidth - anchorX : 0;

    const buildPath = (data: number[]) =>
        data
            .map((p, i) => {
                const x = i * STEP - offset;
                const y = scaleY(p);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

    const bidPath = buildPath(bids);
    const askPath = buildPath(asks);

    const currentBid = bids[len - 1];
    const currentAsk = asks[len - 1];

    const bidY = scaleY(currentBid);
    const askY = scaleY(currentAsk);
    const slY = sl !== undefined ? scaleY(sl) : null;
    const tpY = tp !== undefined ? scaleY(tp) : null;
    const pendingY = pendingPrice !== undefined ? scaleY(pendingPrice) : null;

    // grid levels
    const levels = Array.from({ length: GRID_COUNT }, (_, i) => {
        const price = max - (range / (GRID_COUNT - 1)) * i;
        const y = (i / (GRID_COUNT - 1)) * HEIGHT;
        return { price, y };
    });

    return (
        <div
            ref={containerRef}
            className="relative bg-[var(--bg-plan)] md:bg-[var(--bg-card)] overflow-hidden"
            style={{ height: HEIGHT }}
        >
            {/* GRID BACKGROUND */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {levels.map((l, i) => (
                    <line
                        key={i}
                        x1="0"
                        x2={width}
                        y1={l.y}
                        y2={l.y}
                        stroke="rgb(112, 111, 111)"
                        strokeDasharray="4 6"
                    />
                ))}
            </svg>

            {/* CHART AREA */}
            <div
                className="absolute left-0 top-0 bottom-0 overflow-hidden"
                style={{ right: PRICE_SCALE_WIDTH }}
            >
                <svg width={width} height={HEIGHT}>

                    {/* PRICE LINES */}
                    <path d={askPath} stroke="#ff4d4d" strokeWidth="2" fill="none" />
                    <path d={bidPath} stroke="#4aa3ff" strokeWidth="2" fill="none" />

                    {/* SL */}
                    {slY !== null && (
                        <>
                            <line
                                x1={0}
                                x2={width}
                                y1={slY}
                                y2={slY}
                                stroke="var(--warning)"
                                strokeWidth="1.5"
                            />
                            <text
                                x={4}
                                y={slY - 6}
                                fill="var(--warning)"
                                fontSize="11"
                                fontWeight="600"
                            >
                                SL
                            </text>
                            <text
                                x={width - 4}
                                y={slY - 6}
                                fill="var(--warning)"
                                fontSize="11"
                                fontWeight="600"
                                textAnchor="end"
                            >
                                {sl?.toFixed(3)}
                            </text>
                        </>
                    )}

                    {/* TP */}
                    {tpY !== null && (
                        <>
                            <line
                                x1={0}
                                x2={width}
                                y1={tpY}
                                y2={tpY}
                                stroke="var(--success)"
                                strokeWidth="1.5"
                            />
                            <text
                                x={4}
                                y={tpY - 6}
                                fill="var(--success)"
                                fontSize="11"
                                fontWeight="600"
                            >
                                TP
                            </text>
                            <text
                                x={width - 4}
                                y={tpY - 6}
                                fill="var(--success)"
                                fontSize="11"
                                fontWeight="600"
                                textAnchor="end"
                            >
                                {tp?.toFixed(3)}
                            </text>
                        </>
                    )}

                    {/* PENDING */}
                    {pendingY !== null && (
                        <>
                            <line
                                x1={0}
                                x2={width}
                                y1={pendingY}
                                y2={pendingY}
                                stroke="#9ca3af"
                                strokeWidth="1.5"
                                strokeDasharray="6 4"
                            />
                            <text
                                x={4}
                                y={pendingY - 6}
                                fill="#9ca3af"
                                fontSize="11"
                                fontWeight="600"
                            >
                                PRICE
                            </text>
                            <text
                                x={width - 4}
                                y={pendingY - 6}
                                fill="#9ca3af"
                                fontSize="11"
                                fontWeight="600"
                                textAnchor="end"
                            >
                                {pendingPrice?.toFixed(3)}
                            </text>
                        </>
                    )}

                </svg>
            </div>


            {/* PRICE SCALE */}
            <div
                className="absolute right-0 top-0 h-full flex flex-col justify-between pr-2 text-xs text-gray-400"
                style={{ width: PRICE_SCALE_WIDTH }}
            >
                {levels.map((l, i) => (
                    <div key={i}>{l.price.toFixed(3)}</div>
                ))}
            </div>

            {/* LIVE PRICE TAGS */}
            <div
                className="absolute right-0 mr-2 pr-1 py-1 text-xs rounded-l"
                style={{
                    top: askY - 10,
                    background: "var(--mt-red)",
                    color: "white",
                    width: PRICE_SCALE_WIDTH,
                    textAlign: "right",
                }}
            >
                {currentAsk.toFixed(3)}
            </div>

            <div
                className="absolute right-0 mr-2 pr-1 py-1 text-xs rounded-l"
                style={{
                    top: bidY - 10,
                    background: "#4aa3ff",
                    color: "white",
                    width: PRICE_SCALE_WIDTH,
                    textAlign: "right",
                }}
            >
                {currentBid.toFixed(3)}
            </div>
            {slY !== null && (
                <div
                    className="absolute right-0 mr-2 pr-1 py-1 text-xs rounded-l"
                    style={{
                        top: slY - 10,
                        background: "var(--warning)",
                        color: "white",
                        width: PRICE_SCALE_WIDTH,
                        textAlign: "right",
                    }}
                >
                    {sl?.toFixed(3)}
                </div>
            )}
            {tpY !== null && (
                <div
                    className="absolute right-0 mr-2 pr-1 py-1 text-xs rounded-l"
                    style={{
                        top: tpY - 10,
                        background: "var(--success)",
                        color: "white",
                        width: PRICE_SCALE_WIDTH,
                        textAlign: "right",
                    }}
                >
                    {tp?.toFixed(3)}
                </div>
            )}
            {pendingY !== null && (
                <div
                    className="absolute right-0 mr-2 pr-1 py-1 text-xs rounded-l"
                    style={{
                        top: pendingY - 10,
                        background: "#6b7280",
                        color: "white",
                        width: PRICE_SCALE_WIDTH,
                        textAlign: "right",
                    }}
                >
                    {pendingPrice?.toFixed(3)}
                </div>
            )}

        </div>
    );
}