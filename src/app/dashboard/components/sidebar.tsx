"use client";

import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  FileText,
  Layers,
  Gift,
  Headphones,
  Landmark,
  ChevronLeft,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Assets", icon: Wallet, href: "/dashboard/assets" },
  { label: "Account", icon: Landmark, href: "/dashboard/accounts" },
];

const paymentItems = [
  { label: "Deposit", href: "/dashboard/payments/deposit" },
  { label: "Withdrawal", href: "/dashboard/payments/withdraw" },
  { label: "Internal Transfer", href: "/dashboard/payments/internal-fund-transfer" },
  { label: "Transactions", href: "/dashboard/payments/transactions" },
];

const bottomItems = [
  { label: "Platform", icon: Layers, href: "/dashboard/platform" },
  { label: "Task Center", icon: Gift, href: "/dashboard/tasks" },
  { label: "Support", icon: Headphones, href: "/dashboard/support" },
];

export default function Sidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  open: boolean;
  collapsed: boolean;
  onClose?: () => void;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [paymentOpen, setPaymentOpen] = useState(false);

  const isPaymentActive = pathname.startsWith("/dashboard/payments");

  useEffect(() => {
    if (!isPaymentActive) setPaymentOpen(false);
  }, [pathname]);

  const NavButton = ({
    label,
    icon: Icon,
    active,
    onClick,
  }: any) => (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`
          flex items-center gap-3 w-full rounded-xl px-3 py-2.5
          ${
            active
              ? "bg-[var(--bg-glass)] text-[var(--primary)]"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-glass)]"
          }
        `}
      >
        <span className="h-9 w-9 flex items-center justify-center rounded-lg">
          <Icon size={18} />
        </span>

        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </button>

      {/* TOOLTIP */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50 h-screen transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          bg-[var(--bg-card)]
          border-r border-[var(--border-glass)]
          ${open ? "left-0" : "-left-full md:left-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--border-soft)]">
          {!collapsed && (
            <div>
              <p className="text-xs uppercase text-[var(--text-muted)]">ALS</p>
              <p className="text-lg font-semibold">Dashboard</p>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-1.5 hover:bg-[var(--bg-glass)]"
          >
            <ChevronLeft
              size={18}
              className={`transition ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {items.map((item) => (
            <NavButton
              key={item.label}
              {...item}
              active={
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
              }
              onClick={() => {
                router.push(item.href);
                onClose?.();
              }}
            />
          ))}

          {/* PAYMENTS */}
          <div
            className="relative group"
            onMouseEnter={() => collapsed && setPaymentOpen(true)}
            onMouseLeave={() => collapsed && setPaymentOpen(false)}
          >
            <button
              onClick={() => !collapsed && setPaymentOpen((v) => !v)}
              className={`
                flex items-center justify-between w-full rounded-xl px-3 py-2.5
                ${
                  isPaymentActive
                    ? "bg-[var(--bg-glass)] text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-glass)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 flex items-center justify-center">
                  <CreditCard size={18} />
                </span>
                {!collapsed && <span className="text-sm">Payments</span>}
              </div>

              {!collapsed && (
                <ChevronDown
                  size={16}
                  className={`transition ${
                    paymentOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* DROPDOWN */}
            {paymentOpen && (
              <div
                className={`
                  absolute ${collapsed ? "left-12  top-0 ml-3" : "relative ml-11 mt-1"}
                  z-50 rounded-lg bg-[var(--bg-card)] border border-[var(--border-glass)]
                  space-y-1 p-1 min-w-[180px]
                `}
              >
                {paymentItems.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => {
                      router.push(sub.href);
                      onClose?.();
                    }}
                    className={`
                      w-full text-left rounded-md px-3 py-2 text-sm
                      ${
                        pathname === sub.href
                          ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "hover:bg-[var(--bg-glass)]"
                      }
                    `}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {bottomItems.map((item) => (
            <NavButton
              key={item.label}
              {...item}
              active={pathname.startsWith(item.href)}
              onClick={() => {
                router.push(item.href);
                onClose?.();
              }}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
