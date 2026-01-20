"use client";

import { ReactNode } from "react";
import { Menu } from "lucide-react";

type TopBarProps = {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  right?: ReactNode;
  onMenuClick?: () => void;
};
import { useTradeSidebar } from "./TradeSidebarContext";


export default function TradeTopBar({
  title,
  subtitle,
  showMenu = false,
  right,
  onMenuClick,
}: TopBarProps) {
  const hasSubtitle = Boolean(subtitle);
  
  const { open } = useTradeSidebar();
  return (
    <header className="fixed top-0 w-full z-50 h-14 flex items-center justify-between px-1 bg-[var(--bg-plan)]">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {showMenu && (
         <button onClick={open}>
  <Menu size={22} />
</button>
        )}

        {/* TITLE + SUBTITLE */}
        <div className="flex flex-col leading-tight">
          <span
            className={
              hasSubtitle
                ? "text-[14px] font-semibold"
                : "text-lg font-semibold"
            }
          >
            {title}
          </span>

          {hasSubtitle && (
            <span className="text-[11px]  font-medium">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
