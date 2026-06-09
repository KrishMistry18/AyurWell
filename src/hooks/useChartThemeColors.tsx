import { useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";

/** Recharts-friendly colors from CSS variables; updates when theme changes. */
export function useChartThemeColors() {
  const { isDark, theme } = useTheme();

  return useMemo(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;

    return {
      primary: v("--color-primary", "#2D6A4F"),
      primaryLight: v("--color-primary-light", "#52B788"),
      accent: v("--color-accent", "#E9C46A"),
      accentDark: v("--color-accent-dark", "#F4A261"),
      muted: v("--color-text-muted", "#6B7280"),
      text: v("--color-text-primary", "#1A1A2E"),
      border: v("--color-border", "rgba(0,0,0,0.1)"),
      card: v("--color-card", "#ffffff"),
      doshaVata: v("--color-dosha-vata", "#7B9CBF"),
      doshaPitta: v("--color-dosha-pitta", "#E07A5F"),
      doshaKapha: v("--color-dosha-kapha", "#6B8F71"),
      emptyBar: isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb",
    };
  }, [isDark, theme]);
}
