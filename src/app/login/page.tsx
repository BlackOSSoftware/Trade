"use client";

import { JSX, useState } from "react";
import { PremiumInput } from "../components/ui/TextInput";
import { AuthShell } from "../components/auth/AuthCard";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  LucideIcon,
} from "lucide-react";

type Step = "login" | "forgot" | "otp" | "reset";

type FormState = {
  identity: string;
  password: string;
  otp: string;
  newPassword: string;
};

export default function LoginPage() {
  const [step, setStep] = useState<Step>("login");
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    identity: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const steps: Record<
    Step,
    {
      title: string;
      fields: {
        key: keyof FormState;
        label: string;
        type?: "text" | "email" | "password";
        icon?: LucideIcon;
      }[];
      buttonText: string;
      onSubmit?: () => void;
      footer?: JSX.Element;
      back?: () => void;
    }
  > = {
    login: {
      title: "Sign in to Intra Treasure",
      fields: [
        {
          key: "identity",
          label: "Email or Account ID",
          icon: User,
        },
        {
          key: "password",
          label: "Password",
          type: "password",
          icon: Lock,
        },
      ],
      buttonText: "Login",
      footer: (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setStep("forgot")}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <p className="text-sm text-center text-[var(--text-muted)]">
            Don’t have an account?{" "}
            <span
              className="text-[var(--primary)] cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              Signup now
            </span>
          </p>
        </>
      ),
    },

    forgot: {
      title: "Recover your account",
      back: () => setStep("login"),
      fields: [
        {
          key: "identity",
          label: "Registered Email",
          type: "email",
          icon: Mail,
        },
      ],
      buttonText: "Send OTP",
      onSubmit: () => setStep("otp"),
    },

    otp: {
      title: "Verify OTP",
      back: () => setStep("forgot"),
      fields: [
        {
          key: "otp",
          label: "One Time Password",
          icon: KeyRound,
        },
      ],
      buttonText: "Verify",
      onSubmit: () => setStep("reset"),
    },

    reset: {
      title: "Set new password",
      back: () => setStep("login"),
      fields: [
        {
          key: "newPassword",
          label: "Create new password",
          type: "password",
          icon: Lock,
        },
      ],
      buttonText: "Update password",
    },
  };

  const current = steps[step];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      {/* BACKGROUND GLOW */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl" />

      <AuthShell>
        <div className="space-y-8 animate-fadeIn">
          {/* BRAND */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Intra Treasure
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Institutional-grade trading platform
            </p>
          </div>

          {/* BACK BUTTON */}
          {current.back && (
            <button
              onClick={current.back}
              className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--primary)]"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>
          )}

          {/* FORM HEADER */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold">
              {current.title}
            </h2>
            {step === "login" && (
              <p className="text-sm text-[var(--text-muted)]">
                Sign in to continue to your dashboard
              </p>
            )}
          </div>

          {/* INPUTS */}
          <div className="space-y-6">
            {current.fields.map((field) => (
              <PremiumInput
                key={field.key}
                label={field.label}
                type={field.type}
                value={form[field.key]}
                onChange={(v) => updateForm(field.key, v)}
                icon={field.icon}
              />
            ))}
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={current.onSubmit}
            className={`w-full rounded-lg py-3 font-medium transition text-white
              ${
                step === "reset"
                  ? "bg-emerald-500 hover:opacity-90"
                  : "bg-[var(--primary)] hover:shadow-[0_0_30px_var(--primary-glow)]"
              }`}
          >
            {current.buttonText}
          </button>

          {/* FOOTER */}
          {current.footer}
        </div>
      </AuthShell>
    </div>
  );
}
