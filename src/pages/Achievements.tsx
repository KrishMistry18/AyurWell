import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

interface BadgeData {
  slug: string;
  name: string;
  description: string;
  icon_emoji: string;
  category: string;
  requirement_description: string;
  is_rare: boolean;
  earned: boolean;
  earned_at: string | null;
}

interface StreakData {
  current: number;
  longest: number;
  total_logs: number;
  logged_today: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Badges",
  streak: "Streaks",
  wellness: "Wellness",
  diet: "Diet & Nutrition",
  dosha: "Dosha Quiz",
  special: "Special & Tour",
};

const BADGES_CONSTANT: Omit<BadgeData, "earned" | "earned_at">[] = [
  {
    slug: "first-step",
    name: "First Step",
    description: "Logged your first wellness entry",
    icon_emoji: "\uD83D\uDC63",
    category: "streak",
    requirement_description: "Log your first wellness entry",
    is_rare: false,
  },
  {
    slug: "week-warrior",
    name: "Week Warrior",
    description: "Logged 7 days in a row",
    icon_emoji: "\uD83D\uDD25",
    category: "streak",
    requirement_description: "Maintain a 7-day logging streak",
    is_rare: false,
  },
  {
    slug: "fortnight-champion",
    name: "Fortnight Champion",
    description: "Logged 14 days in a row",
    icon_emoji: "\u26A1",
    category: "streak",
    requirement_description: "Maintain a 14-day logging streak",
    is_rare: false,
  },
  {
    slug: "30-day-sage",
    name: "30-Day Sage",
    description: "Logged 30 days in a row",
    icon_emoji: "\uD83E\uDDD8",
    category: "streak",
    requirement_description: "Maintain a 30-day logging streak",
    is_rare: true,
  },
  {
    slug: "100-day-yogi",
    name: "100-Day Yogi",
    description: "Logged 100 days in a row",
    icon_emoji: "\uD83C\uDFC6",
    category: "streak",
    requirement_description: "Maintain a 100-day logging streak",
    is_rare: true,
  },
  {
    slug: "energy-master",
    name: "Energy Master",
    description: "Averaged energy above 8 for 7 days",
    icon_emoji: "\u26A1",
    category: "wellness",
    requirement_description: "Average energy score above 8/10 for 7 consecutive days",
    is_rare: false,
  },
  {
    slug: "sleep-champion",
    name: "Sleep Champion",
    description: "Averaged 8+ hours sleep for 7 days",
    icon_emoji: "\uD83D\uDE34",
    category: "wellness",
    requirement_description: "Average 8+ hours of sleep for 7 consecutive days",
    is_rare: false,
  },
  {
    slug: "hydration-hero",
    name: "Hydration Hero",
    description: "Drank 2000ml+ water for 7 days",
    icon_emoji: "\uD83D\uDCA7",
    category: "wellness",
    requirement_description: "Log 2000ml+ water intake for 7 consecutive days",
    is_rare: false,
  },
  {
    slug: "mood-lifter",
    name: "Mood Lifter",
    description: "Averaged mood above 4 for 7 days",
    icon_emoji: "\uD83D\uDE04",
    category: "wellness",
    requirement_description: "Average mood score above 4/5 for 7 consecutive days",
    is_rare: false,
  },
  {
    slug: "pulse-pioneer",
    name: "Pulse Pioneer",
    description: "Generated your first AI Pulse Check",
    icon_emoji: "\uD83D\uDC96",
    category: "wellness",
    requirement_description: "Generate your first AI Pulse Check",
    is_rare: false,
  },
  {
    slug: "excellent-pulse",
    name: "Excellent Pulse",
    description: "Achieved an Excellent pulse score",
    icon_emoji: "\uD83C\uDF1F",
    category: "wellness",
    requirement_description: "Score 80+ on your AI Pulse Check",
    is_rare: true,
  },
  {
    slug: "plan-pioneer",
    name: "Plan Pioneer",
    description: "Generated your first diet plan",
    icon_emoji: "\uD83E\uDD57",
    category: "diet",
    requirement_description: "Generate your first personalized diet plan",
    is_rare: false,
  },
  {
    slug: "seasonal-eater",
    name: "Seasonal Eater",
    description: "Generated plans for all 4 seasons",
    icon_emoji: "\uD83C\uDF38",
    category: "diet",
    requirement_description: "Generate diet plans for Spring, Summer, Autumn, and Winter",
    is_rare: true,
  },
  {
    slug: "meal-swapper",
    name: "Meal Swapper",
    description: "Swapped 5 meals with AI alternatives",
    icon_emoji: "\uD83D\uDD04",
    category: "diet",
    requirement_description: "Use the AI meal swap feature 5 times",
    is_rare: false,
  },
  {
    slug: "recipe-explorer",
    name: "Recipe Explorer",
    description: "Generated 10 different diet plans",
    icon_emoji: "\uD83D\uDCD6",
    category: "diet",
    requirement_description: "Generate 10 diet plans total",
    is_rare: true,
  },
  {
    slug: "pdf-downloader",
    name: "Plan Keeper",
    description: "Downloaded your diet plan as PDF",
    icon_emoji: "\uD83D\uDCC4",
    category: "diet",
    requirement_description: "Download your diet plan as a PDF",
    is_rare: false,
  },
  {
    slug: "self-aware",
    name: "Self-Aware",
    description: "Completed the Dosha Quiz",
    icon_emoji: "\uD83E\uDDEA",
    category: "dosha",
    requirement_description: "Complete the Dosha Assessment Quiz",
    is_rare: false,
  },
  {
    slug: "balanced-being",
    name: "Balanced Being",
    description: "Retook the quiz after 30 days",
    icon_emoji: "\u2696\uFE0F",
    category: "dosha",
    requirement_description: "Retake the Dosha Quiz after 30 days",
    is_rare: false,
  },
  {
    slug: "tridoshic",
    name: "Tridoshic",
    description: "Achieved near-equal dosha balance",
    icon_emoji: "\uD83C\uDF00",
    category: "dosha",
    requirement_description: "Score within 10% on all three doshas in the quiz",
    is_rare: true,
  },
  {
    slug: "herb-explorer",
    name: "Herb Explorer",
    description: "Saved 5 herbs to your profile",
    icon_emoji: "\uD83C\uDF3F",
    category: "dosha",
    requirement_description: "Add 5 herbs to your preferred herbs list",
    is_rare: false,
  },
  {
    slug: "early-adopter",
    name: "Early Adopter",
    description: "One of the first to join AyurWell",
    icon_emoji: "\uD83C\uDF1F",
    category: "special",
    requirement_description: "Create an account during the early access period",
    is_rare: true,
  },
  {
    slug: "night-owl",
    name: "Night Owl",
    description: "Logged wellness after 10pm",
    icon_emoji: "\uD83E\uDD89",
    category: "special",
    requirement_description: "Submit a wellness log after 10:00 PM",
    is_rare: false,
  },
  {
    slug: "dawn-riser",
    name: "Dawn Riser",
    description: "Logged wellness before 7am",
    icon_emoji: "\uD83C\uDF05",
    category: "special",
    requirement_description: "Submit a wellness log before 7:00 AM",
    is_rare: false,
  },
  {
    slug: "coach-user",
    name: "Wisdom Seeker",
    description: "Had your first conversation with Vaidya",
    icon_emoji: "\uD83E\uDD16",
    category: "special",
    requirement_description: "Send your first message to the AI Wellness Coach",
    is_rare: false,
  },
  {
    slug: "tour-complete",
    name: "Orientation Complete",
    description: "Completed the onboarding tour",
    icon_emoji: "\uD83C\uDF93",
    category: "special",
    requirement_description: "Complete the AyurWell onboarding tour",
    is_rare: false,
  },
];

