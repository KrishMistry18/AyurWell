import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Community() {
  const { user } = useAuth();
  const username = user?.name || user?.username || "Prana Seeker";
  const initials = username.slice(0, 2).toUpperCase();
  const dosha = localStorage.getItem("userDosha") || "Vata-Pitta";

  useEffect(() => {
    document.title = "AyurWell - Community Feed";
  }, []);

  return (
    <div className="bg-[#fefae0] text-[#1d1c0d] font-sans min-h-screen relative">
      <style>{`
        .parchment-texture {
            background-color: #fefae0;
        }
        .mandala-bg {
            background-image: radial-gradient(circle at 2px 2px, rgba(45, 106, 79, 0.05) 1px, transparent 0);
            background-size: 40px 40px;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .grain-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
      <div className="grain-overlay"></div>
      <div className="mandala-bg absolute inset-0 pointer-events-none z-0"></div>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-16 h-16 bg-[#fefae0]/80 backdrop-blur-xl border-b border-[#bfc9c1]/30 shadow-sm shadow-[#0f5238]/5">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#0f5238] md:hidden cursor-pointer">menu</span>
          <Link to="/" className="font-display text-[24px] font-semibold text-[#0f5238] tracking-tight">AyurWell</Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link to="/community" className="text-[#0f5238] font-semibold text-[14px]">Community</Link>
            <Link to="/dashboard" className="text-[#404943] hover:text-[#0f5238] transition-colors text-[14px]">Rituals</Link>
            <Link to="/dosha" className="text-[#404943] hover:text-[#0f5238] transition-colors text-[14px]">Dosha Guide</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#0f5238] cursor-pointer hover:bg-[#e7e3ca]/50 p-2 rounded-full transition-colors">notifications</span>
          <Link to="/dashboard" className="material-symbols-outlined text-[#0f5238] cursor-pointer hover:bg-[#e7e3ca]/50 p-2 rounded-full transition-colors">account_circle</Link>
        </div>
      </header>

      <div className="flex pt-16 h-screen overflow-hidden relative z-10">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col h-full w-80 bg-[#fefae0] border-r border-[#bfc9c1]/30 shadow-xl shadow-[#0f5238]/5 overflow-y-auto">
          <div className="p-8 flex flex-col items-center border-b border-[#bfc9c1]/20">
            <div className="w-20 h-20 rounded-full bg-[#b1f0ce] flex items-center justify-center mb-4 ring-4 ring-[#2d6a4f]/10">
              <span className="font-display text-[32px] font-semibold text-[#0f5238]">{initials}</span>
            </div>
            <h3 className="font-display text-[24px] font-semibold text-[#0f5238]">{username}</h3>
            <p className="text-[#404943] text-[16px]">{dosha} Balance</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-4 px-4 py-3 text-[#404943] hover:bg-[#2d6a4f]/10 rounded-xl transition-all">
              <span className="material-symbols-outlined">wb_sunny</span>
              <span className="text-[18px]">Daily Rituals</span>
            </Link>
            <Link to="/herbs" className="flex items-center gap-4 px-4 py-3 text-[#404943] hover:bg-[#2d6a4f]/10 rounded-xl transition-all">
              <span className="material-symbols-outlined">auto_stories</span>
              <span className="text-[18px]">Herb Encyclopedia</span>
            </Link>
            <Link to="/diet-generator" className="flex items-center gap-4 px-4 py-3 text-[#404943] hover:bg-[#2d6a4f]/10 rounded-xl transition-all">
              <span className="material-symbols-outlined">restaurant_menu</span>
              <span className="text-[18px]">Meal Swap AI</span>
            </Link>
            <Link to="/community" className="flex items-center gap-4 px-4 py-3 text-[#0f5238] font-bold border-l-4 border-[#765a05] bg-[#2d6a4f]/10 rounded-r-xl transition-all">
              <span className="material-symbols-outlined">group</span>
              <span className="text-[18px]">Community</span>
            </Link>
            <Link to="/analytics" className="flex items-center gap-4 px-4 py-3 text-[#404943] hover:bg-[#2d6a4f]/10 rounded-xl transition-all">
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-[18px]">Wellness Score</span>
            </Link>
            <Link to="/compatibility" className="flex items-center gap-4 px-4 py-3 text-[#404943] hover:bg-[#2d6a4f]/10 rounded-xl transition-all">
              <span className="material-symbols-outlined">diversity_1</span>
              <span className="text-[18px]">Compatibility</span>
            </Link>
          </nav>
          <div className="p-6">
            <button className="w-full bg-[#0f5238] text-white py-4 rounded-full text-[14px] font-semibold shadow-lg shadow-[#0f5238]/20 hover:scale-[0.98] transition-transform">
              Upgrade to Premium
            </button>
          </div>
        </aside>

        {/* Main Feed Content */}
        <main className="flex-1 overflow-y-auto bg-white/50 px-4 md:px-12 py-8">
          {/* Filter Pills */}
          <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
            <button className="px-6 py-2.5 rounded-full bg-[#0f5238] text-white text-[14px] font-semibold flex-shrink-0">All Feeds</button>
            <button className="px-6 py-2.5 rounded-full bg-[#ede9cf] text-[#404943] hover:bg-[#2d6a4f]/20 text-[14px] font-semibold flex-shrink-0 transition-all border border-[#bfc9c1]/30">Vata</button>
            <button className="px-6 py-2.5 rounded-full bg-[#ede9cf] text-[#404943] hover:bg-[#2d6a4f]/20 text-[14px] font-semibold flex-shrink-0 transition-all border border-[#bfc9c1]/30">Pitta</button>
            <button className="px-6 py-2.5 rounded-full bg-[#ede9cf] text-[#404943] hover:bg-[#2d6a4f]/20 text-[14px] font-semibold flex-shrink-0 transition-all border border-[#bfc9c1]/30">Kapha</button>
            <button className="px-6 py-2.5 rounded-full bg-[#ede9cf] text-[#404943] hover:bg-[#2d6a4f]/20 text-[14px] font-semibold flex-shrink-0 transition-all border border-[#bfc9c1]/30">Recipes</button>
            <button className="px-6 py-2.5 rounded-full bg-[#ede9cf] text-[#404943] hover:bg-[#2d6a4f]/20 text-[14px] font-semibold flex-shrink-0 transition-all border border-[#bfc9c1]/30">Rituals</button>
          </div>

          {/* Feed Grid */}
          <div className="max-w-4xl mx-auto space-y-10 pb-24">
            {/* Post 1 */}
            <article className="glass-card rounded-[2rem] overflow-hidden shadow-2xl shadow-[#0f5238]/5 group">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ffd87c] flex items-center justify-center text-[#765a05] font-bold">AJ</div>
                  <div>
                    <h4 className="font-display text-[18px] font-semibold text-[#0f5238]">Anjali Joshi</h4>
                    <p className="text-[12px] text-[#404943]">2 hours ago • <span className="text-[#765a05] font-semibold">Pitta Routine</span></p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#404943] cursor-pointer">more_horiz</span>
              </div>
              <div className="px-6">
                <p className="text-[18px] text-[#1d1c0d] mb-6 leading-relaxed">
                  Starting my morning with a refreshing cooling smoothie. Perfect for balancing Pitta during this summer heat! 🌿✨ 
                </p>
              </div>
              <div className="relative h-[400px] w-full overflow-hidden">
                <img alt="Pitta Cooling Smoothie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800&h=600" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-[12px]">Recipe Attached</div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 group/btn hover:scale-105 transition-transform" onClick={(e) => e.currentTarget.classList.toggle('text-[#0f5238]')}>
                    <span className="material-symbols-outlined text-[#0f5238]" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                    <span className="text-[14px] font-semibold text-[#404943]">Namaste (24)</span>
                  </button>
                  <button className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[#404943]">chat_bubble</span>
                    <span className="text-[14px] font-semibold text-[#404943]">Comment</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[#404943]">share</span>
                  <span className="text-[14px] font-semibold text-[#404943]">Share</span>
                </button>
              </div>
            </article>

            {/* Post 2 */}
            <article className="glass-card rounded-[2rem] overflow-hidden shadow-2xl shadow-[#0f5238]/5 group">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#b1f0ce] flex items-center justify-center text-[#0f5238] font-bold">RS</div>
                  <div>
                    <h4 className="font-display text-[18px] font-semibold text-[#0f5238]">Rohan Sharma</h4>
                    <p className="text-[12px] text-[#404943]">5 hours ago • <span className="text-[#765a05] font-semibold">Vata Balance</span></p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#404943] cursor-pointer">more_horiz</span>
              </div>
              <div className="px-6">
                <p className="text-[18px] text-[#1d1c0d] mb-6 leading-relaxed">
                  Grounding my Vata energy today with some deep meditation and golden milk. The turmeric aroma is so therapeutic.
                </p>
              </div>
              <div className="relative h-[400px] w-full overflow-hidden">
                <img alt="Golden Milk Ritual" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1595981234058-a9302fb97229?auto=format&fit=crop&q=80&w=800&h=600" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 group/btn hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[#0f5238]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span className="text-[14px] font-semibold text-[#404943]">Namaste (56)</span>
                  </button>
                  <button className="flex items-center gap-2 hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[#404943]">chat_bubble</span>
                    <span className="text-[14px] font-semibold text-[#404943]">12 Comments</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[#404943]">share</span>
                  <span className="text-[14px] font-semibold text-[#404943]">Share</span>
                </button>
              </div>
            </article>
          </div>
        </main>

        {/* Right Sidebar (Trends/Active Users) */}
        <aside className="hidden xl:flex flex-col w-[380px] h-full bg-[#f8f4db]/50 p-8 overflow-y-auto space-y-10 border-l border-[#bfc9c1]/20">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-[20px] font-semibold text-[#0f5238]">Trending Recipes</h3>
              <span className="text-[#765a05] text-[12px] font-bold cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                  <img alt="Kichari" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200&h=200" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1d1c0d] group-hover:text-[#0f5238] transition-colors">Spring Kichari Bowl</p>
                  <p className="text-[12px] text-[#404943]">Perfect for Detoxification</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                  <img alt="Golden Beet Salad" className="w-full h-full object-cover group-hover:scale-110 transition-transform" src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200&h=200" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1d1c0d] group-hover:text-[#0f5238] transition-colors">Golden Beet Salad</p>
                  <p className="text-[12px] text-[#404943]">Grounding Vata Energy</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-[20px] font-semibold text-[#0f5238]">Active Prana Seekers</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#c1ecd4] flex items-center justify-center text-[#274f3d] font-bold text-[12px]">ML</div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0f5238] border-2 border-[#fefae0] rounded-full"></div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#1d1c0d]">Maya Lakshmi</span>
                </div>
                <span className="text-[12px] px-3 py-1 rounded-full bg-[#2d6a4f]/10 text-[#0f5238]">Kapha</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#ffd87c] flex items-center justify-center text-[#765a05] font-bold text-[12px]">SK</div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0f5238] border-2 border-[#fefae0] rounded-full"></div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#1d1c0d]">Sanjay Kapoor</span>
                </div>
                <span className="text-[12px] px-3 py-1 rounded-full bg-[#2d6a4f]/10 text-[#0f5238]">Pitta</span>
              </div>
            </div>
          </section>

          <div className="mt-auto pt-6 border-t border-[#bfc9c1]/20">
            <div className="bg-[#2d6a4f]/20 p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-display text-[16px] font-semibold text-[#0f5238] mb-2">Weekly Soul Circle</h4>
                <p className="text-[12px] text-[#1d1c0d] mb-4">Join our live meditation session tomorrow at 6 AM.</p>
                <button className="text-[14px] font-bold text-[#0f5238] underline">Set Reminder</button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[#0f5238]/10 text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
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
        <Link to="/community" className="flex flex-col items-center justify-center text-[#0f5238] bg-[#2d6a4f]/20 rounded-xl px-3 py-1 scale-90 transition-all duration-300">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[14px] font-semibold">Community</span>
        </Link>
        <Link to="/dosha" className="flex flex-col items-center justify-center text-[#404943]/70 hover:text-[#0f5238] transition-all">
          <span className="material-symbols-outlined">diversity_1</span>
          <span className="text-[14px] font-semibold">Dosha</span>
        </Link>
      </nav>
    </div>
  );
}
