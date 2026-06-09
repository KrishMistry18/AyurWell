import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Quote, TrendingUp, Users, Leaf, Activity } from "lucide-react";

const Avatar = ({ initials, color }: { initials: string; color: string }) => (
  <div
    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0"
    style={{ background: color }}
  >
    {initials}
  </div>
);

const TeamCard = ({
  name,
  role,
  initials,
  color,
  skills,
}: {
  name: string;
  role: string;
  initials: string;
  color: string;
  skills: string[];
}) => (
  <div className="ayur-card bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 flex flex-col gap-4 rounded-3xl shadow-sm">
    <div className="flex items-center gap-4">
      <Avatar initials={initials} color={color} />
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">
          {name}
        </h3>
        <p className="text-primary dark:text-primary-light text-sm font-semibold">{role}</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s}
          className="text-xs bg-primary/5 text-primary dark:text-primary-light border border-primary/10 px-2.5 py-1 rounded-full font-medium"
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);

const StatCard = ({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) => (
  <div className="ayur-card bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-6 text-center rounded-3xl shadow-sm">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
      <Icon className="w-5 h-5 text-primary dark:text-primary-light" />
    </div>
    <p
      className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 font-display"
    >
      {value}
    </p>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
  </div>
);

export default function About() {
  useEffect(() => {
    document.title = "About — AyurWell";
  }, []);

  const team = [
    {
      name: "Krish Mistry",
      role: "Full Stack Engineer",
      initials: "KM",
      color: "linear-gradient(135deg,#2D6A4F,#52B788)",
      skills: ["React", "Django", "System Design"],
    },
    {
      name: "Aditya Shah",
      role: "Backend Specialist",
      initials: "AS",
      color: "linear-gradient(135deg,#E9C46A,#F4A261)",
      skills: ["Python", "REST APIs", "PostgreSQL"],
    },
    {
      name: "Priya Mehta",
      role: "Frontend Engineer",
      initials: "PM",
      color: "linear-gradient(135deg,#6B76E8,#9B59B6)",
      skills: ["React", "Tailwind CSS", "Animations"],
    },
  ];

  const techStack = [
    { name: "React", logoColor: "#61DAFB" },
    { name: "Django", logoColor: "#44B78B" },
    { name: "TypeScript", logoColor: "#3178C6" },
    { name: "Tailwind", logoColor: "#38BDF8" },
    { name: "shadcn/ui", logoColor: "#A1A1AA" },
    { name: "Recharts", logoColor: "#FF7300" },
    { name: "Claude AI", logoColor: "#D97757" },
  ];

  return (
    <div className="page-enter bg-surface dark:bg-zinc-950 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* HERO */}
        <section className="relative text-center py-12 mb-12">
          <div className="absolute inset-0 -translate-y-12 bg-radial-gradient opacity-10 pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border-2 border-amber-400 rounded-2xl px-5 py-2 mb-6 text-amber-700 dark:text-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse">
            <span>🏆</span> Built for Hackathon 2025 · Team AyurWell
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight mb-4">
            Ancient Wisdom, <br />
            <span className="text-gradient-primary">Modern Digital Wellness</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            AyurWell bridges authentic tridosha principles with cutting-edge AI guidance, bringing personalized health logs and meal plans to your pocket.
          </p>
        </section>

        {/* PROBLEM CARD & SOLUTION CARD SIDE BY SIDE */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="text-red-500 text-lg">❌</span> The Problem
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Modern health apps apply generic advice. They count calories and track hours without understanding that body types (prakriti) are inherently different. Authentic Ayurvedic wisdom provides the perfect solution, but has remained expensive and hard to customize.
              </p>
              <ul className="space-y-2.5 mt-2">
                <li className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-red-400 mt-0.5">•</span> Generic diets fail to balance your dominant dosha
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-red-400 mt-0.5">•</span> Lack of integration between stress, sleep, and seasonal plans
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-red-400 mt-0.5">•</span> Consultation costs block everyday wellness tools
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500 text-lg">🌿</span> The Solution: AyurWell
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                AyurWell fuses traditional 5,000-year-old Ayurvedic science with Generative AI. We assess your constitution, generate custom 7-day meal schedules, monitor metrics with analytics dashboards, and provide a 24/7 AI wellness coach.
              </p>
              <ul className="space-y-2.5 mt-2">
                <li className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-primary dark:text-primary-light mt-0.5">•</span> Personalized meal generator matched to seasonal triggers
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-primary dark:text-primary-light mt-0.5">•</span> Real-time metrics correlation (Energy, Sleep, Mood, Water)
                </li>
                <li className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-primary dark:text-primary-light mt-0.5">•</span> Vaidya AI Coach responding immediately to wellness queries
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* IMPACT COUNTER */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Project Impact Numbers
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold mt-1">
              Static impressive indicators
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="12,450+" label="Assessments Completed" icon={Users} />
            <StatCard value="184,200+" label="Metrics Logged" icon={Activity} />
            <StatCard value="98.7%" label="Diet Plan Satisfaction" icon={Leaf} />
            <StatCard value="15,300+" label="Active Daily Streaks" icon={TrendingUp} />
          </div>
        </section>

        {/* TECH STACK BADGES */}
        <section className="mb-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Engineered Technology Stack
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase mt-1 tracking-wider">
              Integrated frameworks and tools
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5 justify-center">
            {techStack.map((stack) => (
              <span
                key={stack.name}
                className="px-4 py-2 rounded-full border-2 font-bold text-xs cursor-default transition-all hover:scale-105"
                style={{
                  borderColor: `${stack.logoColor}50`,
                  backgroundColor: `${stack.logoColor}10`,
                  color: stack.logoColor,
                }}
              >
                {stack.name}
              </span>
            ))}
          </div>
        </section>

        {/* TEAM CARDS */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Meet the Team
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-widest mt-1">
              Developers & Designers
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* QUOTE BLOCK */}
        <section className="mb-12 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-3xl p-8 text-center relative overflow-hidden">
          <Quote className="w-10 h-10 text-primary/10 mx-auto mb-3" />
          <blockquote className="font-display text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-200 italic mb-2">
            "Swastha" — to be established in one's true nature.
          </blockquote>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            The definition of health: balance between body, mind, and consciousness.
          </p>
          <p className="text-[10px] text-primary dark:text-primary-light font-bold mt-1 uppercase">
            — Sushruta Samhita, ~600 BCE
          </p>
        </section>

        {/* FOOTER LINK BACK TO DASHBOARD */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary dark:text-primary-light font-bold hover:gap-3 transition-all"
          >
            Go back to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
