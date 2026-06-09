import React from "react";
import { Link } from "react-router-dom";

export default function MealSwapAI() {
  React.useEffect(() => {
    document.title = "Meal Swap AI - AyurWell";
  }, []);

  return (
    <div className="page-enter min-h-screen bg-surface dark:bg-[#12121e] text-on-surface pt-[120px] pb-20 px-6 max-w-7xl mx-auto">
      <div className="bg-surface-bright dark:bg-[#1c1c2e] rounded-2xl p-8 shadow-sm border border-outline-variant/20 dark:border-white/10 text-center">
        <div className="text-6xl mb-6">🔄</div>
        <h1 className="font-headline-lg text-3xl text-primary font-bold mb-4">Meal Swap AI</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">
          Find Ayurvedic alternatives for your favorite meals based on your unique dosha profile.
        </p>
        <Link to="/dashboard" className="ayur-btn-primary px-6 py-3">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
