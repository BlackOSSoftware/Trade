import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import FcmRegister from "./components/FcmRegister";
import InitNotifications from "./components/InitNotifications";
import { Roboto } from "next/font/google";

const mtFont = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ALS Trader",
  description: "Advanced Trading Platform for ALS Tokens",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js");
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="rgba(37, 99, 235, 0.25))" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      <head className={mtFont.className}>
        {/* 🔥 THEME INIT SCRIPT (RUNS BEFORE REACT) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mt-font`}
      >
        <AppProviders>
          <FcmRegister />
          <InitNotifications />
          {children}</AppProviders>
      </body>
    </html>
  );
}
