"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTradeAccount } from "@/hooks/accounts/useAccountById";
import GlobalLoader from "../components/ui/GlobalLoader";

// Assuming you have icons from a library like Heroicons or Lucide
import { 
  Wallet, 
  TrendingUp, 
  Lock, 
  Settings, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  BarChart3 
} from "lucide-react";

export default function TradeDashboard() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: account, isLoading } = useTradeAccount();

  useEffect(() => {
    if (isMobile) {
      router.replace(`/trade/quotes`);
    }
  }, [isMobile, router]);

  if (isLoading || !account) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-main)' }}
      >
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen px-6 lg:px-12 py-10"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* =========================
           HEADER STRIP
        ========================== */}
        <div 
          className="shadow-lg rounded-xl p-8 border"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-soft)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-glass)' }}
              >
                <BarChart3 
                  className="w-8 h-8" 
                  style={{ color: 'var(--primary)' }} 
                />
              </div>
              <div>
                <div 
                  className="text-sm uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Trading Account
                </div>
                <h1 
                  className="text-3xl lg:text-4xl font-bold tracking-tight"
                  style={{ color: 'var(--text-main)' }}
                >
                  {account.accountNumber}
                </h1>
                <div 
                  className="mt-3 flex flex-wrap items-center gap-4 text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="font-medium">{account.planName}</span>
                  <div 
                    className="w-px h-4"
                    style={{ backgroundColor: 'var(--border-soft)' }}
                  />
                  <span className="uppercase font-medium">{account.accountType}</span>
                  <div 
                    className="w-px h-4"
                    style={{ backgroundColor: 'var(--border-soft)' }}
                  />
                  <span className="font-medium">{account.currency}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="text-sm font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Status
              </div>
              <div 
                className="px-5 py-2 rounded-full text-sm font-semibold border shadow-sm"
                 style={{
                  background: account.status === 'Active' ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                  borderColor: account.status === 'Active' ? "rgba(239, 68, 68, 0.4)" : "rgba(34, 197, 94, 0.4)",
                  color: account.status === 'Active' ? "#ef4444" : "#22c55e"
                }}
              >
                {account.status}
              </div>
            </div>
          </div>
        </div>

        {/* =========================
           MAIN METRICS GRID
        ========================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BALANCE */}
          <div 
            className="shadow-lg rounded-xl p-8 border hover:shadow-xl transition-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-soft)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Wallet 
                className="w-6 h-6" 
                style={{ color: 'var(--success)' }} 
              />
              <div 
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                Balance
              </div>
            </div>
            <div 
              className="text-4xl font-bold mt-numbers"
              style={{ color: 'var(--text-main)' }}
            >
              {account.balance.toLocaleString()}
            </div>
            <div 
              className="text-sm mt-2 font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {account.currency}
            </div>
          </div>

          {/* EQUITY */}
          <div 
            className="shadow-lg rounded-xl p-8 border hover:shadow-xl transition-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-soft)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp 
                className="w-6 h-6" 
                style={{ color: 'var(--primary)' }} 
              />
              <div 
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                Equity
              </div>
            </div>
            <div 
              className="text-4xl font-bold mt-numbers"
              style={{ color: 'var(--text-main)' }}
            >
              {account.equity.toLocaleString()}
            </div>
            <div 
              className="text-sm mt-2 font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {account.currency}
            </div>
          </div>

          {/* HOLD BALANCE */}
          <div 
            className="shadow-lg rounded-xl p-8 border hover:shadow-xl transition-shadow"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-soft)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Lock 
                className="w-6 h-6" 
                style={{ color: 'var(--warning)' }} 
              />
              <div 
                className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: 'var(--text-muted)' }}
              >
                Hold Balance
              </div>
            </div>
            <div 
              className="text-4xl font-bold mt-numbers"
              style={{ color: 'var(--text-main)' }}
            >
              {account.holdBalance.toLocaleString()}
            </div>
            <div 
              className="text-sm mt-2 font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {account.currency}
            </div>
          </div>
        </div>

        {/* =========================
           PARAMETERS SECTION
        ========================== */}
        <div 
          className="shadow-lg rounded-xl p-10 border"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-soft)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center gap-3 mb-10">
            <Settings 
              className="w-6 h-6" 
              style={{ color: 'var(--text-muted)' }} 
            />
            <h2 
              className="text-lg font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-main)' }}
            >
              Trading Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Parameter
              label="Leverage"
              value={`${account.leverage}x`}
              icon={<TrendingUp className="w-5 h-5" />}
            />

            <Parameter
              label="Spread Type"
              value={account.spreadType}
              icon={<BarChart3 className="w-5 h-5" />}
            />

            <Parameter
              label="Spread"
              value={`${account.spreadPips} pips`}
              icon={<DollarSign className="w-5 h-5" />}
            />

            <Parameter
              label="Commission"
              value={`${account.commissionPerLot}`}
              suffix="per lot"
              icon={<Wallet className="w-5 h-5" />}
            />

            <Parameter
              label="Swap"
              value={account.swapEnabled ? "Enabled" : "Disabled"}
              highlight={account.swapEnabled}
              icon={account.swapEnabled ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            />

            <Parameter
              label="First Deposit"
              value={account.firstDeposit ? "Completed" : "Pending"}
              highlight={account.firstDeposit}
              warning={!account.firstDeposit}
              icon={account.firstDeposit ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================
   Reusable Parameter Block
========================== */
function Parameter({
  label,
  value,
  suffix,
  highlight,
  warning,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
  warning?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon && (
          <div 
            style={{
              color: highlight ? 'var(--success)' : warning ? 'var(--warning)' : 'var(--text-muted)'
            }}
          >
            {icon}
          </div>
        )}
        <div 
          className="text-xs uppercase tracking-wider font-semibold"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </div>
      </div>

      <div
        className="text-xl font-semibold"
        style={{
          color: highlight ? 'var(--success)' : warning ? 'var(--warning)' : 'var(--text-main)'
        }}
      >
        {value}
      </div>

      {suffix && (
        <div 
          className="text-xs font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}