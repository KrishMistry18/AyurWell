import { useEffect } from "react";
import { Link } from "react-router-dom";
import Features from "./Features";

export default function Home() {
  useEffect(() => {
    document.title = "AyurWell - Discover Your Dosha";
  }, []);

  return (
    <div className="bg-[#FEFAE0] text-on-surface antialiased overflow-x-hidden relative min-h-screen">
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      <style>{`
        .orbit-scene {
            perspective: 1200px;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .orbit-center {
            position: relative;
            width: 0;
            height: 0;
            transform-style: preserve-3d;
            transform: rotateX(-5deg);
        }
        .orbit-card {
            position: absolute;
            top: 50%;
            left: 50%;
            transform-origin: center;
        }
        .card-pitta {
            animation: orbit-pitta 24s linear infinite;
            margin-left: -160px;
            margin-top: -105px;
        }
        .card-kapha {
            animation: orbit-kapha 24s linear infinite;
            margin-left: -140px;
            margin-top: -85px;
        }
        .card-vata {
            animation: orbit-vata 24s linear infinite;
            margin-left: -140px;
            margin-top: -85px;
        }

        @keyframes orbit-pitta {
            from { transform: rotateY(0deg) translateZ(260px) rotateY(0deg); }
            to { transform: rotateY(360deg) translateZ(260px) rotateY(-360deg); }
        }
        @keyframes orbit-kapha {
            from { transform: rotateY(120deg) translateZ(260px) rotateY(-120deg); }
            to { transform: rotateY(480deg) translateZ(260px) rotateY(-480deg); }
        }
        @keyframes orbit-vata {
            from { transform: rotateY(240deg) translateZ(260px) rotateY(-240deg); }
            to { transform: rotateY(600deg) translateZ(260px) rotateY(-600deg); }
        }
        
        @keyframes fadeDown {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes growLine {
            0% { width: 0; }
            100% { width: 100%; }
        }
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Main Content Area */}
      <main className="relative w-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row px-4 md:px-8 lg:px-16 max-w-[1440px] mx-auto overflow-x-hidden pb-16">
        {/* Background Mandala */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10 pointer-events-none -mt-32 -mr-32 animate-[spin_20s_linear_infinite] z-0">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0 L55 40 L95 45 L55 50 L50 90 L45 50 L5 45 L45 40 Z" fill="#2d6a4f" opacity="0.5"></path>
            <circle cx="50" cy="50" fill="none" r="30" stroke="#2d6a4f" strokeWidth="0.5"></circle>
            <path d="M50 15 L53 35 L70 30 L55 45 L85 50 L55 55 L70 70 L53 65 L50 85 L47 65 L30 70 L45 55 L15 50 L45 45 L30 30 L47 35 Z" fill="none" stroke="#2d6a4f" strokeWidth="0.5"></path>
          </svg>
        </div>

        {/* Left Content (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center pt-16 lg:pt-0 pb-20 lg:pb-0 z-10 relative pl-4 lg:pl-8">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-primary/10 rounded-full px-5 py-2 mb-8 w-fit shadow-sm relative overflow-hidden group animate-[fadeUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="text-primary text-sm animate-pulse">🌿</span>
            <span className="font-sans text-[14px] leading-[20px] text-primary tracking-wide uppercase font-semibold">Ancient Wisdom • Modern Science</span>
          </div>

          <h1 className="font-display text-4xl lg:text-6xl text-[#1a1a1a] mb-6 flex flex-col gap-2 animate-[fadeUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <span>Discover Your</span>
            <span className="relative w-fit text-primary text-5xl lg:text-7xl italic font-bold tracking-tight pb-2">
              Dosha.
              <span className="absolute bottom-0 left-0 h-1.5 bg-secondary rounded-full animate-[growLine_1s_ease-out_0.5s_forwards]" style={{ width: 0 }}></span>
            </span>
            <span>Transform Your Life.</span>
          </h1>

          <p className="font-sans text-[18px] leading-[28px] text-gray-600 max-w-xl mb-10 animate-[fadeUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Unlock personalized wellness plans rooted in 5,000 years of Ayurvedic tradition, elevated by modern health analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-12 animate-[fadeUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <Link to="/dosha" className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white font-sans text-[14px] leading-[20px] font-medium px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(45,106,79,0.25)] hover:shadow-[0_12px_25px_rgba(45,106,79,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
              Take Free Assessment
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <Link to="/features" className="bg-white/40 backdrop-blur-sm border border-primary/20 text-primary font-sans text-[14px] leading-[20px] font-medium px-8 py-4 rounded-full hover:bg-white/60 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center shadow-sm">
              Explore Plans
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 items-center animate-[fadeUp_0.8s_ease-out_forwards]" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              <span className="font-sans text-sm text-gray-600 font-medium">Free Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              <span className="font-sans text-sm text-gray-600 font-medium">Personalized Plans</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              <span className="font-sans text-sm text-gray-600 font-medium">Evidence-Based</span>
            </div>
          </div>
        </div>

        {/* Right Visual (45%) */}
        <div className="w-full lg:w-[45%] relative h-[600px] lg:h-auto flex items-center justify-center z-10 mt-10 lg:mt-0">
          <div className="orbit-scene">
            <div className="orbit-center">
              {/* Vata Card */}
              <div className="orbit-card card-vata bg-white/70 backdrop-blur-lg rounded-2xl p-6 w-[280px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl drop-shadow-sm">🌬️</span>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-blue-600 text-sm">air</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl text-gray-800 mb-1 font-bold">Vata</h3>
                <p className="font-sans text-sm text-gray-500 mb-4">Air & Space</p>
                <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '75%', animation: 'growLine 1.5s ease-out forwards' }}></div>
                </div>
              </div>

              {/* Kapha Card */}
              <div className="orbit-card card-kapha bg-white/70 backdrop-blur-lg rounded-2xl p-6 w-[280px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-green-100 bg-gradient-to-br from-[#e8f5e9]/80 to-white/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl drop-shadow-sm">🌿</span>
                  <div className="w-10 h-10 rounded-full bg-[#c8e6c9] flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[#2e7d32] text-sm">water_drop</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl text-gray-800 mb-1 font-bold">Kapha</h3>
                <p className="font-sans text-sm text-gray-500 mb-4">Earth & Water</p>
                <div className="h-1.5 w-full bg-[#c8e6c9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4caf50] rounded-full" style={{ width: '60%', animation: 'growLine 1.5s ease-out forwards' }}></div>
                </div>
              </div>

              {/* Pitta Card */}
              <div className="orbit-card card-pitta bg-[#FFFDF5]/95 backdrop-blur-xl rounded-2xl p-8 w-[320px] shadow-[0_30px_60px_rgba(212,175,55,0.15)] border border-[#f5df99]/40 bg-gradient-to-br from-[#FFFDF5] to-[#FCF4D9]">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl drop-shadow-md">🔥</span>
                  <div className="w-12 h-12 rounded-full bg-[#fce4a1] flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-[#b07d00] text-lg">local_fire_department</span>
                  </div>
                </div>
                <h3 className="font-display text-4xl text-[#8b6508] mb-2 font-bold">Pitta</h3>
                <p className="font-sans text-[16px] leading-[24px] text-gray-600 mb-6">Fire & Water</p>
                <div className="flex items-center justify-between font-sans text-sm text-gray-600 mb-3">
                  <span>Metabolism</span>
                  <span className="font-medium text-[#b07d00]">High</span>
                </div>
                <div className="h-2 w-full bg-[#f0e6c8] rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-[#d4af37] to-[#b07d00] rounded-full" style={{ width: '85%', animation: 'growLine 1.5s ease-out forwards' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
      <Features />
    </div>
  );
}
