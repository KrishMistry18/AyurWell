import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

/* -- Tour Steps ------------------------------------------------ */
const STEPS = [
  {
    selector: "[data-tour='logo']",
    title: "Welcome to AyurWell ??",
    desc: "Your personal Ayurvedic wellness companion. We'll guide you through everything in just a minute.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='nav-dosha']",
    title: "Start with Your Dosha",
    desc: "Take a 5-minute quiz to discover your unique Ayurvedic constitution — the foundation of your wellness plan.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='nav-dashboard']",
    title: "Your Wellness Dashboard",
    desc: "Track daily energy, sleep, water, and mood. See your progress and get personalized insights.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='nav-diet']",
    title: "Get Personalized Meals",
    desc: "Generate a 7-day meal plan tailored to your dosha, season, and health goals.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='nav-analytics']",
    title: "See Your Trends",
    desc: "Beautiful charts and AI insights based on your logged wellness data over time.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='nav-tips']",
    title: "Seasonal Wisdom",
    desc: "Daily Ayurvedic tips tailored to your dosha and the current season.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='nav-coach']",
    title: "Meet Vaidya ??",
    desc: "Your AI Ayurvedic coach, available anytime to answer wellness questions and give personalized guidance.",
    position: "bottom" as const,
  },
  {
    selector: "[data-tour='avatar']",
    title: "You're All Set! ??",
    desc: "Your profile and settings live here. Let's begin your wellness journey — start with the Dosha Quiz!",
    position: "bottom-left" as const,
  },
];

/* -- Spotlight Overlay ----------------------------------------- */
const getElementRect = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
};

/* -- Tooltip Position ------------------------------------------ */
const getTooltipStyle = (rect: DOMRect | null, position: string): React.CSSProperties => {
  if (!rect) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const pad = 12;
  if (position === "bottom" || position === "bottom-left") {
    return {
      position: "fixed",
      top: rect.top + rect.height + pad,
      left: position === "bottom-left" ? Math.max(8, rect.right - 280) : Math.max(8, rect.left),
      zIndex: 10001,
    };
  }
  return {
    position: "fixed",
    top: rect.top - pad,
    left: Math.max(8, rect.left),
    transform: "translateY(-100%)",
    zIndex: 10001,
  };
};

/* -- Main Component -------------------------------------------- */
const OnboardingTour = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const updateRect = useCallback(() => {
    const r = getElementRect(STEPS[step].selector);
    setRect(r);
  }, [step]);

  useEffect(() => {
    // Small delay so DOM is ready
    const t = setTimeout(() => {
      setVisible(true);
      updateRect();
    }, 600);
    return () => clearTimeout(t);
  }, [updateRect]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [step, updateRect]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleFinish = () => {
    localStorage.setItem("onboarding_complete", "true");
    if (token) {
      fetch(`${API_BASE_URL}/api/users/onboarding-complete/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({}),
      }).catch(() => {});
    }
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ["#2D6A4F", "#52B788", "#E9C46A", "#F4A261"] });
    setVisible(false);
    setShowModal(true);
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_complete", "true");
    setVisible(false);
    onComplete();
  };

  if (!visible && !showModal) return null;

  const currentStep = STEPS[step];
  const tooltipStyle = rect ? getTooltipStyle(rect, currentStep.position) : {};

  return (
    <>
      {/* -- OVERLAY -------------------------------------------- */}
      {visible && (
        <div className="fixed inset-0 z-[10000]">
          {/* Dark overlay — pointer-events-none so spotlight area is clickable */}
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />

          {/* Spotlight cutout — sits above overlay, cuts out the target */}
          {rect && (
            <div
              className="absolute pointer-events-none"
              style={{
                top: rect.top - 6,
                left: rect.left - 6,
                width: rect.width + 12,
                height: rect.height + 12,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                borderRadius: 8,
                zIndex: 10000,
              }}
            />
          )}

          {/* Tooltip — pointer-events-auto so buttons work */}
          <div
            className="pointer-events-auto animate-scale-in"
            style={{ ...tooltipStyle, position: "fixed", zIndex: 10001 }}
          >
            <div className="bg-[var(--color-card)] rounded-2xl shadow-wellness-lg border-2 border-primary/20 p-5 w-72 max-w-[calc(100vw-16px)]">
              {/* Close */}
              <button onClick={handleSkip} className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>

              {/* Step badge */}
              <div className="inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-2.5 py-1 mb-3">
                <span className="text-xs font-bold text-primary">{step + 1} / {STEPS.length}</span>
              </div>

              <h3 className="font-bold text-text-primary mb-1.5 pr-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                {currentStep.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">{currentStep.desc}</p>

              {/* Progress dots */}
              <div className="flex gap-1.5 mb-4">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "bg-primary w-5" : i < step ? "bg-primary/40 w-2" : "bg-gray-200 w-2"
                  }`} />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <button onClick={handleBack} className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>
                  )}
                  <button onClick={handleSkip} className="text-xs text-text-muted hover:text-primary transition-colors">
                    Skip tour
                  </button>
                </div>
                <button onClick={handleNext} className="ayur-btn-primary text-xs px-4 py-2">
                  {step === STEPS.length - 1 ? "Finish ??" : "Next"} {step < STEPS.length - 1 && <ArrowRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- COMPLETION MODAL ----------------------------------- */}
      {showModal && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-card)] rounded-2xl shadow-wellness-lg p-8 max-w-sm w-full text-center animate-scale-in">
            <div className="text-5xl mb-4">??</div>
            <h2 className="ayur-heading text-2xl font-bold text-text-primary mb-2">You're Ready!</h2>
            <p className="text-text-muted text-sm mb-6 leading-relaxed">
              Welcome to AyurWell! Let's begin your wellness journey — take the Dosha Quiz first to unlock personalized recommendations.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setShowModal(false); onComplete(); navigate("/dosha"); }}
                className="ayur-btn-primary w-full justify-center py-3"
              >
                Take Dosha Quiz ??
              </button>
              <button
                onClick={() => { setShowModal(false); onComplete(); }}
                className="text-sm text-text-muted hover:text-primary transition-colors py-2"
              >
                Explore on my own
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingTour;
