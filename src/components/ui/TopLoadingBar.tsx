import { useEffect, useState } from "react";

/** Thin top bar; animates 0→70% while loading, completes on false. */
export function TopLoadingBar({ loading }: { loading: boolean }) {
  const [phase, setPhase] = useState<"idle" | "entering" | "completing">("idle");

  useEffect(() => {
    if (loading) {
      setPhase("entering");
      return;
    }
    setPhase((prev) => (prev === "entering" ? "completing" : prev === "completing" ? prev : "idle"));
  }, [loading]);

  useEffect(() => {
    if (phase !== "completing") return;
    const t = window.setTimeout(() => setPhase("idle"), 350);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "idle") return null;
  return (
    <div
      className={`loading-bar ${phase === "entering" ? "entering" : "completing"}`}
      role="progressbar"
      aria-hidden
    />
  );
}
