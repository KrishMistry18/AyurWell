import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const GRADE_COLORS: Record<string, string> = {
  Excellent: "text-green-600 bg-green-50 border-green-200",
  Good: "text-teal-600 bg-teal-50 border-teal-200",
  Fair: "text-amber-600 bg-amber-50 border-amber-200",
  "Needs Attention": "text-red-600 bg-red-50 border-red-200",
};

const GRADE_EMOJI: Record<string, string> = {
  Excellent: "??",
  Good: "?",
  Fair: "?",
  "Needs Attention": "??",
};

type Report = {
  id: number;
  week_start: string;
  week_end: string;
  grade: string;
  avg_score: number;
  ai_insights: string[];
  generated_at: string;
};

const Reports = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Weekly Reports — AyurWell";
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/api/reports/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setReports(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const getUserDosha = () => {
    try {
      const r = localStorage.getItem("dosha_result");
      if (!r) return "vata";
      const p = JSON.parse(r);
      return (p.dominant || "vata").toLowerCase();
    } catch { return "vata"; }
  };

  const handleGenerate = async () => {
    if (!token) return;
    setGenerating(true);
    try {
      const logs = JSON.parse(localStorage.getItem("wellness_logs") || "[]");
      const dosha = getUserDosha();
      const res = await fetch(`${API_BASE_URL}/api/reports/generate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ logs, dosha }),
      });
      const data = await res.json();
      if (res.ok) {
        setReports(prev => {
          const filtered = prev.filter(r => r.week_start !== data.week_start);
          return [data, ...filtered];
        });
        toast.success("Weekly report generated! ??");
      } else {
        toast.error(data.detail || "Failed to generate report.");
      }
    } catch {
      toast.error("Failed to generate report. Please try again.");
    }
    setGenerating(false);
  };

  const handleDownload = async (reportId: number, weekStart: string) => {
    if (!token) return;
    setDownloading(reportId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/${reportId}/download/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AyurWell-Report-${weekStart}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    }
    setDownloading(null);
  };

  const formatWeek = (start: string, end: string) => {
    try {
      return `${format(parseISO(start), "MMM d")} – ${format(parseISO(end), "MMM d, yyyy")}`;
    } catch { return `${start} – ${end}`; }
  };

  return (
    <div className="page-transition min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="ayur-heading text-3xl font-bold text-text-primary">Weekly Reports</h1>
            <p className="text-text-muted text-sm">AI-powered wellness insights delivered weekly</p>
          </div>
        </div>

        {/* Generate button */}
        <div className="ayur-card bg-[var(--color-card)] p-5 mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-text-primary">Generate This Week's Report</h3>
            <p className="text-sm text-text-muted mt-0.5">Analyze your wellness logs and get AI insights</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="ayur-btn-primary flex-shrink-0 flex items-center gap-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate
              </>
            )}
          </button>
        </div>

        {/* Reports list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="ayur-card bg-[var(--color-card)] p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-100 rounded w-40" />
                  <div className="h-6 bg-gray-100 rounded w-20" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">??</div>
            <h3 className="font-bold text-text-primary text-lg mb-2">No reports yet</h3>
            <p className="text-text-muted text-sm mb-6">Generate your first weekly wellness report to see AI-powered insights.</p>
            <button onClick={handleGenerate} disabled={generating} className="ayur-btn-primary">
              <Sparkles className="w-4 h-4 mr-2" /> Generate First Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, idx) => (
              <div key={report.id} className="ayur-card bg-[var(--color-card)] p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-bold text-text-primary text-sm">
                        Week of {formatWeek(report.week_start, report.week_end)}
                      </span>
                      {idx === 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Latest</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${GRADE_COLORS[report.grade] || ""}`}>
                        {GRADE_EMOJI[report.grade]} {report.grade}
                      </span>
                      <span className="text-xs text-text-muted">Score: {Math.round(report.avg_score)}/100</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(report.id, report.week_start)}
                    disabled={downloading === report.id}
                    className="flex items-center gap-1.5 text-sm text-primary border border-primary/30 rounded-xl px-3 py-2 hover:bg-primary/5 transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    {downloading === report.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    PDF
                  </button>
                </div>

                {/* AI Insights preview */}
                {report.ai_insights && report.ai_insights.length > 0 && (
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">AI Insights</p>
                    {report.ai_insights.slice(0, 3).map((insight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-primary text-xs mt-0.5">?</span>
                        <p className="text-xs text-text-muted leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-text-muted mt-3">
                  Generated {format(parseISO(report.generated_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
