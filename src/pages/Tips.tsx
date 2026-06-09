import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";

/* -- Types ----------------------------------------------------- */
interface Tip {
  id: number;
  season: string;
  dosha: string;
  category: string;
  tip_text: string;
  source: string;
}

/* -- Helpers --------------------------------------------------- */
const SEASON_EMOJIS: Record<string, string> = { spring: "??", summer: "??", autumn: "??", winter: "??" };
const CATEGORY_COLORS: Record<string, string> = {
  diet: "bg-green-100 text-green-700 border-green-200",
  lifestyle: "bg-blue-100 text-blue-700 border-blue-200",
  yoga: "bg-purple-100 text-purple-700 border-purple-200",
  herbs: "bg-amber-100 text-amber-700 border-amber-200",
};
const DOSHA_COLORS: Record<string, string> = {
  vata: "text-dosha-vata", pitta: "text-dosha-pitta", kapha: "text-dosha-kapha", all: "text-primary",
};

const getSavedTips = (): number[] => {
  try { return JSON.parse(localStorage.getItem("saved_tips") || "[]"); } catch { return []; }
};
const toggleSavedTip = (id: number): number[] => {
  const saved = getSavedTips();
  const updated = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
  localStorage.setItem("saved_tips", JSON.stringify(updated));
  return updated;
};

const getCurrentSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m <= 2 || m === 12) return "winter";
  if (m <= 5) return "spring";
  if (m <= 8) return "summer";
  return "autumn";
};

/* -- Tip Card -------------------------------------------------- */
const TipCard = ({ tip, saved, onToggleSave }: { tip: Tip; saved: boolean; onToggleSave: (id: number) => void }) => (
  <div className="ayur-card bg-[var(--color-card)] p-5 flex flex-col gap-3 group">
    <div className="flex items-start justify-between gap-2">
      <div className="flex gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[tip.category] || "bg-gray-100 text-gray-600"}`}>
          {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
        </span>
        {tip.dosha !== "all" && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 ${DOSHA_COLORS[tip.dosha] || ""}`}>
            {tip.dosha.charAt(0).toUpperCase() + tip.dosha.slice(1)}
          </span>
        )}
      </div>
      <button onClick={() => onToggleSave(tip.id)}
        className="text-text-muted hover:text-primary transition-colors flex-shrink-0 mt-0.5">
        {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
      </button>
    </div>
    <p className="text-sm leading-relaxed text-text-primary italic flex-1" style={{ fontFamily: "'Playfair Display', serif" }}>
      "{tip.tip_text}"
    </p>
    {tip.source && (
      <p className="text-xs text-text-muted border-t border-gray-100 pt-2">
        ?? Ayurvedic principle · <span className="font-medium">{tip.source}</span>
      </p>
    )}
  </div>
);

/* -- Dashboard Widget (exported) ------------------------------- */
export const TodaysWisdomCard = () => {
  const { token } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [savedTips, setSavedTips] = useState<number[]>(getSavedTips());

  const doshaResult = (() => {
    try { const r = localStorage.getItem("dosha_result"); return r ? JSON.parse(r) : null; } catch { return null; }
  })();
  const dosha = doshaResult?.dominant?.toLowerCase() || "";
  const season = getCurrentSeason();

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/api/tips/today/?dosha=${dosha}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (data.tips) setTips(data.tips); })
      .catch(() => {});
  }, [token, dosha]);

  useEffect(() => {
    if (paused || tips.length === 0) return;
    const t = setInterval(() => setIdx(i => (i + 1) % tips.length), 8000);
    return () => clearInterval(t);
  }, [paused, tips.length]);

  if (tips.length === 0) return null;

  const tip = tips[idx];
  const isSaved = savedTips.includes(tip.id);

  const handleToggle = (id: number) => {
    setSavedTips(toggleSavedTip(id));
  };

  return (
    <div className="ayur-card bg-[var(--color-card)] p-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary text-lg">Today's Wisdom</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm">{SEASON_EMOJIS[season]}</span>
          <span className="text-xs font-medium text-text-muted capitalize">{season}</span>
        </div>
      </div>

      <div className="animate-fade-in" key={idx}>
        <div className="flex gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[tip.category] || "bg-gray-100 text-gray-600"}`}>
            {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-text-primary italic mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          "{tip.tip_text}"
        </p>
        {tip.source && (
          <p className="text-xs text-text-muted">?? {tip.source}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex gap-1.5">
          {tips.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-primary w-4" : "bg-gray-300"}`} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIdx(i => (i - 1 + tips.length) % tips.length)}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-surface-dark transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-text-muted" />
          </button>
          <button onClick={() => setIdx(i => (i + 1) % tips.length)}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-surface-dark transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </button>
          <button onClick={() => handleToggle(tip.id)}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-surface-dark transition-colors">
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5 text-text-muted" />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -- Full Tips Page -------------------------------------------- */
const Tips = () => {
  const { token } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [season, setSeason] = useState(getCurrentSeason());
  const [dosha, setDosha] = useState("all");
  const [savedTips, setSavedTips] = useState<number[]>(getSavedTips());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Seasonal Tips — AyurWell";
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ season });
    if (dosha !== "all") params.set("dosha", dosha);
    fetch(`${API_BASE_URL}/api/tips/all/?${params}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTips(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, season, dosha]);

  const handleToggle = (id: number) => setSavedTips(toggleSavedTip(id));

  const savedTipObjects = tips.filter(t => savedTips.includes(t.id));
  const seasons = ["spring", "summer", "autumn", "winter"] as const;
  const doshas = ["all", "vata", "pitta", "kapha"] as const;

  return (
    <div className="page-transition min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Ayurvedic Wisdom</p>
          <h1 className="ayur-heading text-4xl font-bold text-text-primary mb-2">Seasonal Tips</h1>
          <p className="text-text-muted">Ancient guidance for living in harmony with nature's rhythms.</p>
        </div>

        {/* Season Tabs */}
        <div className="flex gap-2 justify-center mb-5 flex-wrap">
          {seasons.map(s => (
            <button key={s} onClick={() => setSeason(s)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                season === s ? "bg-primary text-white shadow-soft" : "bg-[var(--color-card)] border border-gray-200 text-text-muted hover:border-primary/40"
              }`}>
              {SEASON_EMOJIS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Dosha Filter */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {doshas.map(d => (
            <button key={d} onClick={() => setDosha(d)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                dosha === d
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-[var(--color-card)] border-gray-200 text-text-muted hover:border-primary/30"
              }`}>
              {d === "all" ? "All Doshas" : `${doshaEmoji(d)} ${d.charAt(0).toUpperCase() + d.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Tips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="ayur-card bg-[var(--color-card)] p-5 h-40 animate-pulse-soft">
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-4/5" />
                <div className="h-3 bg-gray-100 rounded w-3/5" />
              </div>
            ))}
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">??</div>
            <p className="text-text-muted">No tips found for this combination. Try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tips.map(tip => (
              <TipCard key={tip.id} tip={tip} saved={savedTips.includes(tip.id)} onToggleSave={handleToggle} />
            ))}
          </div>
        )}

        {/* Saved Tips */}
        {savedTipObjects.length > 0 && (
          <div className="mt-12">
            <h2 className="font-bold text-text-primary text-xl mb-5 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-primary" /> Saved Tips ({savedTipObjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedTipObjects.map(tip => (
                <TipCard key={tip.id} tip={tip} saved={true} onToggleSave={handleToggle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const doshaEmoji = (d: string) => ({ vata: "???", pitta: "??", kapha: "??" }[d] || "");

export default Tips;
