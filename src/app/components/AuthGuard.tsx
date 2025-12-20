"use client";

import { useUserMe } from "@/hooks/useUser";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useUserMe();

  // ⏳ first time only
  if (isLoading) {
    return <div className="h-screen bg-[var(--bg-main)]" />;
  }

  // ❌ not authenticated
  if (isError || !data) {
    window.location.replace("/login");
    return null;
  }

  // ✅ authenticated
  return <>{children}</>;
}
