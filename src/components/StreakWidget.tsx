import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { format } from "date-fns";

interface StreakData {
  current: number;
  longest: number;
  total_logs: number;
  last_log_date: string | null;
  next_milestone: number | null;
  logged_today: boolean;
}

const getLogs = (): any[] => {
  try {
    const l = localStorage.getItem("wellness_logs");
    return l ? JSON.parse(l) : [];
  } catch {
    return [];
  }
};

const getLocalStreak = (): number => {
  try {
    const s = localStorage.getItem("streak");
    return s ? parseInt(s, 10) : 0;
  } catch {
    return 0;
  }
};

const StreakWidget = () => {
  const { token, isAuthenticated } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [localLogs, setLocalLogs] = useState<any[]>([]);

  useEffect(() => {
    setLocalLogs(getLogs());
  }, []);

  useEffect(() => {
    // Listen for log saves
    const handleStorageChange = () => {
      setLocalLogs(getLogs());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!token) {
      // Offline / Local fallback
      const localStreakCount = getLocalStreak();
      const logsList = getLogs();
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const todayMMM = format(new Date(), "MMM d");
      
      const loggedToday = logsList.some(
        (log) => log && (log.date === todayStr || log.date === todayMMM || (log.ts && new Date(log.ts).toDateString() === new Date().toDateString()))
      );

      setStreak({
        current: localStreakCount || (loggedToday ? 1 : 0),
        longest: Math.max(localStreakCount, loggedToday ? 1 : 0),
        total_logs: logsList.length,
        last_log_date: logsList.length > 0 ? todayStr : null,
        next_milestone: 7,
        logged_today: loggedToday,
      });
      return;
    }

    fetch(`${API_BASE_URL}/api/gamification/profile/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.streak) {
          setStreak(d.streak);
        }
      })
      .catch(() => {
        // Fallback to local
        const localStreakCount = getLocalStreak();
        const logsList = getLogs();
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const todayMMM = format(new Date(), "MMM d");
        const loggedToday = logsList.some(
          (log) => log && (log.date === todayStr || log.date === todayMMM || (log.ts && new Date(log.ts).toDateString() === new Date().toDateString()))
        );

        setStreak({
          current: localStreakCount,
          longest: localStreakCount,
          total_logs: logsList.length,
          last_log_date: logsList.length > 0 ? todayStr : null,
          next_milestone: 7,
          logged_today: loggedToday,
        });
      });
  }, [token, localLogs.length]);

  const getLast7Days = () => {
    const list = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().split("T")[0];
      return {
        date: iso,
        dayLetter: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()],
        logged: false,
      };
    });

    // Check logged status against local logs and API status
    list.forEach((day, index) => {
      const d = new Date(day.date);
      const isLocalLogged = localLogs.some((log) => {
        if (!log) return false;
        if (log.date === day.date) return true;
        const formattedMMM = format(d, "MMM d");
        if (log.date === formattedMMM) return true;
        if (log.ts) return new Date(log.ts).toDateString() === d.toDateString();
        return false;
      });

      let isBackendLogged = false;
      if (streak) {
        const daysAgo = 6 - index;
        isBackendLogged = streak.logged_today
          ? daysAgo < streak.current
          : (daysAgo > 0 && (daysAgo - 1) < streak.current);
      }

      day.logged = isLocalLogged || isBackendLogged;
    });

    return list;
  };

  const days = getLast7Days();
  const currentStreak = streak ? streak.current : 0;
  const todayLogged = streak ? streak.logged_today : false;

  return (
    <div className="ayur-card bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-4 rounded-3xl shadow-sm flex flex-col gap-3.5 relative overflow-hidden">
      {/* Sparkle background decoration */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-bounce">🔥</span>
          <span className="font-bold text-zinc-900 dark:text-white text-base">
            {currentStreak} Day Streak!
          </span>
        </div>

        {!todayLogged && (
          <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-2xs font-bold text-amber-800 dark:text-amber-300 animate-pulse border border-amber-200 dark:border-amber-900/50">
            Log today!
          </span>
        )}
      </div>

      {/* 7 circles row */}
      <div className="grid grid-cols-7 gap-1.5 justify-items-center z-10">
        {days.map((d, i) => {
          const isToday = i === 6;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 w-full">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-2xs font-bold transition-all ${
                  d.logged
                    ? "bg-gradient-primary text-white shadow-soft font-bold scale-105"
                    : isToday
                    ? "border-2 border-primary/40 text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/10"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                }`}
                title={d.date}
              >
                {d.logged ? "✓" : isToday ? "·" : d.dayLetter}
              </div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
                {d.dayLetter}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakWidget;
