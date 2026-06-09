import { Link } from "react-router-dom";

interface EmptyStateProps {
  variant: "no-dosha" | "no-plan" | "no-logs" | "no-coach" | "no-badges";
  onAction?: () => void;
}

const CONFIG = {
  "no-dosha": {
    title: "Discover Your Dosha Profile",
    description: "Take our comprehensive Ayurvedic assessment to identify your mind-body constitution and unlock personalized recommendations.",
    btnLabel: "Take Assessment",
    linkTo: "/dosha",
  },
  "no-plan": {
    title: "No Active Diet Plan",
    description: "Generate a custom 7-day Ayurvedic meal plan aligned with your dominant dosha and health goals.",
    btnLabel: "Generate Diet Plan",
    linkTo: "/diet-generator",
  },
  "no-logs": {
    title: "No Wellness Logs Yet",
    description: "Start logging your energy levels, sleep hours, water intake, and mood to generate analytics and trends.",
    btnLabel: "Log First Entry",
    linkTo: "/analytics",
  },
  "no-coach": {
    title: "Start Conversation",
    description: "Consult Vaidya, your AI-powered Ayurvedic wellness guide, for custom recommendations and answers.",
    btnLabel: "Chat with Coach",
    linkTo: "/coach",
  },
  "no-badges": {
    title: "No Badges Unlocked",
    description: "Complete daily activities, maintain logging streaks, and stick to your diet plan to earn special achievements.",
    btnLabel: "View All Badges",
    linkTo: "/achievements",
  },
};

export default function EmptyState({ variant, onAction }: EmptyStateProps) {
  const cfg = CONFIG[variant];

  const renderSVG = () => {
    switch (variant) {
      case "no-dosha":
        return (
          <svg
            className="w-16 h-16 text-primary stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C9.5 7.5 6 9 6 13a6 6 0 0 0 12 0c0-4-3.5-5.5-6-11z" />
            <path d="M12 22c-5.5 0-8-3-8-8 0-3 3-5 5-8" />
            <path d="M12 22c5.5 0 8-3 8-8 0-3-3-5-5-8" />
          </svg>
        );
      case "no-plan":
        return (
          <svg
            className="w-16 h-16 text-primary stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 11a9 9 0 0 0 18 0" />
            <path d="M3 11h18" />
            <path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
            <path d="M12 5V2" />
          </svg>
        );
      case "no-logs":
        return (
          <svg
            className="w-16 h-16 text-primary stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 17l6-6 4 4 8-8" />
            <circle cx="9" cy="11" r="1" />
            <circle cx="13" cy="15" r="1" />
          </svg>
        );
      case "no-coach":
        return (
          <svg
            className="w-16 h-16 text-primary stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case "no-badges":
        return (
          <svg
            className="w-16 h-16 text-primary stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
            <path d="M12 2a6 6 0 0 1 6 6v3.5c0 2.5-2 4.5-4.5 4.5h-3C8 16 6 14 6 11.5V8a6 6 0 0 1 6-6z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl max-w-md mx-auto shadow-sm gap-4">
      <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-full">
        {renderSVG()}
      </div>
      <div>
        <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {cfg.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
          {cfg.description}
        </p>
      </div>
      {onAction ? (
        <button
          onClick={onAction}
          className="ayur-btn-primary px-6 py-2.5 text-xs font-bold rounded-full active:scale-95 transition-transform"
        >
          {cfg.btnLabel}
        </button>
      ) : (
        <Link
          to={cfg.linkTo}
          className="ayur-btn-primary px-6 py-2.5 text-xs font-bold rounded-full active:scale-95 transition-transform text-center inline-block"
        >
          {cfg.btnLabel}
        </Link>
      )}
    </div>
  );
}
