import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useChartThemeColors } from "@/hooks/useChartThemeColors";
import { API_BASE_URL } from "@/lib/utils";
import { Timer, ArrowLeft, ArrowRight, X, Sparkles, Check, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react";

/* -- Quiz Data ------------------------------------------------- */
const questions = [
  { q: "How would you describe your body frame?", options: [{ e: "🦴", t: "Thin, light, hard to gain weight", v: [3,0,0] }, { e: "💪", t: "Medium, muscular, moderate weight", v: [0,3,0] }, { e: "🏃‍♂️", t: "Large, heavy, easy to gain weight", v: [0,0,3] }] },
  { q: "How is your skin typically?", options: [{ e: "🏜️", t: "Dry, rough, or flaky", v: [3,0,0] }, { e: "🔥", t: "Warm, oily, prone to redness", v: [0,3,0] }, { e: "💧", t: "Smooth, moist, cool to touch", v: [0,0,3] }] },
  { q: "How would you describe your appetite?", options: [{ e: "🌀", t: "Irregular, variable - sometimes forget to eat", v: [3,0,0] }, { e: "⚡", t: "Strong, intense - get irritable if I skip meals", v: [0,3,0] }, { e: "🐢", t: "Steady but not urgent - can skip meals easily", v: [0,0,3] }] },
  { q: "How do you sleep?", options: [{ e: "🕊️", t: "Light, interrupted, hard to fall asleep", v: [3,0,0] }, { e: "💤", t: "Moderate, wake up easily but fall asleep fast", v: [0,3,0] }, { e: "🛌", t: "Deep, long, hard to wake up", v: [0,0,3] }] },
  { q: "How do you handle stress?", options: [{ e: "😰", t: "Anxiety, worry, overwhelm", v: [3,0,0] }, { e: "😠", t: "Irritability, frustration, anger", v: [0,3,0] }, { e: "😐", t: "Withdrawal, stubbornness, depression", v: [0,0,3] }] },
  { q: "How is your memory?", options: [{ e: "🎈", t: "Quick to learn, quick to forget", v: [3,0,0] }, { e: "🎯", t: "Sharp, precise, good recall", v: [0,3,0] }, { e: "🗄️", t: "Slow to learn, but never forgets", v: [0,0,3] }] },
  { q: "How do you prefer the weather?", options: [{ e: "☀️", t: "Warm, sunny - hate cold and wind", v: [3,0,0] }, { e: "❄️", t: "Cool - dislike heat and humidity", v: [0,3,0] }, { e: "🍃", t: "Warm and dry - dislike cold and damp", v: [0,0,3] }] },
  { q: "How would you describe your energy levels?", options: [{ e: "📈", t: "Bursts of energy followed by exhaustion", v: [3,0,0] }, { e: "🔋", t: "Intense, focused energy", v: [0,3,0] }, { e: "🕯️", t: "Steady, sustained energy throughout the day", v: [0,0,3] }] },
  { q: "How is your digestion?", options: [{ e: "💨", t: "Irregular, prone to gas and bloating", v: [3,0,0] }, { e: "🔥", t: "Strong, can eat almost anything", v: [0,3,0] }, { e: "🪵", t: "Slow, feel heavy after meals", v: [0,0,3] }] },
  { q: "How do you make decisions?", options: [{ e: "🤷", t: "Quickly but often change my mind", v: [3,0,0] }, { e: "👨‍⚖️", t: "Decisively and confidently", v: [0,3,0] }, { e: "🕰️", t: "Slowly and deliberately", v: [0,0,3] }] },
  { q: "How would you describe your speech?", options: [{ e: "💬", t: "Fast, talkative, jump between topics", v: [3,0,0] }, { e: "📢", t: "Sharp, precise, persuasive", v: [0,3,0] }, { e: "🤫", t: "Slow, melodious, thoughtful", v: [0,0,3] }] },
  { q: "How do you handle cold weather?", options: [{ e: "🥶", t: "Very sensitive to cold, always need warmth", v: [3,0,0] }, { e: "🌲", t: "Enjoy cool weather, feel refreshed", v: [0,3,0] }, { e: "🏕️", t: "Tolerate cold but prefer warmth", v: [0,0,3] }] },
  { q: "What is your natural body temperature?", options: [{ e: "❄️", t: "Cold hands and feet, poor circulation", v: [3,0,0] }, { e: "🌡️", t: "Warm, often feel hot", v: [0,3,0] }, { e: "🟢", t: "Cool and comfortable", v: [0,0,3] }] },
  { q: "How do you respond to exercise?", options: [{ e: "🏃‍♂️", t: "Love movement but tire quickly", v: [3,0,0] }, { e: "🏆", t: "Competitive, push hard, can overheat", v: [0,3,0] }, { e: "🧘", t: "Prefer gentle, steady exercise", v: [0,0,3] }] },
  { q: "How is your hair?", options: [{ e: "🌾", t: "Dry, thin, frizzy", v: [3,0,0] }, { e: "🍂", t: "Fine, oily, early graying", v: [0,3,0] }, { e: "🌳", t: "Thick, lustrous, wavy", v: [0,0,3] }] },
  { q: "How do you feel in the morning?", options: [{ e: "😴", t: "Groggy, need time to wake up", v: [3,0,0] }, { e: "⏰", t: "Alert and ready to go", v: [0,3,0] }, { e: "☕", t: "Slow to start, need coffee", v: [0,0,3] }] },
  { q: "How do you handle change?", options: [{ e: "🌊", t: "Embrace it enthusiastically", v: [3,0,0] }, { e: "🧭", t: "Adapt if it makes logical sense", v: [0,3,0] }, { e: "⚓", t: "Prefer routine and stability", v: [0,0,3] }] },
  { q: "What describes your joints?", options: [{ e: "🦴", t: "Prominent, crack easily", v: [3,0,0] }, { e: "🦵", t: "Flexible, moderate", v: [0,3,0] }, { e: "👟", t: "Large, well-lubricated", v: [0,0,3] }] },
  { q: "How do you feel about social situations?", options: [{ e: "🎉", t: "Enthusiastic but can feel overwhelmed", v: [3,0,0] }, { e: "🎤", t: "Confident, natural leader", v: [0,3,0] }, { e: "☕", t: "Warm, nurturing, prefer small groups", v: [0,0,3] }] },
  { q: "What best describes your emotional nature?", options: [{ e: "🎨", t: "Enthusiastic, changeable, creative", v: [3,0,0] }, { e: "🔥", t: "Passionate, intense, determined", v: [0,3,0] }, { e: "🏔️", t: "Calm, loving, loyal", v: [0,0,3] }] },
];

const doshaInfo: Record<
  string,
  { color: string; bg: string; border: string; emoji: string; desc: string; qualities: string[]; imbalances: string[] }
> = {
  Vata: {
    color: "text-dosha-vata",
    bg: "bg-dosha-vata/10",
    border: "border-dosha-vata/30",
    emoji: "🍃",
    desc: "You are governed by Air and Space. Vata types are creative, quick-thinking, and enthusiastic. You thrive with warmth, routine, and grounding practices.",
    qualities: ["Creative & imaginative", "Quick learner", "Enthusiastic & energetic", "Adaptable to change", "Light & agile body"],
    imbalances: ["Anxiety & worry", "Dry skin & constipation", "Irregular sleep", "Scattered focus", "Cold sensitivity"],
  },
  Pitta: {
    color: "text-dosha-pitta",
    bg: "bg-dosha-pitta/10",
    border: "border-dosha-pitta/30",
    emoji: "🔥",
    desc: "You are governed by Fire and Water. Pitta types are focused, driven, and natural leaders. You thrive with cooling foods, moderation, and stress management.",
    qualities: ["Sharp intellect", "Natural leader", "Strong digestion", "Focused & determined", "Warm & passionate"],
    imbalances: ["Irritability & anger", "Inflammation & acne", "Perfectionism", "Overheating", "Competitive excess"],
  },
  Kapha: {
    color: "text-dosha-kapha",
    bg: "bg-dosha-kapha/10",
    border: "border-dosha-kapha/30",
    emoji: "🌱",
    desc: "You are governed by Earth and Water. Kapha types are stable, nurturing, and deeply loyal. You thrive with stimulation, movement, and light, warming foods.",
    qualities: ["Calm & stable", "Deeply loyal", "Strong endurance", "Nurturing nature", "Excellent memory"],
    imbalances: ["Lethargy & sluggishness", "Weight gain", "Attachment & possessiveness", "Congestion", "Resistance to change"],
  },
};

const DoshaQuiz = () => {
  const [screen, setScreen] = useState<"intro" | "quiz" | "results">("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [scores, setScores] = useState({ Vata: 0, Pitta: 0, Kapha: 0 });
  const navigate = useNavigate();
  const confettiRef = useRef(false);
  const { token } = useAuth();
  const { isDark } = useTheme();
  const chartColors = useChartThemeColors();

  useEffect(() => {
    document.title = "Dosha Quiz - AyurWell";
  }, []);

  useEffect(() => {
    if (screen === "results" && !confettiRef.current) {
      confettiRef.current = true;
      const light = ["#2D6A4F", "#52B788", "#E9C46A", "#F4A261"];
      const darkMode = ["#74C69D", "#95D5B2", "#E9C46A", "#F8E6A8", "#B8E0FF", "#C8B6E2"];
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: isDark ? darkMode : light });
    }
  }, [screen, isDark]);

  const handleSelect = (idx: number) => setSelected(idx);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, questions[current].options[selected].v];
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 >= questions.length) {
      // Calculate scores
      const totals = newAnswers.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]], [0, 0, 0]);
      const result = { Vata: totals[0], Pitta: totals[1], Kapha: totals[2] };
      setScores(result);
      const dominant = Object.entries(result).sort((a, b) => b[1] - a[1])[0][0];
      localStorage.setItem("dosha_result", JSON.stringify({ ...result, dominant }));
      setScreen("results");

      // Submit results to backend if authenticated
      if (token) {
        fetch(`${API_BASE_URL}/api/gamification/check/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        }).catch(() => {});
        
        fetch(`${API_BASE_URL}/api/users/onboarding-complete/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
          body: JSON.stringify({ dosha: dominant }),
        }).catch(() => {});
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current === 0) {
      setScreen("intro");
      return;
    }
    setAnswers(answers.slice(0, -1));
    setCurrent(current - 1);
    setSelected(null);
  };

  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "Vata";
  const total = scores.Vata + scores.Pitta + scores.Kapha || 1;
  const radarData = [
    { subject: "Vata", value: Math.round((scores.Vata / total) * 100) },
    { subject: "Pitta", value: Math.round((scores.Pitta / total) * 100) },
    { subject: "Kapha", value: Math.round((scores.Kapha / total) * 100) },
  ];
  const info = doshaInfo[dominant];

  /* -- INTRO SCREEN -------------------------------------------- */
  if (screen === "intro") {
    return (
      <main className="page-enter relative z-10 w-full min-h-[calc(100vh-64px)] p-6 md:p-16 flex flex-col items-center justify-center max-w-[1600px] mx-auto selection:bg-primary selection:text-white">
        <section className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(45,106,79,0.05)] border border-zinc-200/50 dark:border-zinc-800 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-20 w-96 h-96 border border-primary/5 rounded-full opacity-50 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute -left-10 -bottom-10 w-64 h-64 border border-primary/5 rounded-full opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
            {/* Animated Lotus Element */}
            <div className="mb-8 animate-breath">
              <svg className="text-primary dark:text-primary-light" fill="none" height="80" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24" width="80">
                <path d="M12 2c0 0-4 6-4 10s4 10 4 10 4-6 4-10-4-10-4-10Z"></path>
                <path d="M12 12C8 12 2 15 2 19s10 3 10 3"></path>
                <path d="M12 12c4 0 10 3 10 7s-10 3-10 3"></path>
              </svg>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary dark:text-primary-light px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-primary/20">
              <Timer className="w-4 h-4" />
              <span>5 mins • 20 questions</span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6">Discover Your Prakriti</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
              Uncover your unique mind-body constitution and receive personalized wellness insights rooted in Ayurvedic science.
            </p>

            {/* Dosha Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 w-full">
              <span className="px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs border border-blue-100 dark:border-blue-900/30 shadow-sm shadow-blue-200/5">Vata</span>
              <span className="px-5 py-2 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-semibold text-xs border border-orange-100 dark:border-orange-900/30 shadow-sm shadow-orange-200/5">Pitta</span>
              <span className="px-5 py-2 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-semibold text-xs border border-green-100 dark:border-green-900/30 shadow-sm shadow-green-200/5">Kapha</span>
            </div>

            {/* CTAs */}
            <button
              onClick={() => setScreen("quiz")}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer border-0 shadow-md"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 text-zinc-500 dark:text-zinc-400 font-semibold text-xs hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-0"
            >
              <X className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* -- RESULTS SCREEN ------------------------------------------ */
  if (screen === "results") {
    return (
      <main className="page-enter relative z-10 w-full min-h-[calc(100vh-64px)] p-6 md:p-16 flex flex-col items-center justify-center max-w-4xl mx-auto selection:bg-primary selection:text-white">
        <section className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-[0_16px_48px_0_rgba(45,106,79,0.08)] border border-zinc-200/50 dark:border-zinc-800 flex flex-col relative">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 animate-bounce">{info.emoji}</div>
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Your Ayurvedic Constitution</p>
            <h1 className={`font-display text-5xl font-bold ${info.color} mb-3`}>{dominant}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">{info.desc}</p>
          </div>

          {/* Radar Chart Panel */}
          <div className="rounded-2xl p-6 mb-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 shadow-sm">
            <h3 className="font-display text-xl text-zinc-800 dark:text-white mb-6 text-center">Your Dosha Balance</h3>
            <div className="overflow-x-auto flex justify-center">
              <ResponsiveContainer width="100%" height={280} className="max-w-[400px]">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={chartColors.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fontWeight: 600, fill: chartColors.muted }} />
                  <Radar
                    name="Dosha"
                    dataKey="value"
                    stroke={dominant === "Vata" ? chartColors.doshaVata : dominant === "Pitta" ? chartColors.doshaPitta : chartColors.doshaKapha}
                    fill={dominant === "Vata" ? chartColors.doshaVata : dominant === "Pitta" ? chartColors.doshaPitta : chartColors.doshaKapha}
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              {Object.entries(scores).map(([k, v]) => (
                <div key={k} className="text-center">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-white">{Math.round((v / total) * 100)}%</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">{k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualities & Imbalances Grids */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800">
              <h4 className="font-display text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary dark:text-primary-light" />
                <span>Your Qualities</span>
              </h4>
              <ul className="space-y-3">
                {info.qualities.map((qual) => (
                  <li key={qual} className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-light shrink-0" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800">
              <h4 className="font-display text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent-dark dark:text-accent" />
                <span>Watch Out For</span>
              </h4>
              <ul className="space-y-3">
                {info.imbalances.map((imbal) => (
                  <li key={imbal} className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    <AlertCircle className="w-4 h-4 text-accent-dark dark:text-accent shrink-0" />
                    <span>{imbal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => navigate("/diet-generator")}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              <span>Generate My Diet Plan</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm text-primary dark:text-primary-light border border-primary/30 rounded-full px-8 py-4 bg-transparent hover:bg-primary/5 transition-all duration-300 cursor-pointer"
            >
              <span>Save & Go to Dashboard</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* -- QUIZ SCREEN ---------------------------------------------- */
  const q = questions[current];
  const progress = Math.round((current / questions.length) * 100);

  return (
    <main className="page-enter relative z-10 w-full min-h-[calc(100vh-64px)] p-6 md:p-16 flex flex-col items-center justify-center max-w-[1600px] mx-auto selection:bg-primary selection:text-white">
      <section className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-[0_16px_48px_0_rgba(45,106,79,0.08)] border border-zinc-200/50 dark:border-zinc-800 flex flex-col relative">
        {/* Header / Progress bar */}
        <header className="mb-10 w-full">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Question {current + 1} of {questions.length}</span>
            <span className="text-xs font-bold text-primary dark:text-primary-light">{progress}%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary dark:bg-primary-light rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        {/* Question Panel */}
        <div className="flex-1 flex flex-col w-full">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-8 leading-relaxed">
            {q.q}
          </h2>

          {/* Options Stack */}
          <div className="space-y-4 mb-auto">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? "border-2 border-primary bg-primary/5 shadow-sm shadow-primary/5 dark:bg-primary/10"
                      : "border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  {/* Selection Circle */}
                  <div
                    className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? "bg-primary text-white"
                        : "border border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                    )}
                  </div>
                  {/* Option Text */}
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl mt-0.5 leading-none">{opt.e}</span>
                    <div>
                      <p className={`text-sm text-zinc-700 dark:text-zinc-300 ${isSelected ? "font-bold text-primary dark:text-primary-light" : "font-medium"}`}>
                        {opt.t}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 font-semibold text-xs text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary-light transition-colors group bg-transparent border-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-xs hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 group cursor-pointer border-0 shadow-md"
            >
              <span>{current + 1 === questions.length ? "See Results" : "Next"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DoshaQuiz;
