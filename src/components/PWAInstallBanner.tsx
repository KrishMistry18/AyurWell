import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed);
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      // Show after 30 seconds
      setTimeout(() => setShow(true), 30000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prompt as any).prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { outcome } = await (prompt as any).userChoice;
    if (outcome === "accepted") setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-dismissed", Date.now().toString());
  };

  if (!show || !prompt) return null;

  return (
    <div className="pwa-banner">
      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-lg flex-shrink-0">
        🌿
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary text-sm">Add AyurWell to Home Screen</p>
        <p className="text-xs text-text-muted">Get instant access to your wellness dashboard</p>
      </div>
      <button onClick={handleInstall} className="ayur-btn-primary text-xs px-4 py-2 flex-shrink-0">
        <Download className="w-3.5 h-3.5 mr-1" /> Install
      </button>
      <button onClick={handleDismiss} className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
