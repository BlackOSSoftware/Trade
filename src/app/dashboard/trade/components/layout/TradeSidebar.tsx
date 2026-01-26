"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  BarChart3,
  Newspaper,
  Mail,
  BookOpen,
  Settings,
  Calendar,
  Users,
  Bot,
  HelpCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { useTradeSidebar } from "./TradeSidebarContext";

type Props = {
  userName: string;
  accountType: "demo" | "live";
  accountNumber: string;
};

export default function TradeSidebar({
  userName,
  accountType,
  accountNumber,
}: Props) {
  const { isOpen, close } = useTradeSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const { accountId } = useParams<{ accountId: string }>();

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, close]);

  const go = (path: string) => {
    router.push(path);
    close();
  };

  const base = `/dashboard/trade/${accountId}`;

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.55)" }}
      />

      {/* SIDEBAR */}
      <aside
        ref={ref}
        className={`fixed left-0 top-0 z-50 h-full w-[85%] max-w-[360px]
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "var(--bg-plan)",
          color: "var(--text-main)",
          borderRight: "1px solid var(--border-soft)",
          boxShadow: "0 0 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* PROFILE HEADER */}
        <div
          className="relative px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid var(--border-soft)" }}
        >
          {accountType === "demo" && (
            <div className="absolute right-0 top-0 w-20 h-20 overflow-hidden">
              <div
                className="absolute right-[-35px] top-[18px] rotate-45
                text-[11px] font-semibold px-10 py-[3px]"
                style={{
                  background: "var(--success)",
                  color: "var(--text-invert)",
                }}
              >
                DEMO
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-glass)" }}
            >
              <img
                src="/logo/logo.png"
                alt="Platform Logo"
                className="w-6 h-6 object-contain"
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">
                {userName}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {accountNumber} · ALS Traders
              </span>
            </div>
          </div>

          <button
            className="mt-3 text-[13px] font-medium transition"
            style={{ color: "var(--primary)" }}
            onClick={() => go("/accounts")}
          >
            Manage accounts
          </button>
        </div>

        {/* MENU */}
        <nav className="py-3 flex flex-col gap-1">
          <Item
            icon={BarChart3}
            label="Trade"
            active={pathname?.includes("/trade")}
            onClick={() => go(`${base}/trade`)}
          />
          <Item
            icon={Newspaper}
            label="News"
            active={pathname === "/news"}
            onClick={() => go("/news")}
          />
          <Item
            icon={Mail}
            label="Mailbox"
            badge={<Badge color="red">8</Badge>}
            active={pathname === "/mail"}
            onClick={() => go("/mail")}
          />
          <Item
            icon={BookOpen}
            label="Journal"
            active={pathname === "/journal"}
            onClick={() => go("/journal")}
          />
          <Item
            icon={Settings}
            label="Settings"
            active={pathname === "/settings"}
            onClick={() => go("/settings")}
          />
          <Item
            icon={Calendar}
            label="Economic calendar"
            badge={<Badge color="blue">Ads</Badge>}
            active={pathname === "/calendar"}
            onClick={() => go("/calendar")}
          />
          <Item
            icon={Users}
            label="Traders Community"
            active={pathname === "/community"}
            onClick={() => go("/community")}
          />
          <Item
            icon={Bot}
            label="MQL5 Algo Trading"
            active={pathname === "/mql5"}
            onClick={() => go("/mql5")}
          />
        </nav>

        {/* FOOTER */}
        <div
          className="absolute bottom-0 w-full py-2"
          style={{ borderTop: "1px solid var(--border-soft)" }}
        >
          <Item
            icon={HelpCircle}
            label="User guide"
            onClick={() => go("/guide")}
          />
          <Item
            icon={Info}
            label="About"
            onClick={() => go("/about")}
          />
        </div>
      </aside>
    </>
  );
}

/* ---------- ITEM ---------- */

function Item({
  icon: Icon,
  label,
  badge,
  onClick,
  active,
}: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-3 text-[15px] transition-all duration-200"
      style={{
        background: active ? "var(--bg-glass)" : "transparent",
        borderLeft: active
          ? "3px solid var(--primary)"
          : "3px solid transparent",
      }}
    >
      <div className="flex items-center gap-4">
        <Icon
          size={19}
          style={{
            color: active
              ? "var(--primary)"
              : "var(--text-muted)",
          }}
        />
        <span
          style={{
            color: active
              ? "var(--primary)"
              : "var(--text-main)",
          }}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {badge}
        <ChevronRight
          size={16}
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </button>
  );
}

/* ---------- BADGE ---------- */

function Badge({
  children,
  color,
}: {
  children: string;
  color: "red" | "blue";
}) {
  return (
    <span
      className="text-[11px] px-2 py-[3px] rounded-full font-medium"
      style={{
        background:
          color === "red"
            ? "var(--error)"
            : "var(--bg-glass)",
        color:
          color === "red"
            ? "#fff"
            : "var(--primary)",
      }}
    >
      {children}
    </span>
  );
}
