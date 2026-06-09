import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Laptop, X, ChevronDown, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoDismissed, setDemoDismissed] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Read auth variables from localStorage
  const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
  const isAuthenticated = Boolean(token);
  const userDosha = localStorage.getItem("userDosha");
  const username = localStorage.getItem("username") || "AyurWell Member";
  const isDemoMode = localStorage.getItem("demoMode") === "true";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.clear();
    // Navigate home and reload page to reset React contexts
    navigate("/");
    window.location.reload();
  };

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(username);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeIcon = (mode: string) => {
    if (mode === "light") return <Sun className="w-4 h-4 text-amber-500" />;
    if (mode === "dark") return <Moon className="w-4 h-4 text-blue-400" />;
    return <Laptop className="w-4 h-4 text-zinc-500" />;
  };

  // Nav links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/community", label: "Community" },
    { href: "/compatibility", label: "Compatibility" },
    { href: "/diet-generator", label: "Diet Plan" },
    { href: "/analytics", label: "Analytics" },
    { href: "/rituals", label: "Daily Rituals" },
    { href: "/herbs", label: "Herb Encyclopedia" },
    { href: "/mealswap", label: "Meal Swap AI" },
    { href: "/wellness-score", label: "Wellness Score" },
    { href: "/coach", label: "Coach" },
  ];

  if (
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/compatibility")
  ) {
    return null;
  }

  // Dosha badges styling
  const doshaBadges: Record<string, string> = {
    vata: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",
    pitta: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50",
    kapha: "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/50",
  };

  const activeDosha = userDosha?.toLowerCase() || "";

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full h-16 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-primary/10 shadow-[0_4px_20px_-4px_rgba(45,106,79,0.08)]"
            : "bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-primary/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            {/* Inline Leaf SVG */}
            <svg
              className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 22C2 22 8 20 12 16C16 12 22 2 22 2C22 2 12 8 8 12C4 16 2 22 2 22Z" />
              <path d="M12 16L14 18" />
              <path d="M8 12L10 14" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-primary tracking-tight">
                AyurWell
              </span>
              <span
                className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold tracking-[0.18em] mt-0.5"
              >
                WELLNESS • WISDOM • BALANCE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 group ${
                    active
                      ? "text-primary font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary-light"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Dosha Pill Badge */}
                {userDosha && (
                  <div
                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${
                      doshaBadges[activeDosha] || "bg-zinc-100 text-zinc-800 border-zinc-200"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>{userDosha} constitution</span>
                  </div>
                )}

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 focus:outline-none group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/10 transition-transform group-hover:scale-105">
                        {initials}
                      </div>
                      <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-200/20 dark:shadow-none"
                  >
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {username}
                      </p>
                      {userDosha && (
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                          {userDosha} constitution
                        </p>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />

                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/diet-generator"
                        className="flex items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                      >
                        My Diet Plan
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/achievements"
                        className="flex items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                      >
                        Achievements
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/analytics"
                        className="flex items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                      >
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/coach"
                        className="flex items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                      >
                        Coach
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />

                    {/* Theme Switcher Toggle */}
                    <DropdownMenuItem
                      onClick={cycleTheme}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                    >
                      {getThemeIcon(theme)}
                      <span className="capitalize">Theme: {theme}</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors font-medium"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/auth"
                  className="text-sm font-semibold text-primary border border-primary/20 rounded-full px-5 py-2 hover:bg-primary/5 active:scale-95 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="text-sm font-semibold bg-primary hover:bg-primary-dark text-white rounded-full px-5 py-2 shadow-md shadow-primary/10 active:scale-95 transition-all duration-200"
                >
                  Start Free
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col justify-center items-center w-6 h-6 relative focus:outline-none z-50 text-zinc-800 dark:text-zinc-200"
              aria-label="Toggle menu"
            >
              <span
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                  mobileOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${
                  mobileOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Panel overlay */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg flex flex-col p-6 border-b border-primary/10 shadow-lg md:hidden animate-fade-in overflow-y-auto">
          {/* Navigation Links list */}
          <nav className="flex flex-col gap-6 flex-1 pt-4">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-lg font-medium transition-colors ${
                    active
                      ? "text-primary font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Theme Toggle in Menu */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 py-4 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Theme</span>
            <button
              onClick={cycleTheme}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {getThemeIcon(theme)}
              <span className="capitalize">{theme}</span>
            </button>
          </div>

          {/* Auth section at bottom */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 pb-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {username}
                    </p>
                    {userDosha && (
                      <p className="text-xs text-primary font-medium">
                        {userDosha} constitution
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  to="/achievements"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  My Achievements
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full py-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 border border-primary/20 text-primary text-center rounded-full font-semibold text-sm hover:bg-primary/5 active:scale-95 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-primary text-white text-center rounded-full font-semibold text-sm hover:bg-primary-dark active:scale-95 transition-all"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo Mode banner */}
      {isDemoMode && !demoDismissed && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-between relative z-40 shadow-sm">
          <div className="flex items-center gap-2 mx-auto">
            <span>⚡</span>
            <span>Demo Mode — Create a free account to save progress</span>
          </div>
          <button
            onClick={() => setDemoDismissed(true)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
