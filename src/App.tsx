import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import OnboardingTour from "@/components/OnboardingTour";
import { API_BASE_URL } from "@/lib/utils";
import PageLoader from "@/components/PageLoader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const Home = React.lazy(() => import("./pages/Home"));
const Features = React.lazy(() => import("./pages/Features"));
const DietGenerator = React.lazy(() => import("./pages/DietGenerator"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Auth = React.lazy(() => import("./pages/Auth"));
const DoshaQuiz = React.lazy(() => import("./pages/DoshaQuiz"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Coach = React.lazy(() => import("./pages/WellnessCoach"));
const Tips = React.lazy(() => import("./pages/Tips"));
const Pulse = React.lazy(() => import("./pages/Pulse"));
const Herbs = React.lazy(() => import("./pages/HerbEncyclopedia"));
const Achievements = React.lazy(() => import("./pages/Achievements"));
const SymptomChecker = React.lazy(() => import("./pages/SymptomChecker"));
const Community = React.lazy(() => import("./pages/Community"));
const Compatibility = React.lazy(() => import("./pages/Compatibility"));
const Reports = React.lazy(() => import("./pages/Reports"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const DailyRituals = React.lazy(() => import("./pages/DailyRituals"));
const MealSwapAI = React.lazy(() => import("./pages/MealSwapAI"));
const WellnessScore = React.lazy(() => import("./pages/WellnessScore"));

const queryClient = new QueryClient();

/* ── Loading Bar ─────────────────────────────────────────────── */
const LoadingBar = () => {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setActive(true);
    setWidth(0);
    const t1 = setTimeout(() => setWidth(70), 50);
    const t2 = setTimeout(() => { setWidth(100); }, 300);
    const t3 = setTimeout(() => { setActive(false); setWidth(0); }, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [location.pathname]);

  if (!active && width === 0) return null;
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, height: "3px", zIndex: 9999,
        width: `${width}%`,
        background: "linear-gradient(90deg, #2D6A4F, #52B788)",
        transition: width === 0 ? "none" : "width 0.3s ease",
        borderRadius: "0 2px 2px 0",
        opacity: active ? 1 : 0,
      }}
    />
  );
};

/* ── Quick Log FAB ── */

/* ── Onboarding Gate ─────────────────────────────────────────── */
const OnboardingGate = () => {
  const { isAuthenticated } = useAuth();
  const [showTour, setShowTour] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only check once when auth state is known
    if (!isAuthenticated || checked) return;
    setChecked(true);
    const done = localStorage.getItem("onboarding_complete");
    if (!done) {
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, checked]);

  if (!showTour) return null;
  return <OnboardingTour onComplete={() => setShowTour(false)} />;
};

/* ── App Shell ───────────────────────────────────────────────── */
const AppShell = () => {
  const location = useLocation();

  return (
    <div className="bg-surface min-h-screen relative z-10">
      <LoadingBar />
      <Navbar />
      <div key={location.pathname} className="page-enter">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/diet-generator" element={<DietGenerator />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dosha" element={<DoshaQuiz />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/coach" element={<Coach />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/herbs" element={<Herbs />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route path="/community" element={<Community />} />
            <Route path="/compatibility" element={<Compatibility />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/rituals" element={<DailyRituals />} />
            <Route path="/mealswap" element={<MealSwapAI />} />
            <Route path="/wellness-score" element={<WellnessScore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <OnboardingGate />
      <PWAInstallBanner />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
