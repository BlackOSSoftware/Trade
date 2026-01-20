"use client";

import {
  BarChart3,
  List,
  Copy,
  Settings,
  Users,
  Bookmark,
} from "lucide-react";
import { useTradeDesktop } from "./TradeDesktopContext";

export default function TradeDesktopSidebar() {
  const { toggleQuotes } = useTradeDesktop();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 z-40 h-full w-[56px]
      bg-[var(--bg-main)] border-r border-white/10 flex-col items-center py-3 gap-4"
    >
      {/* LOGO */}
      <div className="w-8 h-8 mb-2">
        <img src="/logo/logo.png" className="w-full h-full object-contain" />
      </div>

      <IconBtn icon={BarChart3} />
      <IconBtn icon={Bookmark} onClick={toggleQuotes} active />
      <IconBtn icon={Copy} />
      <IconBtn icon={Users} />
      <IconBtn icon={Settings} />
    </aside>
  );
}

function IconBtn({
  icon: Icon,
  onClick,
  active,
}: {
  icon: any;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded
      ${active ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      <Icon size={20} className="text-white" />
    </button>
  );
}
