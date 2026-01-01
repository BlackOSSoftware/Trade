"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import { listenForegroundMessages } from "@/lib/foregroundMessage";
import { useUserMe } from "@/hooks/useUser";
import GlobalLoader from "../components/ui/GlobalLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { data, isLoading, isError, error } = useUserMe();

  useEffect(() => {
    listenForegroundMessages();
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* ================= AUTH ================= */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm">
        <GlobalLoader />
      </div>
    );
  }

  if (isError) {
    const status = (error as any)?.response?.status;
    if (status === 401) {
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; path=/; max-age=0";
      router.replace("/");
      return null;
    }
  }

  /* ================= LAYOUT ================= */
  return (
    <div className="relative h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* Background blobs (no scroll impact) */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />

      <div className="flex h-full">
        {/* SIDEBAR (NO SCROLL) */}
        <Sidebar
          open={sidebarOpen}
          collapsed={collapsed}
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />

        {/* MAIN COLUMN */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* TOPBAR (NO SCROLL) */}
          <div className="shrink-0">
            <Topbar onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* ✅ ONLY THIS SCROLLS */}
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
