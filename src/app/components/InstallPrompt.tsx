"use client";

import { useEffect, useState } from "react";

let deferredPrompt: any = null;

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsIOS(ios);
    setIsStandalone(standalone);

    // ANDROID
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      deferredPrompt = e;

      if (!standalone && localStorage.getItem("pwa-dismissed") !== "true") {
        setShow(true);
      }
    });

    // iOS manual prompt
    if (ios && !standalone && localStorage.getItem("pwa-dismissed") !== "true") {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const closeModal = () => {
    localStorage.setItem("pwa-dismissed", "true");
    setShow(false);
  };

  const installApp = async () => {
    if (isIOS) {
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    setShow(false);
  };

  if (!show || isStandalone) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999]">
      <div className="card glass w-[92%] max-w-md p-6 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Install ALS Trader
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {isIOS
                ? "Tap Share button → then 'Add to Home Screen'"
                : "Get faster access and better trading experience."}
            </p>
          </div>

          <button
            onClick={closeModal}
            className="text-[var(--text-muted)] text-lg"
          >
            ×
          </button>
        </div>

        {!isIOS && (
          <button
            onClick={installApp}
            className="w-full py-3 rounded-xl font-semibold"
            style={{
              background: "var(--primary)",
              color: "var(--text-invert)",
            }}
          >
            Install App
          </button>
        )}
      </div>
    </div>
  );
}
