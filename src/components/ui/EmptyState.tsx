import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  variant: "no-dosha" | "no-diet-plan" | "no-analytics" | "no-community" | "no-herbs-found" | "no-badges" | "no-streak" | "error";
  onAction?: () => void;
  className?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string | null;
}

const VARIANTS: Record<
  EmptyStateProps["variant"],
  { emoji: string; title: string; description: string; actionLabel: string; actionTo: string | null }
> = {
  "no-dosha": {
    emoji: "🪷",
    title: "Discover Your Dosha First",
    description: "Your Ayurvedic constitution shapes everything — diet, lifestyle, and wellness.",
    actionLabel: "Take Dosha Quiz",
    actionTo: "/dosha",
  },
  "no-diet-plan": {
    emoji: "🥗",
    title: "No Plan Yet",
    description: "Generate a 7-day meal plan tailored to your dosha and health goals.",
    actionLabel: "Generate Plan",
    actionTo: "/diet-generator",
  },
  "no-analytics": {
    emoji: "📊",
    title: "Start Tracking",
    description: "Log your first wellness entry to see trends and insights.",
    actionLabel: "Log Today",
    actionTo: "/analytics",
  },
  "no-community": {
    emoji: "🌿",
    title: "Be the First!",
    description: "Share a recipe, tip, or experience with the community.",
    actionLabel: "Create Post",
    actionTo: "/community",
  },
  "no-herbs-found": {
    emoji: "🔍",
    title: "No herbs found",
    description: "Try a different search term or clear your filters.",
    actionLabel: "Clear Filters",
    actionTo: null,
  },
  "no-badges": {
    emoji: "🏆",
    title: "No badges yet",
    description: "Start logging daily to earn your first badge!",
    actionLabel: "Log Today",
    actionTo: "/analytics",
  },
  "no-streak": {
    emoji: "🔥",
    title: "Start Your Streak",
    description: "Log today to begin your wellness streak!",
    actionLabel: "Log Now",
    actionTo: "/analytics",
  },
  "error": {
    emoji: "⚠️",
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
    actionLabel: "Try Again",
    actionTo: null,
  },
};

export function EmptyState({ variant, onAction, className, title, description, actionLabel, actionTo }: EmptyStateProps) {
  const v = VARIANTS[variant];
  const finalTitle = title || v.title;
  const finalDesc = description || v.description;
  const finalLabel = actionLabel || v.actionLabel;
  const finalTo = actionTo !== undefined ? actionTo : v.actionTo;

  return (
    <div className={cn("empty-state", className)}>
      <div className="text-5xl mb-1">{v.emoji}</div>
      <h4 className="font-bold text-text-primary text-base">{finalTitle}</h4>
      <p className="text-sm text-text-muted max-w-xs leading-relaxed">{finalDesc}</p>
      {(onAction || finalTo) && (
        finalTo ? (
          <Link to={finalTo} className="ayur-btn-primary text-sm mt-1">
            {finalLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="ayur-btn-primary text-sm mt-1">
            {finalLabel}
          </button>
        )
      )}
    </div>
  );
}
