import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();

  const pwStrength =
    signupData.password.length === 0
      ? 0
      : Math.min(
          4,
          [
            signupData.password.length >= 8,
            /[A-Z]/.test(signupData.password),
            /[0-9]/.test(signupData.password),
            /[^A-Za-z0-9]/.test(signupData.password)
          ].filter(Boolean).length
        );

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0: return { label: "Very Weak", color: "text-red-500", barColor: "bg-red-500" };
      case 1: return { label: "Weak", color: "text-orange-500", barColor: "bg-orange-500" };
      case 2: return { label: "Medium", color: "text-yellow-500", barColor: "bg-yellow-500" };
      case 3: return { label: "Strong", color: "text-green-500", barColor: "bg-green-500" };
      case 4: return { label: "Excellent", color: "text-emerald-500", barColor: "bg-emerald-500" };
      default: return { label: "None", color: "text-zinc-400", barColor: "bg-zinc-200" };
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast({ title: "Welcome back!" });
      navigate("/dashboard");
    } catch {
      toast({ title: "Login failed", description: "Check your credentials", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    if (!terms) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await register(signupData.name, signupData.email, signupData.password);
      toast({ title: "Account created!" });
      navigate("/dashboard");
    } catch {
      toast({ title: "Signup failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoBypass = () => {
    localStorage.setItem("auth_token", "demo_token");
    localStorage.setItem("token", "demo_token");
    localStorage.setItem("username", "AyurGuest");
    localStorage.setItem("userDosha", "vata");
    localStorage.setItem("demoMode", "true");
    localStorage.setItem("streak", "5");
    toast({ title: "Logged in as Guest!", description: "Demo mode activated." });
    navigate("/dashboard");
    window.location.reload();
  };

  const strengthDetails = getStrengthLabel(pwStrength);

  return (
    <main className="flex w-full min-h-screen bg-[#FEFAE0] dark:bg-zinc-950 selection:bg-primary/20 selection:text-primary">
      {/* Left Panel: Brand & Atmosphere (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-12 xl:p-16 text-white border-r border-primary-dark">
        {/* Ambient Gradient & Mandala Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-[#1B4332] opacity-90 z-0"></div>
        
        {/* Breathing Concentric Mandala Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.06] pointer-events-none z-0 flex items-center justify-center">
          <svg className="w-[600px] h-[600px] animate-[spin_120s_linear_infinite]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="195" stroke="currentColor" strokeWidth="0.8"/>
            <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="0.8"/>
            <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5"/>
            <path d="M200 5 L200 395 M5 200 L395 200" stroke="currentColor" strokeWidth="0.3"/>
            <path d="M62 62 L338 338 M62 338 L338 62" stroke="currentColor" strokeWidth="0.3"/>
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top: Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 22C2 22 8 20 12 16C16 12 22 2 22 2C22 2 12 8 8 12C4 16 2 22 2 22Z" />
                <path d="M12 16L14 18" />
                <path d="M8 12L10 14" />
              </svg>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">AyurWell</h1>
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight max-w-md">
              Ancient Wisdom,<br />Modern Science.
            </h2>
            <p className="font-sans text-emerald-100/90 leading-relaxed max-w-sm">
              Discover your unique mind-body constitution and embark on a holistic journey to absolute wellness, guided by centuries of Ayurvedic tradition.
            </p>
          </div>

          {/* Middle: Benefits */}
          <div className="flex flex-col gap-5 my-10">
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm text-emerald-50 leading-snug">
                Personalized Dosha analysis and daily health routines.
              </p>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm text-emerald-50 leading-snug">
                Curated herbal protocols and holistic diet plans.
              </p>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm text-emerald-50 leading-snug">
                Interactive logs and direct Ayurvedic AI wellness coach.
              </p>
            </div>
          </div>

          {/* Bottom: Quote */}
          <div className="border-t border-white/10 pt-8 mt-auto">
            <p className="font-display text-lg italic text-emerald-100/95 mb-3 max-w-sm">
              "Health is not merely the absence of disease, but the dynamic expression of life."
            </p>
            <p className="text-xs text-accent/80 font-bold uppercase tracking-wider">
              — Ayurvedic Proverb
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Canvas */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface dark:bg-zinc-950 relative overflow-hidden min-h-screen">
        
        {/* Subtle background texture for right panel */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url('/mandala-bg.png')` }}></div>

        {/* Login/Signup Card */}
        <div className="w-full max-w-[450px] bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(45,106,79,0.08)] dark:shadow-none relative z-10 flex flex-col p-8 sm:p-10 border border-primary/10 dark:border-zinc-800">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 22C2 22 8 20 12 16C16 12 22 2 22 2C22 2 12 8 8 12C4 16 2 22 2 22Z" />
              <path d="M12 16L14 18" />
              <path d="M8 12L10 14" />
            </svg>
            <span className="font-display text-xl font-bold text-primary dark:text-primary-light">AyurWell</span>
          </div>

          {/* Sliding Tab Switcher Container */}
          <div className="relative flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full mb-8 border border-zinc-200/50 dark:border-zinc-700/30">
            {/* Sliding Pill */}
            <div
              className="absolute top-1 bottom-1 rounded-full bg-white dark:bg-zinc-700 shadow-sm transition-all duration-300 ease-out"
              style={{
                left: tab === "login" ? "4px" : "50%",
                width: "calc(50% - 8px)",
              }}
            />
            <button
              onClick={() => setTab("login")}
              className={`relative z-10 flex-1 py-2 text-center text-sm font-semibold transition-colors duration-300 ${
                tab === "login" ? "text-primary dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`relative z-10 flex-1 py-2 text-center text-sm font-semibold transition-colors duration-300 ${
                tab === "signup" ? "text-primary dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-zinc-950 dark:text-white mb-2">
              {tab === "login" ? "Welcome Back 🙏" : "Begin Your Journey 🌿"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {tab === "login"
                ? "Enter your details to access your wellness journey."
                : "Create a free account to discover your Ayurvedic constitution."}
            </p>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5 relative group">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors" htmlFor="email">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="namaste@example.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 focus:border-primary dark:focus:border-primary-light rounded-xl py-3 pl-10 pr-4 focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5 relative group">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors" htmlFor="password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 focus:border-primary dark:focus:border-primary-light rounded-xl py-3 pl-10 pr-10 focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end -mt-2">
                <span className="cursor-pointer text-xs font-semibold text-primary dark:text-primary-light hover:underline underline-offset-4">
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                disabled={isLoading}
                className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:opacity-95 transition-all duration-300 active:scale-[0.98] flex justify-center items-center gap-2"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5 relative group">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors" htmlFor="name">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Arjun Mehta"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 focus:border-primary dark:focus:border-primary-light rounded-xl py-3 pl-10 pr-4 focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                    value={signupData.name}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5 relative group">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors" htmlFor="signup-email">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    placeholder="namaste@example.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 focus:border-primary dark:focus:border-primary-light rounded-xl py-3 pl-10 pr-4 focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                    value={signupData.email}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5 relative group">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors" htmlFor="signup-password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 focus:border-primary dark:focus:border-primary-light rounded-xl py-3 pl-10 pr-10 focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                    value={signupData.password}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {signupData.password.length > 0 && (
                <div className="flex flex-col gap-1.5 -mt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-zinc-400">Password Strength:</span>
                    <span className={strengthDetails.color}>{strengthDetails.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < pwStrength ? strengthDetails.barColor : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-1.5 relative group">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-primary-light transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPw2 ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 focus:border-primary dark:focus:border-primary-light rounded-xl py-3 pl-10 pr-10 focus:outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <button
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                    type="button"
                    onClick={() => setShowPw2(!showPw2)}
                  >
                    {showPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <label className="flex cursor-pointer items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary dark:focus:ring-offset-zinc-900 bg-transparent w-4 h-4"
                />
                <span>I agree to the Terms of Service & Privacy Policy</span>
              </label>

              {/* Submit Button */}
              <button
                disabled={isLoading}
                className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:opacity-95 transition-all duration-300 active:scale-[0.98] flex justify-center items-center gap-2"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Alternative Login Divider */}
          <div className="mt-8 mb-6 flex items-center gap-4">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Try Demo Account Button */}
            <button
              type="button"
              onClick={handleDemoBypass}
              className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold py-3 rounded-full border border-amber-500/20 hover:border-amber-500/30 transition-all duration-300 flex justify-center items-center gap-2"
            >
              <Sparkles className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Try Demo Account</span>
            </button>

            {/* Back to Home link */}
            <div className="mt-4 text-center">
              <Link to="/" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary-light transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft className="w-4.5 h-4.5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="absolute bottom-6 flex gap-6 text-zinc-400 dark:text-zinc-600 text-xs font-semibold">
          <Link className="hover:text-primary transition-colors" to="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-primary transition-colors" to="/terms">
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Auth;


