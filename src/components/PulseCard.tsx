import { useState, useEffect, useRef } from "react";
import { RefreshCw, Loader2, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { Link } from "react-router-dom";

/* -- Types ----------------------------------------------------- */
interface PulseData {
  score: number;
  grade: "Excellent" | "Good" | "Fair" | "Needs Attention";
  summary: string;
  top_strength: string;
  top_concern: string;
  today_focus: string;
  dosha_balance: "Balanced" | "Mildly Imbalanced" | "Imbalanced";
}

/* -- Helpers --------------------------------------------------- */
const getLogs = (): any[] => {
  try { return JSON.parse(localStorage.getItem("wellness_logs") || "[]"); } catch { return []; }
};

const GRADE_COLORS: Record<string, string> = {
  "Excellent": "text-green-600 bg-green-50 border-green-200",
  "Good": "text-teal-600 bg-teal-50 border-teal-200",
  "Fair": "text-amber-600 bg-amber-50 border-amber-200",
  "Needs Attention": "text-red-600 bg-red-50 border-red-200",
};

const RING_COLOR = (score: number) =>
  score >= 70 ? "#2D6A4F" : score >= 40 ? "#E9C46A" : "#E07A5F";

/* -- Animated Score Ring --------------------------------------- */
const ScoreRing = ({ score, size = 140 }: { score: number; size?: number }) => {
  const [displayed, setDisplayed] = useState(0);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (displayed / 100) * circ;
  const color = RING_COLOR(displayed);

  useEffect(() => {
    let frame: number;
    let current = 0;
    const step = () => {
      current = Math.min(score, current + Math.ceil(score / 40));
      setDisplayed(current);
      if (current < score) frame = requestAnimationFrame(step);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(step); }, 200);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [score]);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - progress}
          style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.3s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="ayur-heading font-bold leading-none" style={{ fontSize: size * 0.28, color }}>
          {displayed}
        </span>
        <span className="text-xs text-text-muted font-medium">/ 100</span>
      </div>
    </div>
  );
};

/* -- Sub Card -------------------------------------------------- */
const SubCard = ({ icon, label, text, border }: { icon: string; label: string; text: string; border: string }) => (
  <div className={`flex-1 min-w-0 p-3 rounded-xl border-l-4 ${border} bg-[var(--color-card)] shadow-soft`}>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-base">{icon}</span>
      <span className="text-xs font-bold text-text-muted uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-xs text-text-primary leading-relaxed">{text}</p>
  </div>
);

/* -- Main Component -------------------------------------------- */
const PulseCard = () => {
  const { token } = useAuth();
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const logs = getLogs();

  const fetchToday = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/pulse/today/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      if (data && data.score !== undefined) setPulse(data);
    } catch {}
    setChecked(true);
  };

  useEffect(() => { fetchToday(); }, [token]);

  const generate = async () => {
    if (!token || logs.length < 3) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pulse/generate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({
          logs: logs.slice(-7),
          dosha: (() => { try { return JSON.parse(localStorage.getItem("dosha_result") || "{}").dominant || "Unknown"; } catch { return "Unknown"; } })(),
        }),
      });
      const data = await res.json();
      if (data.score !== undefined) setPulse(data);
    } catch {}
    setLoading(false);
  };

  if (!checked) return null;

  /* -- No logs state ------------------------------------------- */
  if (logs.length < 3) return (
    <div className="ayur-card bg-[var(--color-card)] p-6 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
          <span>??</span> Today's Pulse Check
        </h3>
        <Link to="/analytics" className="text-xs text-primary hover:underline flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> View History
        </Link>
      </div>
      <div className="flex flex-col items-center py-6 text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-surface-dark flex items-center justify-center text-3xl">??</div>
        <p className="font-semibold text-text-primary">Unlock Your Pulse Check</p>
        <p className="text-sm text-text-muted max-w-xs">
          Log at least <strong>3 days</strong> of wellness data to generate your AI-powered daily health score.
        </p>
        <Link to="/analytics" className="ayur-btn-primary text-xs px-5 py-2 mt-1">
          Start Logging ?
        </Link>
      </div>
    </div>
  );

  /* -- No pulse yet -------------------------------------------- */
  if (!pulse) return (
    <div className="ayur-card bg-[var(--color-card)] p-6 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
          <span>??</span> Today's Pulse Check
        </h3>
      </div>
      <div className="flex flex-col items-center py-6 text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">??</div>
        <p className="font-semibold text-text-primary">Ready to analyze your wellness</p>
        <p className="text-sm text-text-muted max-w-xs">
          Get your AI-powered daily health score based on your last {Math.min(logs.length, 7)} days of data.
        </p>
        <button onClick={generate} disabled={loading} className="ayur-btn-primary text-xs px-6 py-2.5 mt-1">
          {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : "Generate Pulse Check"}
        </button>
      </div>
    </div>
  );

  /* -- Pulse result -------------------------------------------- */
  return (
    <div className="ayur-card bg-[var(--color-card)] p-6 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
          <span>??</span> Today's Pulse Check
        </h3>
        <div className="flex items-center gap-2">
          <Link to="/pulse" className="text-xs text-primary hover:underline flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 30-day history
          </Link>
          <button onClick={generate} disabled={loading}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-surface-dark transition-colors"
            title="Regenerate">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <RefreshCw className="w-3.5 h-3.5 text-text-muted" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-5">
        <ScoreRing score={pulse.score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${GRADE_COLORS[pulse.grade]}`}>
              {pulse.grade}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              pulse.dosha_balance === "Balanced" ? "bg-green-50 text-green-700 border-green-200" :
              pulse.dosha_balance === "Mildly Imbalanced" ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-red-50 text-red-700 border-red-200"
            }`}>
              {pulse.dosha_balance === "Balanced" ? "??" : "??"} {pulse.dosha_balance}
            </span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{pulse.summary}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SubCard icon="?" label="Strength" text={pulse.top_strength} border="border-green-400" />
        <SubCard icon="??" label="Concern" text={pulse.top_concern} border="border-amber-400" />
        <SubCard icon="??" label="Today's Focus" text={pulse.today_focus} border="border-primary" />
      </div>
    </div>
  );
};

export default PulseCard;
