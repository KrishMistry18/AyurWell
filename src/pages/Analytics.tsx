import { useEffect, useState, type CSSProperties } from "react";
import { format, subDays } from "date-fns";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { ChevronDown, ChevronUp, Bolt, Moon, Minus, Plus, Droplet, Smile, CheckCircle, Save, TrendingUp, Lightbulb, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { useChartThemeColors } from "@/hooks/useChartThemeColors";

/* ── Helpers ─────────────────────────────────────────────────── */
const getLogs = (): any[] => {
  try { return JSON.parse(localStorage.getItem("wellness_logs") || "[]"); } catch { return []; }
};
const saveLogs = (logs: any[]) => localStorage.setItem("wellness_logs", JSON.stringify(logs));

/* ── Custom Emoji Dot for Recharts Mood chart ───────────────── */
const MoodDot = (props: any) => {
  const { cx, cy, payload } = props;
  const emojis = ["", "😴", "😐", "🙂", "😄", "🤩"];
  if (cx === undefined || cy === undefined || !payload || payload.mood === null) return null;
  return (
    <text x={cx} y={cy + 5} textAnchor="middle" fontSize={16}>
      {emojis[payload.mood] || ""}
    </text>
  );
};

/* ── Main Component ──────────────────────────────────────────── */
const Analytics = () => {
  const [range, setRange] = useState<7 | 14 | 30>(7);
  const [logs, setLogs] = useState<any[]>([]);
  const [energy, setEnergy] = useState(7);
  const [sleep, setSleep] = useState(7);
  const [water, setWater] = useState(1500);
  const [mood, setMood] = useState(4);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [saved, setSaved] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();
  const { isDark } = useTheme();
  const c = useChartThemeColors();

  useEffect(() => {
    document.title = "Wellness Analytics - AyurWell";
    setLogs(getLogs());
  }, []);

  const handleSave = async () => {
    const entry = {
      date: format(new Date(), "MMM d"),
      energy, sleep, water, mood, notes,
      ts: Date.now(),
    };
    const updated = [...logs, entry];
    saveLogs(updated);
    setLogs(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setNotes("");

    // Gamification and API syncing would be handled here in the future
    // using Firebase instead of the legacy Django endpoints.
    toast({
      title: "Wellness Logged",
      description: "Your stats have been saved for today.",
    });
  };

  const chartData = Array.from({ length: range }, (_, i) => {
    const d = format(subDays(new Date(), range - 1 - i), "MMM d");
    const log = logs.find((l) => l.date === d);
    return { 
      date: d, 
      energy: log?.energy ?? log?.energy_level ?? null, 
      sleep: log?.sleep ?? log?.sleep_hours ?? null, 
      water: log?.water ?? log?.water_intake_ml ?? null, 
      mood: log?.mood ?? null 
    };
  });

  // Calculate dynamic stats based on chart data (current range)
  const activeEnergyLogs = chartData.filter((d) => d.energy !== null);
  const rangeAvgEnergy = activeEnergyLogs.length
    ? (activeEnergyLogs.reduce((s, l) => s + (l.energy || 0), 0) / activeEnergyLogs.length).toFixed(1)
    : "N/A";

  const activeSleepLogs = chartData.filter((d) => d.sleep !== null);
  const avgSleepRaw = activeSleepLogs.length
    ? activeSleepLogs.reduce((s, l) => s + (l.sleep || 0), 0) / activeSleepLogs.length
    : 0;
  const avgSleepHrs = Math.floor(avgSleepRaw);
  const avgSleepMins = Math.round((avgSleepRaw - avgSleepHrs) * 60);
  const avgSleepStr = activeSleepLogs.length ? `${avgSleepHrs}h ${avgSleepMins}m` : "N/A";

  const activeWaterLogs = chartData.filter((d) => d.water !== null);
  const avgWater = activeWaterLogs.length
    ? Math.round(activeWaterLogs.reduce((s, l) => s + (l.water || 0), 0) / activeWaterLogs.length)
    : null;
  const avgWaterStr = avgWater !== null ? `${avgWater}ml` : "N/A";

  const activeMoodLogs = chartData.filter((d) => d.mood !== null);
  const avgMood = activeMoodLogs.length
    ? activeMoodLogs.reduce((s, l) => s + (l.mood || 0), 0) / activeMoodLogs.length
    : null;
  let moodText = "N/A";
  if (avgMood !== null) {
    if (avgMood <= 2) moodText = "Restless / Low";
    else if (avgMood <= 3.5) moodText = "Neutral / Stable";
    else if (avgMood <= 4.5) moodText = "Mostly Positive";
    else moodText = "Joyful / Radiant";
  }

  const moodEmojis = ["😴", "😐", "🙂", "😄", "🤩"];

  return (
    <div className="page-enter min-h-screen bg-surface dark:bg-[#12121e] text-on-surface relative overflow-hidden flex flex-col">
      <style>{`
        .custom-range-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        .custom-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2D6A4F;
          cursor: pointer;
          margin-top: -8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .custom-range-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #bfc9c1;
          border-radius: 2px;
        }
        .dark .custom-range-slider::-webkit-slider-runnable-track {
          background: #404943;
        }
        .dark .custom-range-slider::-webkit-slider-thumb {
          background: #52B788;
        }
      `}</style>

      {/* Ambient backgrounds */}
      <div className="grain-overlay opacity-[0.03] dark:opacity-[0.015]" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: "radial-gradient(#0f5238 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <main className="flex-grow pt-[120px] pb-[80px] px-4 md:px-16 max-w-[1280px] mx-auto w-full flex flex-col gap-12 relative z-10">
        
        {/* -- LOG FORM CARD ------------------------------------- */}
        <section className="bg-surface-bright dark:bg-[#1c1c2e] rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(45,106,79,0.05)] border border-outline-variant/20 dark:border-white/10 relative overflow-hidden">
          {/* Decorative blur blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline-lg text-headline-lg text-primary dark:text-primary-light font-bold">Log Today's Wellness</h2>
            <span className="text-sm text-outline dark:text-gray-400 font-label-md">{format(new Date(), "EEEE, MMMM d")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Energy Slider */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-gray-300 flex items-center gap-2">
                  <Bolt className="w-5 h-5 text-amber-500" />
                  Prana (Energy)
                </label>
                <span className="font-body-md text-body-md text-primary dark:text-primary-light font-medium">{energy}/10</span>
              </div>
              <input
                className="custom-range-slider w-full mt-2"
                max="10"
                min="1"
                type="range"
                value={energy}
                onChange={(e) => setEnergy(+e.target.value)}
              />
              <div className="flex justify-between font-caption text-caption text-outline dark:text-gray-400">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Sleep Input */}
            <div className="flex flex-col gap-4">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-gray-300 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500" />
                Nidra (Sleep)
              </label>
              <div className="flex items-center justify-between bg-surface-container-lowest dark:bg-[#121226] border border-outline-variant/40 dark:border-white/10 rounded-full p-1 mt-1">
                <button
                  onClick={() => setSleep(Math.max(0, sleep - 0.5))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-[#25253c] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-body-lg text-body-lg text-primary dark:text-primary-light font-medium">{sleep}h</span>
                <button
                  onClick={() => setSleep(Math.min(12, sleep + 0.5))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-[#25253c] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Water Input */}
            <div className="flex flex-col gap-4">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-gray-300 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                Jala (Hydration)
              </label>
              <div className="flex items-center justify-between bg-surface-container-lowest dark:bg-[#121226] border border-outline-variant/40 dark:border-white/10 rounded-full p-1 mt-1">
                <button
                  onClick={() => setWater(Math.max(0, water - 250))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-[#25253c] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-body-lg text-body-lg text-primary dark:text-primary-light font-medium">{water}ml</span>
                <button
                  onClick={() => setWater(Math.min(5000, water + 250))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-[#25253c] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="flex flex-col gap-4">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-gray-300 flex items-center gap-2">
                <Smile className="w-5 h-5 text-emerald-500" />
                Bhavana (Mood)
              </label>
              <div className="flex justify-between items-center mt-1 px-2">
                {moodEmojis.map((e, i) => {
                  const isSelected = mood === i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setMood(i + 1)}
                      className={
                        isSelected
                          ? "text-2xl bg-primary-container text-on-primary-container dark:bg-primary dark:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transform scale-110 transition-all duration-200"
                          : "text-2xl opacity-40 hover:opacity-100 transition-opacity transform hover:scale-110 duration-200"
                      }
                    >
                      {e}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes Input toggler */}
          <div className="mt-6 pt-4 border-t border-outline-variant/20 dark:border-white/10">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs text-primary dark:text-primary-light flex items-center gap-1 hover:underline font-label-md"
            >
              {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showNotes ? "Hide Notes" : "Add Notes +"}
            </button>
            
            {showNotes && (
              <div className="mt-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling today? Any observations on your Prana, Nidra, Jala, or Bhavana..."
                  rows={3}
                  className="w-full rounded-xl border border-outline-variant/40 dark:border-white/10 p-3 text-sm text-on-surface dark:text-white bg-surface-container-lowest dark:bg-[#121226] placeholder:text-outline outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-none"
                />
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className={`ayur-btn-primary text-sm px-8 py-2.5 flex items-center gap-2 ${
                saved ? "!bg-green-600 !text-white" : ""
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </section>

        {/* -- YOUR WELLNESS TRENDS CHARTS Bento Grid ---------------- */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-headline-lg text-headline-lg text-primary dark:text-primary-light font-bold">Your Wellness Trends</h2>
            
            {/* Date Pills */}
            <div className="flex bg-surface-container-low dark:bg-[#1a1a2e] rounded-full p-1 border border-outline-variant/20 dark:border-white/10">
              {([7, 14, 30] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all duration-200 ${
                    range === r
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white"
                  }`}
                >
                  {r} Days
                </button>
              ))}
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="bg-surface-container-lowest dark:bg-[#1c1c2e] border border-outline-variant/20 dark:border-white/10 rounded-2xl p-12 text-center shadow-[0_4px_24px_0_rgba(45,106,79,0.03)]">
              <div className="text-5xl mb-4">📊</div>
              <h4 className="font-headline-md text-headline-md text-primary dark:text-primary-light mb-2">No Data Yet</h4>
              <p className="text-body-md text-on-surface-variant dark:text-gray-400 max-w-md mx-auto">
                Log your first wellness entry above to see beautiful Ayurvedic insights and charts here.
              </p>
            </div>
          ) : (
            <div key={isDark ? "dark-charts" : "light-charts"} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Energy Flow (Area Chart) */}
              <div className="bg-surface-container-lowest dark:bg-[#1c1c2e] rounded-2xl p-6 shadow-[0_4px_24px_0_rgba(45,106,79,0.03)] border border-outline-variant/10 dark:border-white/10 flex flex-col group hover:shadow-[0_8px_32px_0_rgba(45,106,79,0.08)] transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider">Energy Flow (Prana)</h3>
                    <p className="font-headline-md text-headline-md text-primary dark:text-primary-light mt-1">Avg {rangeAvgEnergy}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  </div>
                </div>

                <div className="h-48 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`energyGrad-${isDark}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c.primary} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={c.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: c.muted }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: c.muted }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: c.card, border: `1px solid ${c.border}`, color: c.text }} />
                      {rangeAvgEnergy !== "N/A" && (
                        <ReferenceLine
                          y={+rangeAvgEnergy}
                          stroke={c.primaryLight}
                          strokeDasharray="4 4"
                          label={{ value: `avg ${rangeAvgEnergy}`, fontSize: 10, fill: c.primaryLight, position: "top" }}
                        />
                      )}
                      <Area type="monotone" dataKey="energy" stroke={c.primary} strokeWidth={2} fill={`url(#energyGrad-${isDark})`} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Restorative Sleep (Bar Chart) */}
              <div className="bg-surface-container-lowest dark:bg-[#1c1c2e] rounded-2xl p-6 shadow-[0_4px_24px_0_rgba(45,106,79,0.03)] border border-outline-variant/10 dark:border-white/10 flex flex-col group hover:shadow-[0_8px_32px_0_rgba(45,106,79,0.08)] transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider">Restorative Sleep (Nidra)</h3>
                    <p className="font-headline-md text-headline-md text-tertiary dark:text-primary-light mt-1">Avg {avgSleepStr}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-tertiary" />
                  </div>
                </div>

                <div className="h-48 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: c.muted }} />
                      <YAxis domain={[0, 12]} tick={{ fontSize: 10, fill: c.muted }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: c.card, border: `1px solid ${c.border}`, color: c.text }} />
                      <Bar dataKey="sleep" radius={[4, 4, 0, 0]}>
                        {chartData.map((d, i) => (
                          <Cell
                            key={i}
                            fill={!d.sleep ? c.emptyBar : d.sleep < 6 ? c.doshaPitta : d.sleep < 7 ? c.accent : c.primary}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hydration Levels (Area Chart) */}
              <div className="bg-surface-container-lowest dark:bg-[#1c1c2e] rounded-2xl p-6 shadow-[0_4px_24px_0_rgba(45,106,79,0.03)] border border-outline-variant/10 dark:border-white/10 flex flex-col group hover:shadow-[0_8px_32px_0_rgba(45,106,79,0.08)] transition-all duration-300 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider">Hydration Levels (Jala)</h3>
                    <p className="font-headline-md text-headline-md text-primary dark:text-primary-light mt-1">Avg {avgWaterStr}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="h-48 w-full mt-auto relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`waterGrad-${isDark}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c.accent} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: c.muted }} />
                      <YAxis tick={{ fontSize: 10, fill: c.muted }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: c.card, border: `1px solid ${c.border}`, color: c.text }} />
                      <ReferenceLine
                        y={2000}
                        stroke={c.accentDark}
                        strokeDasharray="4 4"
                        label={{ value: "Goal 2L", fontSize: 10, fill: c.accentDark, position: "top" }}
                      />
                      <Area type="monotone" dataKey="water" stroke={c.accent} strokeWidth={2} fill={`url(#waterGrad-${isDark})`} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Emotional State (Line Chart with MoodEmojis) */}
              <div className="bg-surface-container-lowest dark:bg-[#1c1c2e] rounded-2xl p-6 shadow-[0_4px_24px_0_rgba(45,106,79,0.03)] border border-outline-variant/10 dark:border-white/10 flex flex-col group hover:shadow-[0_8px_32px_0_rgba(45,106,79,0.08)] transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface-variant dark:text-gray-400 uppercase tracking-wider">Emotional State (Bhavana)</h3>
                    <p className="font-headline-md text-headline-md text-secondary dark:text-accent mt-1">{moodText}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                    <Smile className="w-5 h-5 text-secondary" />
                  </div>
                </div>

                <div className="h-48 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={c.border} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: c.muted }} />
                      <YAxis domain={[0, 6]} tick={{ fontSize: 10, fill: c.muted }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: c.card, border: `1px solid ${c.border}`, color: c.text }} />
                      <Line type="monotone" dataKey="mood" stroke={c.doshaVata} strokeWidth={2} dot={<MoodDot />} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}
        </section>

        {/* -- AI INSIGHTS SECTION --------------------------------- */}
        <section className="flex flex-col gap-6">
          <h2 className="font-headline-lg text-headline-lg text-primary dark:text-primary-light font-bold flex items-center gap-3">
            🌿 AI Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Insight Card 1 */}
            <div className="bg-surface-bright dark:bg-[#1c1c2e] border-l-4 border-secondary rounded-r-2xl rounded-l-md p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/10 dark:bg-secondary/20 rounded-full text-secondary dark:text-accent flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-secondary dark:text-accent font-semibold mb-2">Energy Correlation</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
                    Your energy peaks significantly after 8 hours of sleep. Try to maintain this restorative routine for sustained vitality.
                  </p>
                </div>
              </div>
            </div>

            {/* Insight Card 2 */}
            <div className="bg-surface-bright dark:bg-[#1c1c2e] border-l-4 border-primary rounded-r-2xl rounded-l-md p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-primary-light flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-primary dark:text-primary-light font-semibold mb-2">Dosha Balance</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
                    Hydration is slightly low today. Drinking 500ml of warm water will help balance your Pitta dosha and improve digestion.
                  </p>
                </div>
              </div>
            </div>

            {/* Insight Card 3 */}
            <div className="bg-surface-bright dark:bg-[#1c1c2e] border-l-4 border-tertiary rounded-r-2xl rounded-l-md p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-tertiary/10 dark:bg-tertiary/20 rounded-full text-tertiary dark:text-tertiary-fixed-dim flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-tertiary" />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-tertiary dark:text-tertiary-fixed-dim font-semibold mb-2">Mindful Progress</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
                    Consistent tracking shows a 15% improvement in your morning mood scores over the past two weeks. Keep observing your inner state.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-[#0f0f18] border-t border-outline-variant/30 dark:border-white/10 w-full py-16 px-4 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="font-headline-md text-headline-md text-primary dark:text-primary-light font-bold italic">
          AyurWell
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors hover:underline decoration-secondary underline-offset-4" href="#">Privacy Policy</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors hover:underline decoration-secondary underline-offset-4" href="#">Terms of Service</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors hover:underline decoration-secondary underline-offset-4" href="#">Ayurvedic Principles</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors hover:underline decoration-secondary underline-offset-4" href="#">Contact Us</a>
        </div>
        <div className="font-caption text-caption text-tertiary dark:text-gray-500">
          © 2026 AyurWell. Ancient Wisdom, Modern Science.
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
