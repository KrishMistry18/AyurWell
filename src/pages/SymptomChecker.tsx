import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Plus, AlertTriangle, Leaf, ChevronRight, RotateCcw, BookmarkPlus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const COMMON_SYMPTOMS = [
  "Fatigue", "Bloating", "Headache", "Anxiety", "Poor sleep",
  "Skin issues", "Digestive issues", "Joint pain", "Stress",
  "Low appetite", "Excessive thirst", "Brain fog",
];

const WISDOM_QUOTES = [
  "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.",
  "The body is your temple. Keep it pure and clean for the soul to reside in.",
  "Ayurveda is the science of life — it teaches us to live in harmony with nature.",
  "Health is not just the absence of disease, but a state of complete physical, mental, and spiritual well-being.",
  "Let food be thy medicine and medicine be thy food.",
  "The greatest medicine of all is teaching people how not to need it.",
];

const DOSHA_COLORS: Record<string, string> = {
  vata: "bg-blue-100 text-blue-800 border-blue-200",
  pitta: "bg-red-100 text-red-800 border-red-200",
  kapha: "bg-green-100 text-green-800 border-green-200",
};

const DOSHA_EMOJI: Record<string, string> = {
  vata: "???",
  pitta: "??",
  kapha: "??",
};

const SEVERITY_LABELS = ["", "Mild", "Moderate", "Noticeable", "Significant", "Severe"];

type Remedy = { remedy: string; instructions: string; frequency: string };
type AnalysisResult = {
  likely_imbalance: string;
  affected_dosha: string;
  explanation: string;
  home_remedies: Remedy[];
  herbs_to_try: string[];
  lifestyle_tips: string[];
  dietary_advice: string;
  when_to_see_doctor: string;
  disclaimer: string;
};

