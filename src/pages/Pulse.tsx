import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GRADE_COLORS: Record<string, string> = {
  "Excellent": "text-green-600 bg-green-50 border-green-200",
  "Good": "text-teal-600 bg-teal-50 border-teal-200",
  "Fair": "text-amber-600 bg-amber-50 border-amber-200",
  "Needs Attention": "text-red-600 bg-red-50 border-red-200",
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = payload.score >= 70 ? "#2D6A4F" : payload.score >= 40 ? "#E9C46A" : "#E07A5F";
  return <circle cx={cx} cy={cy} r={5} fill={color} stroke="white" strokeWidth={2} />;
};

const Pulse = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Pulse History — AyurWell";
    if (!token) return;
    fetch(`${API_BASE_URL}/api/pulse/history/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const avg = history.length
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : 0;

  const best = history.length ? Math.max(...history.map(h => h.score)) : 0;

  return (
    <div className="page-transition min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="ayur-heading text-3xl font-bold text-text-primary">Pulse History</h1>
            <p className="text-text-muted text-sm">Your 30-day wellness score trend</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Average Score", value: avg || "—", icon: "??" },
            { label: "Best Score", value: best || "—", icon: "??" },
            { label: "Days Tracked", value: history.length, icon: "??" },
          ].map(s => (
            <div key={s.label} className="ayur-card bg-[var(--color-card)] p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-text-primary ayur-heading">{s.value}</div>
              <div className="text-xs text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="ayur-card bg-[var(--color-card)] p-6 mb-6">
          <h3 className="font-bold text-text-primary mb-4">Score Trend</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-text-muted text-sm animate-pulse-soft">Loading...</div>
            </div>
          ) : history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="text-4xl">??</div>
              <p className="text-text-muted text-sm">No pulse checks yet. Generate your first from the Dashboard.</p>
              <Link to="/dashboard" className="ayur-btn-primary text-xs px-5 py-2">Go to Dashboard</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={history}>
                  <defs>
                    <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, background: "var(--color-card)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                    formatter={(v: any, _: any, p: any) => [`${v} — ${p.payload.grade}`, "Score"]}
                  />
                  <ReferenceLine y={70} stroke="#52B788" strokeDasharray="4 4"
                    label={{ value: "Good", fontSize: 10, fill: "#52B788" }} />
                  <Line type="monotone" dataKey="score" stroke="#2D6A4F" strokeWidth={2.5}
                    dot={<CustomDot />} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* History list */}
        {history.length > 0 && (
          <div className="ayur-card bg-[var(--color-card)] p-6">
            <h3 className="font-bold text-text-primary mb-4">All Checks</h3>
            <div className="space-y-2">
              {[...history].reverse().map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-text-muted">{h.date}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${GRADE_COLORS[h.grade] || ""}`}>
                      {h.grade}
                    </span>
                    <span className="font-bold text-text-primary w-8 text-right">{h.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pulse;
