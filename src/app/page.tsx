"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LineChart, LogIn, UserPlus } from "lucide-react";

type Slide = {
  title: string;
  subtitle: string;
  accent: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Trade With",
    subtitle: "Institutional-grade infrastructure built for serious traders.",
    accent: "",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Built On",
    subtitle: "Transparent execution and lightning-fast order routing.",
    accent: "",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRydXN0fGVufDB8fDB8fHww",
  },
  {
    title: "Powered By",
    subtitle: "Secure systems engineered for precision and control.",
    accent: "",
    image: "https://media.istockphoto.com/id/2197642452/photo/golden-scales-of-justice-and-gavel-on-financial-chart-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=iORpepEBH0cI8yx7MDhG5IbQvrDhKJ8SJa3CuOQ4K5k=",
  },
];


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
  const [active, setActive] = useState(0);
  const [showSlides, setShowSlides] = useState(true);

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

    const hasSeenIntro = localStorage.getItem("homeAvoidSlides");

    if (hasSeenIntro === "true") {
      setShowSlides(false);
    }

    setReady(true);
  }, [router]);


  useEffect(() => {
    if (!showSlides) return;
    if (active >= slides.length - 1) return;
    const timer = setTimeout(() => {
      setActive((prev) => prev + 1);
    }, 2600);
    return () => clearTimeout(timer);
  }, [active, showSlides]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[var(--bg-plan)] md:bg-[var(--bg-main)]" />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-plan)] md:bg-[var(--bg-main)] text-[var(--text-main)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hidden md:block bg-[radial-gradient(circle_at_20%_20%,rgba(79,140,255,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.10),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.10),transparent_45%)]" />
      <div className="mx-auto w-full max-w-full px-0 py-0 md:px-0 md:py-0 relative">
        {showSlides && (
          <div className="relative w-full h-screen overflow-hidden">

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms]"
              style={{
                backgroundImage: `url(${slides[active].image})`,
              }}
            />

            {/* Crystal Clear Dark Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.85))]" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 text-white">

              <div className="max-w-2xl animate-fadeUp">
                <div className="text-xs tracking-[5px] uppercase text-[var(--primary)] mb-5">
                  ALS Trade
                </div>

                <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                  {slides[active].title}{" "}
                  <span className="text-[var(--primary)] animate-glow">
                    {active === 0 && "Trust"}
                    {active === 1 && "Reliability"}
                    {active === 2 && "Confidence"}
                  </span>
                </h1>

                <p className="mt-6 text-[15px] md:text-[18px] text-gray-300">
                  {slides[active].subtitle}
                </p>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between">

                {/* Slider Indicators */}
                <div className="flex gap-3">
                  {slides.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${i === active
                        ? "w-16 bg-[var(--primary)]"
                        : "w-8 bg-white/40"
                        }`}
                    />
                  ))}
                </div>

                {/* Get Started Button */}
                <button
                  onClick={() => {
                    localStorage.setItem("homeAvoidSlides", "true");
                    setShowSlides(false);
                  }}

                  className="px-6 py-3 rounded-full bg-[var(--primary)] text-white font-semibold shadow-[0_0_30px_rgba(79,140,255,0.6)] hover:scale-105 transition"
                >
                  Get Started →
                </button>
              </div>
            </div>
          </div>
        )}
        {!showSlides && (
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
  );
}
