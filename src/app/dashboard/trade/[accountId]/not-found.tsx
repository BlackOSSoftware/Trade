"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TradeAccountNotFound() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-screen px-6"
      style={{ background: "var(--bg-main)" }}
    >
      <div
        className="w-full max-w-md text-center p-8 rounded-2xl"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl"
          style={{
            background: "var(--bg-glass)",
            border: "1px solid var(--border-soft)",
          }}
        >
          <AlertTriangle
            size={28}
            style={{ color: "var(--warning)" }}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Trade Account Not Found
        </h2>

        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          The trading account you are trying to access does not exist
          or may have been removed.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium transition"
          style={{
            background: "var(--primary)",
            color: "var(--text-invert)",
          }}
        >
          <span className="flex items-center gap-2 justify-center">
            <ArrowLeft size={16} />
            Back to Dashboard
          </span>
        </button>
      </div>
    </div>
  );
}
