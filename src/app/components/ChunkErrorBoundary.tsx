"use client";

import { useEffect } from "react";

export default function ChunkErrorBoundary() {
  useEffect(() => {
    const handleError = (event: any) => {
      if (event?.message?.includes("Failed to load chunk")) {
        window.location.reload();
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return null;
}
