"use client";
import {
    User,
    Mail,
    Phone,
    Lock,
    Gift,
} from "lucide-react";
import { useState } from "react";
import { useCountries } from "@/hooks/useCountries";
import { Country } from "@/types/country";
import { PremiumInput } from "../components/ui/TextInput";
import { CountrySelect } from "../components/ui/CountrySelect";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const { data: countries } = useCountries();
    const router = useRouter();
    const [country, setCountry] = useState<Country | null>(null);

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        referral: "",
        otp: "",
    });

    const update = (k: keyof typeof form, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    if (!countries) return null;

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
            {/* BACKGROUND GLOW */}
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />

            {/* CARD */}
            <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl p-6 space-y-6">
                {/* HEADER */}
                <div className="space-y-1 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Create account
                    </h2>
                    <p className="text-sm text-[var(--text-muted)]">
                        Start your journey with Tradshape
                    </p>
                </div>

                <PremiumInput
                    label="Full name"
                    value={form.fullname}
                    onChange={(v) => update("fullname", v)}
                    icon={User}
                />

                <PremiumInput
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    icon={Mail}
                />

                {/* PHONE */}
                <div className="flex gap-2">
                    <CountrySelect
                        value={country ?? countries[0]}
                        onChange={setCountry}
                    />

                    <input
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) =>
                            update("phone", e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="10 digit number"
                        className="
              flex-1 rounded-lg border border-[var(--border-glass)]
              bg-[var(--bg-card)] px-3 text-sm outline-none
              focus:border-[var(--primary)]
              focus:ring-1 focus:ring-[var(--primary)]
            "
                    />
                </div>

                {/* PASSWORDS */}
                <PremiumInput
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(v) => update("password", v)}
                    icon={Lock}
                />

                <PremiumInput
                    label="Confirm password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(v) => update("confirmPassword", v)}
                    icon={Lock}

                />

                {/* REFERRAL */}
                <PremiumInput
                    label="Referral code (optional)"
                    value={form.referral}
                    onChange={(v) => update("referral", v)}
                    icon={Gift}
                />

                {/* CTA */}
                <button
                    className="
            w-full rounded-lg py-3 font-medium text-white
            bg-[var(--primary)]
            hover:shadow-[0_0_30px_var(--primary-glow)]
            transition
          "
                >
                    Create account
                </button>

                {/* FOOTER */}
                <p className="text-center text-sm text-[var(--text-muted)]">
                    Already have an account?{" "}
                    <span className="text-[var(--primary)] cursor-pointer hover:underline" onClick={() => router.push('/login')}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
