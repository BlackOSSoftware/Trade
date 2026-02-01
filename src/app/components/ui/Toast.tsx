"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export function Toast({ message, type = "success" }: ToastProps) {
  const isSuccess = type === "success";
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-5 right-5 z-[999]
        animate-slideUp
        rounded-xl
        border
        shadow-2xl
        px-4 py-3
        flex items-center gap-2
        min-w-[240px]
        max-w-[90vw]
        bg-[var(--bg-card)]
      "
      style={{
        borderColor: isSuccess
          ? "var(--success)"
          : "var(--error)",
      }}
    >
      {isSuccess ? (
        <CheckCircle size={18} className="text-[var(--success)]" />
      ) : (
        <XCircle size={18} className="text-[var(--error)]" />
      )}

      <span
        className={`text-sm ${
          isSuccess
            ? "text-[var(--success)]"
            : "text-[var(--error)]"
        }`}
      >
        {message}
      </span>
    </div>
  );
}