const Achievements = () => {
  const { token } = useAuth();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Achievements — AyurWell";

    const fetchProfile = async () => {
      try {
        if (!token) throw new Error("No token");
        const res = await fetch(`${API_BASE_URL}/api/gamification/profile/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        
        if (data.badges) {
          processBadges(data.badges);
        }
        if (data.streak) {
          setStreak(data.streak);
        }
      } catch (err) {
        const earnedSlugs: string[] = JSON.parse(localStorage.getItem("badges") || "[]");
        const localStreakCount = parseInt(localStorage.getItem("streak") || "0", 10);
        
        const mappedBadges: BadgeData[] = BADGES_CONSTANT.map((b) => ({
          ...b,
          earned: earnedSlugs.includes(b.slug),
          earned_at: earnedSlugs.includes(b.slug) ? format(new Date(), "yyyy-MM-dd") : null,
        }));

        processBadges(mappedBadges);
        setStreak({
          current: localStreakCount,
          longest: localStreakCount,
          total_logs: localStreakCount,
          logged_today: false,
        });
      } finally {
        setLoading(false);
      }
    };

    const processBadges = (badgeList: BadgeData[]) => {
      const earnedSlugs = badgeList.filter((b) => b.earned).map((b) => b.slug);
      const seenStr = localStorage.getItem("seen_badges");
      
      if (seenStr) {
        const seenSet = new Set<string>(JSON.parse(seenStr));
        const newEarned = earnedSlugs.filter((slug) => !seenSet.has(slug));
        if (newEarned.length > 0) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#2D6A4F", "#52B788", "#E9C46A", "#F4A261"],
          });
        }
      } else if (earnedSlugs.length > 0) {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2D6A4F", "#52B788", "#E9C46A"],
        });
      }
      
      localStorage.setItem("seen_badges", JSON.stringify(earnedSlugs));
      setBadges(badgeList);
    };

    fetchProfile();
  }, [token]);

  const filtered = category === "all" ? badges : badges.filter((b) => b.category === category);
  const earned = badges.filter((b) => b.earned).length;
  const total = BADGES_CONSTANT.length;

  return (
    <div className="page-enter min-h-screen bg-[#FEFAE0] dark:bg-zinc-950 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-zinc-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-primary dark:text-primary-light">
              Achievements & Badges
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              {earned} of {total} badges unlocked
            </p>
          </div>
        </div>

        {/* Stats Row */}
        {streak && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
            {[
              { label: "Current Streak", value: `${streak.current}d`, icon: "\uD83D\uDD25" },
              { label: "Longest Streak", value: `${streak.longest}d`, icon: "\u26A1" },
              { label: "Badges Earned", value: `${earned}/${total}`, icon: "\uD83C\uDFC6" },
              { label: "Total Logs", value: streak.total_logs, icon: "\uD83D\uDCC4" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-4 text-center rounded-2xl shadow-xs"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white font-display">
                  {s.value}
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 rounded-2xl mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Wellness Journey Progress
            </span>
            <span className="text-sm font-extrabold text-primary dark:text-primary-light">
              {Math.round((earned / Math.max(total, 1)) * 100)}% Completed
            </span>
          </div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-700"
              style={{ width: `${(earned / Math.max(total, 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              category === "all"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-primary/40"
            }`}
          >
            All Badges
          </button>
          {Object.entries(CATEGORY_LABELS)
            .filter(([k]) => k !== "all")
            .map(([k, v]) => (
              <button
                key={k}
                onClick={() => setCategory(k)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  category === k
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-primary/40"
                }`}
              >
                {v}
              </button>
            ))}
        </div>

        {/* Badge Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 h-36 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((badge) => (
              <div
                key={badge.slug}
                className={`relative rounded-2xl p-5 flex flex-col items-center text-center gap-3 border-2 transition-all duration-300 ${
                  badge.earned
                    ? "border-amber-200 bg-amber-50/30 dark:bg-amber-950/15 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 opacity-60 grayscale"
                }`}
              >
                {/* Lock icon for unearned */}
                {!badge.earned && (
                  <div className="absolute top-2.5 right-2.5 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-full">
                    <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                )}

                {/* Emoji Icon */}
                <div className={`text-4xl select-none ${!badge.earned ? "opacity-50" : ""}`}>
                  {badge.icon_emoji}
                </div>

                {/* Name & Rarity */}
                <div>
                  <p className={`text-xs font-bold leading-tight ${badge.earned ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
                    {badge.name}
                  </p>
                  {badge.is_rare && badge.earned && (
                    <span className="inline-block mt-1 text-[9px] font-extrabold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Rare
                    </span>
                  )}
                </div>

                {/* Description or Requirement */}
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-snug font-medium max-w-[150px]">
                  {badge.earned ? badge.description : badge.requirement_description}
                </p>

                {/* Earned Date Tag */}
                {badge.earned && badge.earned_at && (
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
                    Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <div className="text-4xl mb-3">\uD83E\uDDE9</div>
            <p className="text-zinc-400 dark:text-zinc-500 font-semibold">
              No badges unlocked in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
