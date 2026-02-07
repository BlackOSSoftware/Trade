"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LineChart, LogIn, UserPlus } from "lucide-react";
import AppIntro from "./components/AppIntro";
import SplashHandler from "./SplashHandler";

type Slide = {
  title: string;
  subtitle: string;
  accent: string;
  image: string;
};




function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function Home() {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    const accessToken = getCookieValue("accessToken");
    const tradeToken = getCookieValue("tradeToken");

    if (accessToken) {
      router.replace("/dashboard");
      return;
    }

    if (tradeToken) {
      router.replace("/trade");
      return;
    }
  }, [router]);

  return (
    <>
    <SplashHandler />
    { showIntro && <AppIntro onFinish={() => setShowIntro(false)} /> }
    <div className="min-h-screen bg-[var(--bg-plan)] md:bg-[var(--bg-main)] text-[var(--text-main)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hidden md:block bg-[radial-gradient(circle_at_20%_20%,rgba(79,140,255,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.10),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.10),transparent_45%)]" />
      <div className="mx-auto w-full max-w-full px-0 py-0 md:px-0 md:py-0 relative">
        {!showIntro && (

          <div className="w-full min-h-screen flex items-center justify-center px-4 py-10">

            <div className="
      w-full max-w-6xl
      flex flex-col gap-5
      md:grid md:grid-cols-3 md:gap-10
    ">

              {/* Create Broker */}
              <button
                onClick={() => router.push("/signup")}
                className="
          group relative overflow-hidden
          rounded-2xl md:rounded-3xl
          border border-[var(--border-soft)]
          bg-[var(--bg-card)]
          shadow-[0_12px_32px_rgba(0,0,0,0.12)]
          p-6 md:p-8
          transition-all duration-500
          hover:-translate-y-2
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(79,140,255,0.25),transparent_60%)]" />

                <div className="flex items-center gap-4 md:block">

                  <div className="
            h-14 w-14 md:h-16 md:w-16
            rounded-2xl
            bg-gradient-to-br from-blue-500/30 to-blue-600/10
            flex items-center justify-center
          ">
                    <UserPlus size={28} className="text-blue-400" />
                  </div>

                  <div className="md:mt-6">
                    <div className="text-lg md:text-xl font-semibold">
                      Create Broker Account
                    </div>

                    <div className="mt-2 text-sm text-[var(--text-muted)]">
                      Secure onboarding with verified identity and full compliance.
                    </div>

                    <div className="mt-4 text-sm font-semibold text-[var(--primary)]">
                      Get Started →
                    </div>
                  </div>
                </div>
              </button>

              {/* Broker Login */}
              <button
                onClick={() => router.push("/login")}
                className="
          group relative overflow-hidden
          rounded-2xl md:rounded-3xl
          border border-[var(--border-soft)]
          bg-[var(--bg-card)]
          shadow-[0_12px_32px_rgba(0,0,0,0.12)]
          p-6 md:p-8
          transition-all duration-500
          hover:-translate-y-2
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_60%)]" />

                <div className="flex items-center gap-4 md:block">

                  <div className="
            h-14 w-14 md:h-16 md:w-16
            rounded-2xl
            bg-gradient-to-br from-emerald-500/30 to-emerald-600/10
            flex items-center justify-center
          ">
                    <LogIn size={28} className="text-emerald-400" />
                  </div>

                  <div className="md:mt-6">
                    <div className="text-lg md:text-xl font-semibold">
                      Broker Login
                    </div>

                    <div className="mt-2 text-sm text-[var(--text-muted)]">
                      Access your dashboard with complete account control.
                    </div>

                    <div className="mt-4 text-sm font-semibold text-[var(--primary)]">
                      Login →
                    </div>
                  </div>
                </div>
              </button>

              {/* Trade Login */}
              <button
                onClick={() => router.push("/trade-login")}
                className="
          group relative overflow-hidden
          rounded-2xl md:rounded-3xl
          border border-[var(--border-soft)]
          bg-[var(--bg-card)]
          shadow-[0_12px_32px_rgba(0,0,0,0.12)]
          p-6 md:p-8
          transition-all duration-500
          hover:-translate-y-2
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.25),transparent_60%)]" />

                <div className="flex items-center gap-4 md:block">

                  <div className="
            h-14 w-14 md:h-16 md:w-16
            rounded-2xl
            bg-gradient-to-br from-amber-500/30 to-amber-600/10
            flex items-center justify-center
          ">
                    <LineChart size={28} className="text-amber-400" />
                  </div>

                  <div className="md:mt-6">
                    <div className="text-lg md:text-xl font-semibold">
                      Trade Login
                    </div>

                    <div className="mt-2 text-sm text-[var(--text-muted)]">
                      Direct access to the live trading workspace.
                    </div>

                    <div className="mt-4 text-sm font-semibold text-[var(--primary)]">
                      Enter Platform →
                    </div>
                  </div>
                </div>
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
    </>

  );
}
