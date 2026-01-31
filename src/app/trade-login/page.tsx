"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import { useTradeLogin } from "@/hooks/trade/useTradeLogin";
import { AuthShell } from "../components/auth/AuthCard";
import { PremiumInput } from "../components/ui/TextInput";

export default function TradeLogin() {
    const router = useRouter();
    const tradeLogin = useTradeLogin();

    const [form, setForm] = useState({
        account_number: "",
        password: "",
    });

    const [toast, setToast] = useState<string | null>(null);

    const updateForm = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const handleTradeLogin = () => {
        if (!form.account_number || !form.password) {
            setToast("All fields are required");
            return;
        }

        tradeLogin.mutate(
            {
                account_number: form.account_number,
                password: form.password,
            },
            {
                onSuccess: (res) => {
                    const { tradeToken, accountId } = res;
                    console.log("LOGIN RESPONSE:", res);
                    document.cookie = `tradeToken=${tradeToken}; path=/; max-age=900`;
                    document.cookie = `sessionType=${res.sessionType}; path=/; max-age=900`;
                    document.cookie = `accountId=${accountId}; path=/; max-age=900`;

                   router.push("/trade");
                },

                onError: () => {
                    setToast("Invalid account credentials");
                },
            }
        );
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
            {/* BACKGROUND GLOW */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />

            <AuthShell>
                <div className="space-y-8 animate-fadeIn">
                    {/* LOGIN SWITCH */}
                    <div className="flex justify-center">
                        <div className="flex bg-[var(--bg-glass)] p-1 rounded-lg">
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 text-sm rounded-md text-[var(--text-muted)] hover:text-white transition"
                            >
                                Broker Login
                            </button>

                            <button
                                className="px-4 py-2 text-sm rounded-md bg-[var(--primary)] text-white transition"
                            >
                                Trade Panel Login
                            </button>
                        </div>
                    </div>

                    {/* BRAND */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Trade Panel Access
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Login using Account Number & Password
                        </p>
                    </div>

                    {/* INPUTS */}
                    <div className="space-y-6">
                        <PremiumInput
                            label="Account Number"
                            value={form.account_number}
                            onChange={(v) => updateForm("account_number", v)}
                            icon={User}
                        />

                        <PremiumInput
                            label="Trade / Watch Password"
                            type="password"
                            value={form.password}
                            onChange={(v) => updateForm("password", v)}
                            icon={Lock}
                        />
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        onClick={handleTradeLogin}
                        disabled={tradeLogin.isPending}
                        className="w-full rounded-lg py-3 font-medium transition text-white bg-[var(--primary)] hover:shadow-[0_0_30px_var(--primary-glow)] disabled:opacity-60"
                    >
                        {tradeLogin.isPending ? "Signing in..." : "Login"}
                    </button>
                </div>
            </AuthShell>

            {/* TOAST */}
            {toast && (
                <div className="fixed bottom-4 right-4 rounded-lg bg-[var(--primary)] text-white px-4 py-2 shadow-xl">
                    {toast}
                </div>
            )}
        </div>
    );
}
