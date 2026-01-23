"use client";

let deferredPrompt: any = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: any) => {
    e.preventDefault();

    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("pwa-dismissed") === "true") return;

    deferredPrompt = e;

    const modal = document.getElementById("pwa-install-modal");
    if (modal) modal.classList.add("show-modal");
  });
}

export default function InstallPrompt() {
  const closeModal = () => {
    localStorage.setItem("pwa-dismissed", "true");

    const modal = document.getElementById("pwa-install-modal");
    if (modal) modal.classList.remove("show-modal");
  };

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;

    const modal = document.getElementById("pwa-install-modal");
    if (modal) modal.classList.remove("show-modal");
  };

  return (
    <div
      id="pwa-install-modal"
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 z-[9999]"
    >
      <div className="card glass w-[92%] max-w-md p-6 rounded-2xl shadow-2xl transform scale-95 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">
              Install ALS Trader
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Get faster access and better trading experience.
            </p>
          </div>

          <button
            onClick={closeModal}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-lg"
          >
            ×
          </button>
        </div>

        <button
          onClick={installApp}
          className="w-full py-3 rounded-xl font-semibold transition-all duration-200"
          style={{
            background: "var(--primary)",
            color: "var(--text-invert)",
          }}
        >
          Install App
        </button>
      </div>
    </div>
  );
}
