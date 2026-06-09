import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Sun, Sunrise, Moon } from "lucide-react";

type Ritual = { id: string; title: string; desc: string; completed: boolean; time: "morning" | "afternoon" | "evening" };

const defaultRituals: Ritual[] = [
  { id: "1", title: "Wake up early (Brahma Muhurta)", desc: "Rise before the sun to harness the day's fresh energy.", completed: false, time: "morning" },
  { id: "2", title: "Tongue Scraping", desc: "Remove toxins (ama) accumulated overnight using a copper scraper.", completed: false, time: "morning" },
  { id: "3", title: "Warm Lemon Water", desc: "Kickstart digestion and flush the GI tract with warm water and a squeeze of lemon.", completed: false, time: "morning" },
  { id: "4", title: "Mindful Lunch", desc: "Eat your largest meal when digestive fire (agni) is strongest.", completed: false, time: "afternoon" },
  { id: "5", title: "Light Dinner", desc: "Have a light, easily digestible meal at least 2 hours before bed.", completed: false, time: "evening" },
  { id: "6", title: "Digital Detox", desc: "Turn off screens 1 hour before sleep to prepare the mind for rest.", completed: false, time: "evening" },
];

export default function DailyRituals() {
  const [rituals, setRituals] = useState<Ritual[]>([]);

  useEffect(() => {
    document.title = "Daily Rituals - AyurWell";
    const saved = localStorage.getItem("ayurwell_rituals");
    if (saved) {
      setRituals(JSON.parse(saved));
    } else {
      setRituals(defaultRituals);
    }
  }, []);

  const toggleRitual = (id: string) => {
    const next = rituals.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    setRituals(next);
    localStorage.setItem("ayurwell_rituals", JSON.stringify(next));
  };

  const renderSection = (time: "morning" | "afternoon" | "evening", title: string, icon: React.ReactNode) => {
    const items = rituals.filter(r => r.time === time);
    return (
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary mb-4 border-b border-primary/10 pb-2">
          {icon} {title}
        </h2>
        <div className="space-y-3">
          {items.map(r => (
            <div 
              key={r.id} 
              onClick={() => toggleRitual(r.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                r.completed 
                  ? "bg-primary/5 border-primary/20 opacity-75" 
                  : "bg-surface-bright dark:bg-[#1c1c2e] border-outline-variant/20 dark:border-white/10 hover:border-primary/40 shadow-sm"
              }`}
            >
              <button className={`mt-0.5 shrink-0 ${r.completed ? "text-primary" : "text-gray-400"}`}>
                {r.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              <div>
                <h3 className={`font-semibold ${r.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>
                  {r.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const progress = Math.round((rituals.filter(r => r.completed).length / rituals.length) * 100) || 0;

  return (
    <div className="page-enter min-h-screen bg-surface dark:bg-[#12121e] text-on-surface pt-[100px] pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Daily Rituals (Dinacharya)</h1>
          <p className="text-on-surface-variant mt-2 max-w-xl">
            Align with nature's rhythms to balance your dosha and build vibrant health.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Daily Progress</div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c1c2e] rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 dark:border-white/10">
        {renderSection("morning", "Morning Routine", <Sunrise className="w-5 h-5 text-amber-500" />)}
        {renderSection("afternoon", "Afternoon Routine", <Sun className="w-5 h-5 text-orange-500" />)}
        {renderSection("evening", "Evening Routine", <Moon className="w-5 h-5 text-blue-500" />)}
      </div>

      <div className="mt-8 text-center">
        <Link to="/dashboard" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
