import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const getLogs = (): any[] => {
  try {
    const l = localStorage.getItem("wellness_logs");
    return l ? JSON.parse(l) : [];
  } catch {
    return [];
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [energy, setEnergy] = useState(6);
  const [sleep, setSleep] = useState(7.5);
  const [water, setWater] = useState(1500);
  const [mood, setMood] = useState(4);

  useEffect(() => {
    document.title = "AyurWell - Dashboard";
    setLogs(getLogs());
  }, []);

  const username = user?.name || user?.username || localStorage.getItem("username") || "Prana Balance";
  const dominantDosha = localStorage.getItem("userDosha") || "Pitta";
  const todayStr = format(new Date(), "EEEE, MMMM d");
  const dayN = logs.length + 1;
  const initials = username.slice(0, 2).toUpperCase();

  const handleSave = () => {
    const currentLogs = getLogs();
    const entry = { date: format(new Date(), "MMM d"), energy, sleep, water, mood, ts: Date.now() };
    currentLogs.push(entry);
    localStorage.setItem("wellness_logs", JSON.stringify(currentLogs));
    setLogs(currentLogs);
  };

  return (
    <div className="bg-[#FEFAE0] text-[#1d1c0d] min-h-screen relative overflow-x-hidden selection:bg-secondary selection:text-on-secondary font-sans">
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(45, 106, 79, 0.1);
            box-shadow: 0 8px 32px 0 rgba(45, 106, 79, 0.05);
        }
      `}</style>
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0f5238] via-transparent to-transparent"></div>

      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex flex-col p-6 space-y-4 fixed left-0 top-0 h-full w-64 rounded-r-xl z-40 bg-[#fefae0]/90 backdrop-blur-lg shadow-xl shadow-[#274f3d]/5 border-r border-[#bfc9c1]/30 transition-transform duration-300">
        <div className="mb-8 pl-4">
          <h1 className="font-display text-2xl text-[#0f5238] font-semibold italic">AyurWell</h1>
        </div>
        <div className="flex items-center gap-4 mb-6 pl-4">
          <div className="w-12 h-12 rounded-full bg-[#0f5238] text-white flex items-center justify-center font-bold border-2 border-[#ede9cf] shadow-sm">
            {initials}
          </div>
          <div>
            <p className="font-sans text-sm text-[#1d1c0d] font-semibold">{username}</p>
            <p className="font-sans text-xs text-[#404943]">{dominantDosha} Constitution</p>
          </div>
        </div>
        <ul className="flex-1 space-y-2">
          <li>
            <Link to="/rituals" className="flex items-center gap-3 text-[#404943] hover:bg-[#ede9cf] rounded-lg px-4 py-3 transition-all">
              <span className="material-symbols-outlined">wb_sunny</span>
              <span className="font-sans text-sm font-medium">Daily Rituals</span>
            </Link>
          </li>
          <li>
            <Link to="/herbs" className="flex items-center gap-3 text-[#404943] hover:bg-[#ede9cf] rounded-lg px-4 py-3 transition-all">
              <span className="material-symbols-outlined">menu_book</span>
              <span className="font-sans text-sm font-medium">Herb Encyclopedia</span>
            </Link>
          </li>
          <li>
            <Link to="/mealswap" className="flex items-center gap-3 text-[#404943] hover:bg-[#ede9cf] rounded-lg px-4 py-3 transition-all">
              <span className="material-symbols-outlined">restaurant</span>
              <span className="font-sans text-sm font-medium">Meal Swap AI</span>
            </Link>
          </li>
          <li>
            <Link to="/wellness-score" className="flex items-center gap-3 text-[#404943] hover:bg-[#ede9cf] rounded-lg px-4 py-3 transition-all">
              <span className="material-symbols-outlined">insert_chart</span>
              <span className="font-sans text-sm font-medium">Wellness Score</span>
            </Link>
          </li>
          <li>
            <Link to="/compatibility" className="flex items-center gap-3 bg-[#e4e1ca] text-[#0f5238] rounded-lg px-4 py-3 font-semibold shadow-inner border border-[#bfc9c1]/20">
              <span className="material-symbols-outlined">group</span>
              <span className="font-sans text-sm font-medium">Dosha Compatibility</span>
            </Link>
          </li>
          <li>
            <Link to="/community" className="flex items-center gap-3 text-[#404943] hover:bg-[#ede9cf] rounded-lg px-4 py-3 transition-all">
              <span className="material-symbols-outlined">forum</span>
              <span className="font-sans text-sm font-medium">Community</span>
            </Link>
          </li>
        </ul>
        <div className="mt-auto space-y-4">
          <Link to="/premium" className="flex items-center justify-center w-full bg-[#0f5238] text-white font-sans text-sm font-semibold py-3 rounded-xl hover:bg-[#1a6e4d] transition-colors shadow-md border border-[#274f3d]">
            Upgrade to Premium
          </Link>
        </div>
      </nav>

      {/* TopNavBar (Mobile) */}
      <header className="md:hidden flex justify-between items-center w-full px-5 h-20 bg-[#fefae0]/80 backdrop-blur-xl sticky top-0 shadow-[0_8px_32px_0_rgba(45,106,79,0.05)] z-50">
        <h1 className="font-display text-2xl text-[#0f5238] font-semibold italic">AyurWell</h1>
        <div className="flex items-center gap-4">
          <button className="text-[#404943] hover:opacity-80 transition-all duration-200">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-6 md:pt-12 px-5 md:px-6 max-w-[1280px] mx-auto pb-20 relative z-10 flex flex-col gap-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h2 className="font-display text-3xl md:text-[40px] md:leading-[48px] text-[#274f3d] mb-2">Namaste, {username.split(' ')[0]} 🙏</h2>
            <p className="font-sans text-base text-[#404943] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {todayStr} • Day {dayN} of Ayurvedic Journey
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-[#bfc9c1]/30 shadow-sm">
            <div className="flex items-center gap-2 border-r border-[#bfc9c1]/50 pr-4">
              <span className="text-[#765a05] text-lg">🔥</span>
              <span className="font-sans text-sm text-[#1d1c0d] font-semibold capitalize">{dominantDosha} Dominant</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="font-sans text-sm text-[#274f3d]">Morning Routine</span>
              <span className="material-symbols-outlined text-[#0f5238] text-[20px]">check_circle</span>
            </div>
          </div>
        </header>

        {/* Top Row: 4 Stat Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Energy */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffdf96]/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#ffdf96]/30 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#ffd87c] text-[#795d08] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <span className="font-sans text-xs text-[#765a05] font-medium bg-[#ffd87c]/30 px-2 py-1 rounded-md">Prana</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-sans text-base text-[#404943] mb-1">Energy Level</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold text-[#1d1c0d]">{energy}</span>
                <span className="font-sans text-xs text-[#404943]">/ 10</span>
              </div>
              <div className="w-full bg-[#e7e3ca] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#765a05] h-full rounded-full" style={{ width: `${(energy/10)*100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">bedtime</span>
              </div>
              <span className="font-sans text-xs text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded-md">Nidra</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-sans text-base text-[#404943] mb-1">Sleep Quality</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold text-[#1d1c0d]">{sleep}</span>
                <span className="font-sans text-xs text-[#404943]">hrs</span>
              </div>
              <div className="w-full bg-[#e7e3ca] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(sleep/12)*100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Water */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">water_drop</span>
              </div>
              <span className="font-sans text-xs text-cyan-700 font-medium bg-cyan-50 px-2 py-1 rounded-md">Jala</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-sans text-base text-[#404943] mb-1">Hydration</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold text-[#1d1c0d]">{water}</span>
                <span className="font-sans text-xs text-[#404943]">ml</span>
              </div>
              <div className="w-full bg-[#e7e3ca] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${(water/3000)*100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Mood */}
          <div className="glass-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#b1f0ce]/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#2d6a4f] text-[#a8e7c5] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">mood</span>
              </div>
              <span className="font-sans text-xs text-[#0f5238] font-medium bg-[#2d6a4f]/20 px-2 py-1 rounded-md">Sattva</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-sans text-base text-[#404943] mb-1">Overall Mood</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold text-[#1d1c0d]">{mood}</span>
                <span className="font-sans text-xs text-[#404943]">/ 5</span>
              </div>
              <div className="w-full bg-[#e7e3ca] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#0f5238] h-full rounded-full" style={{ width: `${(mood/5)*100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Middle Row: Meal Plan & Dosha Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Meal Plan (60%) */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-3">
            <div className="flex justify-between items-center mb-6 border-b border-[#bfc9c1]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e7e3ca] flex items-center justify-center text-[#0f5238]">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <h3 className="font-display text-2xl text-[#274f3d] font-semibold">Today's Meal Plan</h3>
              </div>
              <Link to="/diet-generator" className="text-[#0f5238] hover:text-[#95d4b3] transition-colors text-sm font-medium">View All</Link>
            </div>
            <div className="space-y-4">
              {/* Breakfast */}
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f8f4db] transition-colors border border-transparent hover:border-[#bfc9c1]/30 group">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-[#fefae0] w-12 h-12 flex items-center justify-center rounded-lg shadow-sm border border-[#bfc9c1]/20 group-hover:scale-105 transition-transform">🥣</div>
                  <div>
                    <h4 className="font-sans text-sm text-[#1d1c0d] font-semibold mb-1">Warm Spiced Oatmeal</h4>
                    <p className="font-sans text-xs text-[#404943] italic">Balances Vata, aids morning digestion.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#e7e3ca] text-[#404943] rounded-full font-sans text-xs font-medium">350 kcal</span>
              </div>
              {/* Lunch */}
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f8f4db] transition-colors border border-transparent hover:border-[#bfc9c1]/30 group">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-[#fefae0] w-12 h-12 flex items-center justify-center rounded-lg shadow-sm border border-[#bfc9c1]/20 group-hover:scale-105 transition-transform">🥗</div>
                  <div>
                    <h4 className="font-sans text-sm text-[#1d1c0d] font-semibold mb-1">Cooling Cucumber Lentil Salad</h4>
                    <p className="font-sans text-xs text-[#404943] italic">Soothes Pitta fire, provides sustained energy.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#e7e3ca] text-[#404943] rounded-full font-sans text-xs font-medium">420 kcal</span>
              </div>
              {/* Dinner */}
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f8f4db] transition-colors border border-transparent hover:border-[#bfc9c1]/30 group">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-[#fefae0] w-12 h-12 flex items-center justify-center rounded-lg shadow-sm border border-[#bfc9c1]/20 group-hover:scale-105 transition-transform">🍲</div>
                  <div>
                    <h4 className="font-sans text-sm text-[#1d1c0d] font-semibold mb-1">Light Mung Dal Soup</h4>
                    <p className="font-sans text-xs text-[#404943] italic">Promotes restful sleep, easy on the gut.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#e7e3ca] text-[#404943] rounded-full font-sans text-xs font-medium">280 kcal</span>
              </div>
            </div>
          </div>

          {/* Right: Dosha Profile (40%) */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl text-[#274f3d] font-semibold">Your Dosha Profile</h3>
              <span className="material-symbols-outlined text-[#bfc9c1] cursor-help" title="Based on your recent assessments">info</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
              {/* CSS Radar Chart */}
              <div className="relative w-48 h-48 mb-4">
                <div className="absolute inset-0 rounded-full border border-[#bfc9c1]/20"></div>
                <div className="absolute inset-6 rounded-full border border-[#bfc9c1]/20"></div>
                <div className="absolute inset-12 rounded-full border border-[#bfc9c1]/20"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#bfc9c1]/20"></div>
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#bfc9c1]/20" style={{ transform: 'rotate(60deg)' }}></div>
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#bfc9c1]/20" style={{ transform: 'rotate(120deg)' }}></div>
                
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                    <polygon className="transition-all duration-1000 ease-in-out" fill="rgba(118, 90, 5, 0.2)" points={dominantDosha.toLowerCase() === 'pitta' ? "50,15 85,75 25,85" : "50,30 75,50 40,80"} stroke="#765a05" strokeWidth="2"></polygon>
                    <circle cx={dominantDosha.toLowerCase() === 'pitta' ? "50" : "50"} cy={dominantDosha.toLowerCase() === 'pitta' ? "15" : "30"} fill="#765a05" r="3"></circle>
                    <circle cx={dominantDosha.toLowerCase() === 'pitta' ? "85" : "75"} cy={dominantDosha.toLowerCase() === 'pitta' ? "75" : "50"} fill="#765a05" r="3"></circle>
                    <circle cx={dominantDosha.toLowerCase() === 'pitta' ? "25" : "40"} cy={dominantDosha.toLowerCase() === 'pitta' ? "85" : "80"} fill="#765a05" r="3"></circle>
                  </svg>
                </div>
                
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-sans text-sm text-[#765a05] font-bold">Pitta</div>
                <div className="absolute -bottom-6 right-0 font-sans text-sm text-[#404943]">Kapha</div>
                <div className="absolute -bottom-6 left-0 font-sans text-sm text-[#404943]">Vata</div>
              </div>
              <div className="text-center mt-4">
                <p className="font-sans text-base text-[#1d1c0d]">Your {dominantDosha} is currently elevated.</p>
                <p className="font-sans text-xs text-[#404943] mt-1">Focus on cooling foods and calming activities today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Row: Quick Log */}
        <section className="glass-card rounded-2xl p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
            <svg fill="none" height="300" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 100 100" width="300">
              <circle cx="50" cy="50" r="40"></circle>
              <circle cx="50" cy="50" r="30"></circle>
              <circle cx="50" cy="50" r="20"></circle>
              <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-2xl text-[#274f3d] font-semibold">Quick Log Today</h3>
                <p className="font-sans text-xs text-[#404943] mt-1">Update your evening stats to maintain your flow.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-sm text-[#1d1c0d] flex items-center gap-2"><span className="material-symbols-outlined text-[#765a05] text-sm">bolt</span> Energy Levels</label>
                  <span className="font-sans text-xs text-[#404943] font-medium">{energy}/10</span>
                </div>
                <input className="w-full h-2 bg-[#e7e3ca] rounded-lg appearance-none cursor-pointer accent-[#765a05]" max="10" min="1" type="range" value={energy} onChange={e => setEnergy(+e.target.value)} />
              </div>
              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-sm text-[#1d1c0d] flex items-center gap-2"><span className="material-symbols-outlined text-blue-600 text-sm">bedtime</span> Sleep Hours</label>
                  <span className="font-sans text-xs text-[#404943] font-medium">{sleep} hrs</span>
                </div>
                <input className="w-full h-2 bg-[#e7e3ca] rounded-lg appearance-none cursor-pointer accent-blue-500" max="12" min="4" step="0.5" type="range" value={sleep} onChange={e => setSleep(+e.target.value)} />
              </div>
              {/* Slider 3 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-sm text-[#1d1c0d] flex items-center gap-2"><span className="material-symbols-outlined text-cyan-600 text-sm">water_drop</span> Water Intake</label>
                  <span className="font-sans text-xs text-[#404943] font-medium">{water} ml</span>
                </div>
                <input className="w-full h-2 bg-[#e7e3ca] rounded-lg appearance-none cursor-pointer accent-cyan-500" max="3000" min="0" step="100" type="range" value={water} onChange={e => setWater(+e.target.value)} />
              </div>
              {/* Slider 4 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-sm text-[#1d1c0d] flex items-center gap-2"><span className="material-symbols-outlined text-[#0f5238] text-sm">mood</span> Mood state</label>
                  <span className="font-sans text-xs text-[#404943] font-medium">{mood}/5</span>
                </div>
                <input className="w-full h-2 bg-[#e7e3ca] rounded-lg appearance-none cursor-pointer accent-[#0f5238]" max="5" min="1" type="range" value={mood} onChange={e => setMood(+e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end border-t border-[#bfc9c1]/20 pt-6">
              <button onClick={handleSave} className="bg-[#0f5238] text-white font-sans text-sm px-8 py-3 rounded-full hover:bg-[#274f3d] transition-colors shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">save</span>
                Save Today's Log
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#fefae0]/90 backdrop-blur-lg border-t border-[#bfc9c1]/30 pb-safe z-50 flex justify-around items-center h-16 shadow-[0_-4px_16px_0_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center justify-center w-full h-full text-[#404943] hover:text-[#0f5238]">
          <span className="material-symbols-outlined">home</span>
          <span className="font-sans text-[10px] mt-1">Home</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-[#2d6a4f] font-semibold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-sans text-[10px] mt-1">Dashboard</span>
        </Link>
        <Link to="/diet-generator" className="flex flex-col items-center justify-center w-full h-full text-[#404943] hover:text-[#0f5238]">
          <span className="material-symbols-outlined">restaurant</span>
          <span className="font-sans text-[10px] mt-1">Diet</span>
        </Link>
        <Link to="/analytics" className="flex flex-col items-center justify-center w-full h-full text-[#404943] hover:text-[#0f5238]">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-sans text-[10px] mt-1">Stats</span>
        </Link>
      </nav>
    </div>
  );
}
