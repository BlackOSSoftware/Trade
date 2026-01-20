"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
                className={`fixed inset-0 z-40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                style={{ background: "rgba(0,0,0,0.6)" }}
            />

            {/* SIDEBAR */}
            <aside
                ref={ref}
                className={`mt-sidebar fixed left-0 top-0 z-50 h-full w-[82%] max-w-[340px]
        bg-black text-white transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* TOP PROFILE */}
                <div className="relative px-4 pt-4 pb-3 border-b border-white/10">
                    {/* DEMO RIBBON */}
                    {accountType === "demo" && (
                        <div className="absolute right-0 top-0 w-16 h-16 overflow-hidden">
                            <div
                                className="absolute right-[-32px] top-[14px] rotate-45
                bg-green-500 text-black text-[10px] font-bold
                px-10 py-[2px]"
                            >
                                Demo
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {/* LOGO */}
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                            <img
                                src="/logo/logo.png"
                                alt="Platform Logo"
                                className="w-6 h-6 object-contain"
                            />
                        </div>

                        {/* USER INFO */}
                        <div className="flex flex-col leading-tight">
                            <div className="text-sm font-semibold">{userName}</div>
                            <div className="text-xs text-gray-400">
                                {accountNumber} · ALS Traders
                            </div>
                        </div>
                    </div>


                    <button
                        className="mt-2 text-[13px] text-[#4aa3ff]"
                        onClick={() => go("/accounts")}
                    >
                        Manage accounts
                    </button>
                </div>

                {/* MENU */}
                <nav className="py-2">
                    <Item icon={BarChart3} label="Trade" onClick={() => go(`${base}/trade`)} />
                    <Item icon={Newspaper} label="News" onClick={() => go("/news")} />

                    <Item
                        icon={Mail}
                        label="Mailbox"
                        badge={<Badge color="red">8</Badge>}
                        onClick={() => go("/mail")}
                    />

                    <Item icon={BookOpen} label="Journal" onClick={() => go("/journal")} />
                    <Item icon={Settings} label="Settings" onClick={() => go("/settings")} />

                    <Item
                        icon={Calendar}
                        label="Economic calendar"
                        badge={<Badge color="blue">Ads</Badge>}
                        onClick={() => go("/calendar")}
                    />

                    <Item icon={Users} label="Traders Community" onClick={() => go("/community")} />
                    <Item icon={Bot} label="MQL5 Algo Trading" onClick={() => go("/mql5")} />
                </nav>

                {/* FOOTER */}
                <div className="absolute bottom-0 w-full border-t border-white/10 py-2">
                    <Item icon={HelpCircle} label="User guide" onClick={() => go("/guide")} />
                    <Item icon={Info} label="About" onClick={() => go("/about")} />
                </div>
            </aside>
        </>
    );
}

/* ---------- UI PARTS ---------- */

function Item({
    icon: Icon,
    label,
    badge,
    onClick,
}: any) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between
      px-4 py-3 text-[15px] hover:bg-white/5 transition"
        >
            <div className="flex items-center gap-4">
                <Icon size={20} className="text-gray-300" />
                <span>{label}</span>
            </div>

            <div className="flex items-center gap-2">
                {badge}
                <ChevronRight size={16} className="text-gray-600" />
            </div>
        </button>
    );
}

function Badge({
    children,
    color,
}: {
    children: string;
    color: "red" | "blue";
}) {
    return (
        <span
            className={`text-[11px] px-2 py-[2px] rounded-full font-medium
      ${color === "red"
                    ? "bg-red-500 text-white"
                    : "bg-[#1f3b5c] text-[#4aa3ff]"
                }`}
        >
            {children}
        </span>
    );
}
