import React from "react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface dark:bg-zinc-950 transition-colors duration-300">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Animated Lotus SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 text-primary animate-[spin_12s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Center seed pod */}
          <circle cx="50" cy="50" r="8" className="fill-accent/20 stroke-accent" />
          
          {/* Petals */}
          {/* Top Petal */}
          <path d="M50 50 C50 30, 42 20, 50 10 C58 20, 50 30, 50 50" className="fill-primary/10" />
          {/* Right Petal */}
          <path d="M50 50 C70 50, 80 42, 90 50 C80 58, 70 50, 50 50" className="fill-primary/10" />
          {/* Bottom Petal */}
          <path d="M50 50 C50 70, 58 80, 50 90 C42 80, 50 70, 50 50" className="fill-primary/10" />
          {/* Left Petal */}
          <path d="M50 50 C30 50, 20 58, 10 50 C20 42, 30 50, 50 50" className="fill-primary/10" />
          
          {/* Diagonal Petals */}
          <path d="M50 50 C38 38, 28 28, 22 22 C28 16, 38 26, 50 50" className="fill-primary/5" />
          <path d="M50 50 C62 38, 72 28, 78 22 C72 16, 62 26, 50 50" className="fill-primary/5" />
          <path d="M50 50 C62 62, 72 72, 78 78 C72 84, 62 74, 50 50" className="fill-primary/5" />
          <path d="M50 50 C38 62, 28 72, 22 78 C28 84, 38 74, 50 50" className="fill-primary/5" />
        </svg>
        
        {/* Inner breathing circle */}
        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border border-primary/20 animate-ping opacity-75" />
      </div>
      <p className="mt-4 font-display text-lg font-semibold text-primary animate-pulse tracking-wide">
        Loading AyurWell...
      </p>
    </div>
  );
}
