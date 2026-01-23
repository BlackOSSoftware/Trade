"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Zap,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const isTradeRoute = pathname?.startsWith("/dashboard/trade");

  // ✅ FIXED BACK BUTTON - Always goes back first, dashboard as fallback
  const handleClick = () => {
  if (pathname?.startsWith("/dashboard/trade")) {
    router.back();
  } else {
    router.push("/dashboard");
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg-main)" }}
    >
      <div
        className="w-full max-w-lg text-center rounded-3xl p-10 relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
        }}
      >
        {/* Subtle glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, var(--primary-glow), transparent 60%)",
          }}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-8 relative z-10"
          style={{
            background: "var(--bg-glass)",
            border: "1px solid var(--border-soft)",
          }}
        >
          <Zap size={16} style={{ color: "var(--primary)" }} />
          <span
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: "var(--primary)" }}
          >
            Trading Panel
          </span>
        </div>

        {/* Icon */}
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl relative z-10"
          style={{
            background: "var(--bg-glass)",
            border: "1px solid var(--border-soft)",
          }}
        >
          <AlertTriangle
            size={32}
            style={{ color: "var(--warning)" }}
          />
        </div>

        {/* 404 */}
        <h1
          className="text-5xl font-black mb-2"
          style={{ color: "var(--text-main)" }}
        >
          404
        </h1>

        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--text-main)" }}
        >
          Trading Route Not Found
        </h2>

        <p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          The page you are trying to access does not exist or may have
          been removed from the trading system.
        </p>

        {/* ✅ PERFECTLY WORKING BACK BUTTON */}
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative z-10"
          style={{
            background: "var(--primary)",
            color: "var(--text-invert)",
            boxShadow: "0 10px 30px var(--primary-glow)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <ArrowLeft size={18} />
          {isTradeRoute
            ? " Back to Trading Panel"
            : " Return to Dashboard"}
        </button>

        {/* Dashboard direct link as secondary option */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-medium transition-all duration-200 hover:bg-[var(--bg-glass)]"
          style={{
            background: "transparent",
            color: "var(--text-strong)",
            border: "1px solid var(--border-soft)",
          }}
        >
          
        </button>
      </div>
    </div>
  );
}