const SymptomChecker = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(3);
  const [affectedArea, setAffectedArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [checkedTips, setCheckedTips] = useState<boolean[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Ayurvedic Symptom Guide — AyurWell";
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (step !== 2) return;
    const interval = setInterval(() => {
      setQuoteIdx(i => (i + 1) % WISDOM_QUOTES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (result) setCheckedTips(new Array(result.lifestyle_tips.length).fill(false));
  }, [result]);

  const addSymptom = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed || symptoms.includes(trimmed)) return;
    setSymptoms(prev => [...prev, trimmed]);
    setInputVal("");
    inputRef.current?.focus();
  };

  const removeSymptom = (s: string) => setSymptoms(prev => prev.filter(x => x !== s));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSymptom(inputVal);
    }
  };

  const getUserDosha = () => {
    try {
      const r = localStorage.getItem("dosha_result");
      if (!r) return "";
      const p = JSON.parse(r);
      return (p.dominant || "").toLowerCase();
    } catch { return ""; }
  };

  const handleAnalyze = async () => {
    if (!symptoms.length || !token) return;
    setStep(2);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/symptoms/analyze/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({
          symptoms,
          duration,
          severity,
          affected_area: affectedArea,
          user_dosha: getUserDosha(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");
      setResult(data);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Analysis failed. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSymptoms([]);
    setInputVal("");
    setDuration("");
    setSeverity(3);
    setAffectedArea("");
    setResult(null);
  };

  const handleSaveJournal = () => {
    if (!result) return;
    const saved = JSON.parse(localStorage.getItem("symptom_journal") || "[]");
    saved.unshift({ date: new Date().toLocaleDateString(), symptoms, result });
    localStorage.setItem("symptom_journal", JSON.stringify(saved.slice(0, 20)));
    toast.success("Saved to your Health Journal!");
  };

  return (
    <div className="page-transition min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="ayur-heading text-3xl font-bold text-text-primary">Ayurvedic Symptom Guide</h1>
            <p className="text-text-muted text-sm">Personalized Ayurvedic insights based on your symptoms</p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> This tool provides general Ayurvedic wellness guidance only — not medical advice.
            Always consult a qualified healthcare provider for medical concerns.
          </p>
        </div>

        {/* STEP 1 — Input */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="ayur-card bg-[var(--color-card)] p-6">
              <h2 className="font-bold text-text-primary text-lg mb-4">What are you experiencing?</h2>

              {/* Tag input */}
              <div className="border border-primary/20 rounded-xl p-3 min-h-[56px] flex flex-wrap gap-2 focus-within:border-primary/50 transition-colors bg-surface/50">
                {symptoms.map(s => (
                  <span key={s} className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
                    {s}
                    <button onClick={() => removeSymptom(s)} className="hover:text-red-500 transition-colors ml-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={symptoms.length === 0 ? "Type a symptom and press Enter..." : "Add more..."}
                  className="flex-1 min-w-[160px] bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                />
                {inputVal.trim() && (
                  <button onClick={() => addSymptom(inputVal)} className="text-primary hover:text-primary-dark transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Common symptom pills */}
              <div className="mt-3">
                <p className="text-xs text-text-muted mb-2">Common symptoms — click to add:</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map(s => (
                    <button
                      key={s}
                      onClick={() => addSymptom(s)}
                      disabled={symptoms.includes(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        symptoms.includes(s)
                          ? "bg-primary/10 text-primary border-primary/30 opacity-50 cursor-default"
                          : "bg-[var(--color-card)] text-text-muted border-gray-200 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="ayur-card bg-[var(--color-card)] p-6">
              <h2 className="font-bold text-text-primary text-lg mb-3">How long have you had these symptoms?</h2>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full border-primary/20 focus:border-primary/50">
                  <SelectValue placeholder="Select duration..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Started today</SelectItem>
                  <SelectItem value="2-3 days">2–3 days</SelectItem>
                  <SelectItem value="1 week">About 1 week</SelectItem>
                  <SelectItem value="2+ weeks">2 weeks or more</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="ayur-card bg-[var(--color-card)] p-6">
              <h2 className="font-bold text-text-primary text-lg mb-1">How severe are your symptoms?</h2>
              <div className="flex justify-between text-xs text-text-muted mb-4">
                <span>Mild</span>
                <span className="font-semibold text-primary">{SEVERITY_LABELS[severity]}</span>
                <span>Severe</span>
              </div>
              <Slider
                min={1} max={5} step={1}
                value={[severity]}
                onValueChange={([v]) => setSeverity(v)}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className={`text-xs w-6 text-center ${n === severity ? "text-primary font-bold" : "text-text-muted"}`}>{n}</span>
                ))}
              </div>
            </div>

            {/* Affected area */}
            <div className="ayur-card bg-[var(--color-card)] p-6">
              <h2 className="font-bold text-text-primary text-lg mb-3">Affected area <span className="text-text-muted font-normal text-sm">(optional)</span></h2>
              <input
                value={affectedArea}
                onChange={e => setAffectedArea(e.target.value)}
                placeholder="e.g. head, stomach, joints, skin..."
                className="w-full border border-primary/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors bg-surface/50 text-text-primary placeholder:text-text-muted"
              />
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={symptoms.length === 0}
              className="ayur-btn-primary w-full justify-center py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Analyze Symptoms
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}

        {/* STEP 2 — Loading */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-24 gap-8 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">??</div>
            </div>
            <div className="text-center">
              <h2 className="ayur-heading text-2xl font-bold text-text-primary mb-2">Consulting Ayurvedic Principles...</h2>
              <p className="text-text-muted text-sm">Analyzing your symptoms through the lens of ancient wisdom</p>
            </div>
            <div className="max-w-md text-center bg-amber-50 border border-amber-100 rounded-2xl p-5 transition-all duration-500">
              <p className="text-sm text-amber-900 italic">"{WISDOM_QUOTES[quoteIdx]}"</p>
            </div>
          </div>
        )}

        {/* STEP 3 — Results */}
        {step === 3 && result && (
          <div className="space-y-5 animate-fade-in">

            {/* Imbalance card */}
            <div className="ayur-card bg-[var(--color-card)] p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${DOSHA_COLORS[result.affected_dosha] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {DOSHA_EMOJI[result.affected_dosha]} {result.affected_dosha.charAt(0).toUpperCase() + result.affected_dosha.slice(1)} Imbalance
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {symptoms.map(s => (
                    <span key={s} className="text-xs bg-surface text-text-muted px-2 py-0.5 rounded-full border border-gray-100">{s}</span>
                  ))}
                </div>
              </div>
              <h2 className="ayur-heading text-xl font-bold text-text-primary mb-2">{result.likely_imbalance}</h2>
              <p className="text-text-muted text-sm leading-relaxed">{result.explanation}</p>
            </div>

            {/* Home Remedies */}
            <div>
              <h3 className="font-bold text-text-primary text-base mb-3 flex items-center gap-2">
                <span className="text-lg">??</span> Home Remedies
              </h3>
              <div className="grid gap-3">
                {result.home_remedies.map((r, i) => (
                  <div key={i} className="ayur-card bg-[var(--color-card)] p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-text-primary mb-1">{r.remedy}</h4>
                        <p className="text-sm text-text-muted mb-2 leading-relaxed">{r.instructions}</p>
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                          ?? {r.frequency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Herbs */}
            {result.herbs_to_try.length > 0 && (
              <div className="ayur-card bg-[var(--color-card)] p-5">
                <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" /> Herbs to Try
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.herbs_to_try.map(herb => (
                    <Link
                      key={herb}
                      to="/herbs"
                      className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 transition-colors"
                    >
                      ?? {herb}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle Tips */}
            <div className="ayur-card bg-[var(--color-card)] p-5">
              <h3 className="font-bold text-text-primary mb-3">? Lifestyle Tips</h3>
              <div className="space-y-2">
                {result.lifestyle_tips.map((tip, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedTips[i] || false}
                      onChange={() => setCheckedTips(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                      className="mt-0.5 w-4 h-4 accent-primary rounded"
                    />
                    <span className={`text-sm leading-relaxed transition-all ${checkedTips[i] ? "line-through text-text-muted" : "text-text-primary"}`}>
                      {tip}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Advice */}
            <div className="ayur-card bg-[var(--color-card)] p-5">
              <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                <span>??</span> Dietary Advice
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{result.dietary_advice}</p>
            </div>

            {/* See a Doctor */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-800 mb-1">See a Doctor If:</h3>
                <p className="text-sm text-amber-700 leading-relaxed">{result.when_to_see_doctor}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={handleSaveJournal} className="flex-1 flex items-center justify-center gap-2 border border-primary/30 text-primary rounded-xl py-3 text-sm font-medium hover:bg-primary/5 transition-colors">
                <BookmarkPlus className="w-4 h-4" /> Save to Journal
              </button>
              <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 ayur-btn-primary py-3 text-sm">
                <RotateCcw className="w-4 h-4" /> New Check
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-text-muted text-center leading-relaxed pb-4">{result.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
