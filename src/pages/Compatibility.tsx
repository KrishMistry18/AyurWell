import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Compatibility() {
  const { user } = useAuth();
  const username = user?.name || user?.username || "Prana Seeker";
  const initials = username.slice(0, 2).toUpperCase();
  const dosha = localStorage.getItem("userDosha") || "Vata-Pitta";

  useEffect(() => {
    document.title = "AyurWell | Dosha Compatibility & Social Planner";
  }, []);

  return (
    <div className="bg-[#fefae0] text-[#1d1c0d] font-sans min-h-screen relative">
      <style>{`
        .parchment-texture {
            background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
            background-color: #fefae0;
        }
        .mandala-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.03;
            pointer-events: none;
            background-image: url("data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><path d='M50 0C60 20 80 40 100 50C80 60 60 80 50 100C40 80 20 60 0 50C20 40 40 20 50 0Z' fill='%232c694e'/></svg>");
            background-size: 200px 200px;
            z-index: 0;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(191, 201, 193, 0.3);
        }
      `}</style>
      <div className="parchment-texture absolute inset-0 z-0 opacity-50 pointer-events-none"></div>
      <div className="mandala-bg"></div>

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-[#fefae0]/80 backdrop-blur-xl border-b border-[#bfc9c1]/30 shadow-sm shadow-[#0f5238]/5 md:px-12">
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined p-2 text-[#0f5238] hover:bg-[#e7e3ca]/50 transition-colors rounded-full md:hidden">menu</button>
          <Link to="/" className="font-display text-[24px] font-semibold text-[#0f5238] tracking-tight">AyurWell</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined p-2 text-[#0f5238] hover:bg-[#e7e3ca]/50 transition-colors rounded-full cursor-pointer">notifications</span>
          <Link to="/dashboard" className="material-symbols-outlined p-2 text-[#0f5238] hover:bg-[#e7e3ca]/50 transition-colors rounded-full cursor-pointer">account_circle</Link>
        </div>
      </header>

      <div className="flex pt-16 h-screen relative z-10">
        {/* SideNavBar (Hidden on Mobile) */}
        <aside className="hidden md:flex flex-col h-full border-r border-[#bfc9c1]/30 bg-[#fefae0] w-80 shadow-xl shadow-[#0f5238]/5 shrink-0 overflow-y-auto">
          <div className="p-8 space-y-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#b1f0ce] overflow-hidden ring-2 ring-[#0f5238]/20 flex items-center justify-center text-[#0f5238] font-bold text-xl">
                {initials}
              </div>
              <div>
                <h3 className="font-display text-[18px] text-[#0f5238] font-semibold">{username}</h3>
                <p className="text-[12px] text-[#404943]">{dosha} Balance</p>
              </div>
            </div>
            <nav className="space-y-1">
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#404943] hover:bg-[#2d6a4f]/10 transition-all duration-200">
                <span className="material-symbols-outlined">wb_sunny</span>
                <span className="text-[16px]">Daily Rituals</span>
              </Link>
              <Link to="/herbs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#404943] hover:bg-[#2d6a4f]/10 transition-all duration-200">
                <span className="material-symbols-outlined">auto_stories</span>
                <span className="text-[16px]">Herb Encyclopedia</span>
              </Link>
              <Link to="/diet-generator" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#404943] hover:bg-[#2d6a4f]/10 transition-all duration-200">
                <span className="material-symbols-outlined">restaurant_menu</span>
                <span className="text-[16px]">Meal Swap AI</span>
              </Link>
              <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#404943] hover:bg-[#2d6a4f]/10 transition-all duration-200">
                <span className="material-symbols-outlined">analytics</span>
                <span className="text-[16px]">Wellness Score</span>
              </Link>
              <Link to="/compatibility" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#0f5238] font-bold border-l-4 border-[#765a05] bg-[#2d6a4f]/5">
                <span className="material-symbols-outlined">diversity_1</span>
                <span className="text-[16px]">Dosha Compatibility</span>
              </Link>
              <Link to="/community" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#404943] hover:bg-[#2d6a4f]/10 transition-all duration-200">
                <span className="material-symbols-outlined">group</span>
                <span className="text-[16px]">Community</span>
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-8 border-t border-[#bfc9c1]/20">
            <button className="w-full py-4 bg-[#0f5238] text-white rounded-full text-[14px] font-semibold mb-6 shadow-lg shadow-[#0f5238]/20 hover:scale-95 transition-transform">
              Upgrade to Premium
            </button>
            <div className="flex gap-4">
              <span className="text-[12px] text-[#404943] flex items-center gap-1 cursor-pointer hover:text-[#0f5238]"><span className="material-symbols-outlined text-sm">help</span> Help</span>
              <span className="text-[12px] text-[#404943] flex items-center gap-1 cursor-pointer hover:text-[#0f5238]"><span className="material-symbols-outlined text-sm">security</span> Privacy</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-12 pb-32">
          {/* Header Section */}
          <section className="max-w-6xl mx-auto mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[#765a05] text-[14px] tracking-widest uppercase font-semibold">Social Harmony</span>
                <h2 className="font-display text-[36px] md:text-[48px] font-bold text-[#0f5238] mt-2 leading-tight">Dosha Compatibility</h2>
                <p className="text-[18px] text-[#404943] mt-2 max-w-xl leading-relaxed">Understand how your energetic profile interacts with your loved ones to foster deeper connection and balance.</p>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#765a05] text-[#765a05] text-[14px] font-semibold hover:bg-[#765a05]/5 transition-colors">
                  <span className="material-symbols-outlined">person_add</span> Invite Friend
                </button>
              </div>
            </div>
          </section>

          {/* Main Interaction View: Bento Grid Style */}
          <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Radar Charts & Profiles Card */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 shadow-2xl shadow-[#0f5238]/5 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#ffd87c]/30 flex items-center justify-center mb-2 mx-auto">
                      <span className="material-symbols-outlined text-[#765a05] text-3xl">local_fire_department</span>
                    </div>
                    <span className="font-display text-[16px] font-semibold block">You (Pitta)</span>
                  </div>
                  <span className="material-symbols-outlined text-[#bfc9c1]">sync_alt</span>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#c1ecd4]/30 flex items-center justify-center mb-2 mx-auto">
                      <span className="material-symbols-outlined text-[#274f3d] text-3xl">water_drop</span>
                    </div>
                    <span className="font-display text-[16px] font-semibold block">Aria (Kapha)</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="px-4 py-2 bg-[#2d6a4f]/10 text-[#0f5238] rounded-full text-[14px] font-bold">Dynamic Balance</span>
                </div>
              </div>

              {/* Visual Visualization Area */}
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 py-8 z-10">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Animated Radar Circles */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#bfc9c1]/30 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-[#bfc9c1]/30"></div>
                  <div className="absolute inset-12 rounded-full border-2 border-[#bfc9c1]/30"></div>
                  
                  {/* Simplified Radar Chart Visual */}
                  <svg className="absolute inset-0 w-full h-full drop-shadow-xl" viewBox="0 0 100 100">
                    <polygon className="transition-all duration-500 hover:fill-opacity-40" fill="rgba(118, 90, 5, 0.2)" points="50,10 90,40 70,85 30,85 10,40" stroke="#765a05" strokeWidth="2"></polygon>
                    <polygon className="transition-all duration-500 hover:fill-opacity-40" fill="rgba(39, 79, 61, 0.2)" points="50,25 75,50 60,75 40,75 25,50" stroke="#274f3d" strokeWidth="2"></polygon>
                  </svg>
                  
                  <div className="relative bg-white/90 rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-xl border border-[#bfc9c1]/20">
                    <span className="text-[12px] text-[#404943] leading-none mb-1">Score</span>
                    <span className="font-display text-[36px] text-[#0f5238] font-bold leading-none">84%</span>
                  </div>
                </div>

                <div className="space-y-6 max-w-xs">
                  <h4 className="font-display text-[24px] font-semibold text-[#0f5238]">Compatibility Analysis</h4>
                  <p className="text-[16px] text-[#404943] leading-relaxed">Pitta’s fire finds grounding in Kapha’s earthy stability. Aria provides a cooling influence on your active nature, preventing burnout.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#f2efd5] rounded-full text-[12px] text-[#1d1c0d] font-medium border border-[#bfc9c1]/20">Grounding</span>
                    <span className="px-3 py-1 bg-[#f2efd5] rounded-full text-[12px] text-[#1d1c0d] font-medium border border-[#bfc9c1]/20">Synergistic</span>
                    <span className="px-3 py-1 bg-[#f2efd5] rounded-full text-[12px] text-[#1d1c0d] font-medium border border-[#bfc9c1]/20">Supportive</span>
                  </div>
                </div>
              </div>

              {/* Ambient Mandala Detail */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 opacity-10 pointer-events-none text-[#0f5238]">
                <svg className="fill-current" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.5"></circle>
                  <circle cx="50" cy="50" fill="none" r="35" stroke="currentColor" strokeWidth="1"></circle>
                  <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"></path>
                </svg>
              </div>
            </div>

            {/* Shared Meals Card */}
            <div className="md:col-span-4 flex flex-col gap-8">
              <div className="glass-card rounded-3xl p-6 shadow-lg shadow-[#0f5238]/5 hover:shadow-xl transition-all h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-display text-[18px] font-semibold text-[#0f5238]">Best Shared Meals</h4>
                  <span className="material-symbols-outlined text-[#765a05]">restaurant</span>
                </div>
                <ul className="space-y-4 flex-1">
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[#f8f4db] overflow-hidden shrink-0">
                      <img alt="Quinoa Salad" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150&h=150" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[14px] text-[#1d1c0d] group-hover:text-[#0f5238] transition-colors">Spiced Quinoa & Roots</p>
                      <p className="text-[12px] text-[#404943]">Balances Fire & Water</p>
                    </div>
                    <span className="material-symbols-outlined text-[#bfc9c1] group-hover:text-[#0f5238] transition-colors">chevron_right</span>
                  </li>
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[#f8f4db] overflow-hidden shrink-0">
                      <img alt="Green Dal" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150&h=150" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[14px] text-[#1d1c0d] group-hover:text-[#0f5238] transition-colors">Coconut Mung Dal</p>
                      <p className="text-[12px] text-[#404943]">Cooling & Light</p>
                    </div>
                    <span className="material-symbols-outlined text-[#bfc9c1] group-hover:text-[#0f5238] transition-colors">chevron_right</span>
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-[#765a05] text-white rounded-full text-[14px] font-semibold hover:scale-95 transition-transform flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_month</span> Plan Meal
                </button>
              </div>
            </div>
            
            {/* Joint Activities */}
            <div className="md:col-span-12 glass-card rounded-3xl p-6 shadow-lg shadow-[#0f5238]/5 hover:shadow-xl transition-all border-l-4 border-[#274f3d]">
              <h4 className="font-display text-[18px] font-semibold text-[#0f5238] mb-4">Ideal Joint Activities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#c1ecd4]/20 rounded-2xl">
                  <span className="material-symbols-outlined text-[#274f3d] text-2xl">park</span>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-[#1d1c0d]">Evening Nature Walk</p>
                    <p className="text-[12px] text-[#404943] mt-1">Gentle motion for Kapha, cooling for Pitta.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#c1ecd4]/20 rounded-2xl">
                  <span className="material-symbols-outlined text-[#274f3d] text-2xl">self_improvement</span>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-[#1d1c0d]">Restorative Yoga</p>
                    <p className="text-[12px] text-[#404943] mt-1">Unites your mental energies in stillness.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Communication Tips */}
          <section className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-3xl p-8 border-t-4 border-[#765a05]/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#ffd87c] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#795d08]">forum</span>
                </div>
                <h4 className="font-display text-[24px] font-semibold text-[#0f5238]">Communication Tips</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-bold text-[14px] text-[#765a05] uppercase tracking-wider">For You</p>
                  <p className="text-[16px] text-[#404943] italic">"Acknowledge Aria's need for time. Avoid pushing for immediate decisions when her Kapha is dominant."</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-[14px] text-[#274f3d] uppercase tracking-wider">For Aria</p>
                  <p className="text-[16px] text-[#404943] italic">"Appreciate your directness. Pitta thrives on clarity and structured plans. Be concise."</p>
                </div>
              </div>
            </div>

            {/* Community Insight Component */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center text-center bg-[#2d6a4f]/5 border border-[#0f5238]/10">
              <span className="material-symbols-outlined text-[#0f5238] text-5xl mb-4">tips_and_updates</span>
              <h4 className="font-display text-[24px] font-semibold text-[#0f5238] mb-2">Pro Balance Insight</h4>
              <p className="text-[16px] text-[#404943] px-4 leading-relaxed">Did you know? Pitta-Kapha pairs often excel in long-term projects where Pitta leads the vision and Kapha ensures sustainable execution.</p>
              <Link to="/community" className="mt-4 text-[#0f5238] font-bold text-[14px] hover:underline">Learn more in Community</Link>
            </div>
          </section>
        </main>
      </div>

      {/* BottomNavBar (Visible on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-20 bg-[#fefae0]/90 backdrop-blur-2xl border-t border-[#bfc9c1]/20 shadow-2xl shadow-[#0f5238]/10">
        <Link to="/coach" className="flex flex-col items-center justify-center text-[#404943]/70 hover:text-[#0f5238] transition-all">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[14px] font-semibold">Coach</span>
        </Link>
        <Link to="/symptoms" className="flex flex-col items-center justify-center text-[#404943]/70 hover:text-[#0f5238] transition-all">
          <span className="material-symbols-outlined">health_and_safety</span>
          <span className="text-[14px] font-semibold">Symptom</span>
        </Link>
        <Link to="/" className="flex flex-col items-center justify-center text-[#404943]/70 hover:text-[#0f5238] transition-all">
          <span className="material-symbols-outlined">home_max</span>
          <span className="text-[14px] font-semibold">Home</span>
        </Link>
        <Link to="/community" className="flex flex-col items-center justify-center text-[#404943]/70 hover:text-[#0f5238] transition-all">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[14px] font-semibold">Community</span>
        </Link>
        <Link to="/compatibility" className="flex flex-col items-center justify-center text-[#0f5238] bg-[#2d6a4f]/20 rounded-xl px-3 py-1 scale-90 transition-all duration-300">
          <span className="material-symbols-outlined">diversity_1</span>
          <span className="text-[14px] font-semibold">Dosha</span>
        </Link>
      </nav>
    </div>
  );
}
