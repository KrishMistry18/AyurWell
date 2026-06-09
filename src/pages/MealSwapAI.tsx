import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Utensils, ArrowRight, Loader2 } from "lucide-react";

export default function MealSwapAI() {
  const [mealInput, setMealInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ original: string, swap: string, reason: string } | null>(null);

  useEffect(() => {
    document.title = "Meal Swap AI - AyurWell";
  }, []);

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;
    
    setLoading(true);
    // Mock AI response
    setTimeout(() => {
      let swap = "";
      let reason = "";
      const lower = mealInput.toLowerCase();
      
      if (lower.includes("pizza")) {
        swap = "Quinoa Flatbread with Roasted Veggies & Pesto";
        reason = "Traditional pizza is heavy, acidic, and difficult to digest (creates ama). A quinoa flatbread with fresh pesto and root vegetables is grounding, easier on digestion, and balances Vata and Pitta.";
      } else if (lower.includes("burger")) {
        swap = "Sweet Potato & Black Bean Patties on Sourdough";
        reason = "Heavy meats can stagnate digestion. Sweet potatoes are grounding and naturally sweet (balancing Vata/Pitta), while black beans provide clean protein. Sourdough has naturally occurring probiotics.";
      } else if (lower.includes("ice cream")) {
        swap = "Warm Spiced Stewed Apples or Dates";
        reason = "Cold dairy suppresses the digestive fire (agni) and increases Kapha (mucus). Warm, stewed fruit with cinnamon and cardamom satisfies the sweet tooth while stimulating healthy digestion.";
      } else {
        swap = `Warm Spiced ${mealInput.split(' ')[0] || 'Bowl'} with Seasonal Veggies`;
        reason = "In Ayurveda, warm and gently spiced foods are preferred to raw or heavy ingredients. Adding digestive spices like cumin, coriander, and fennel will make this much easier to process.";
      }

      setResult({ original: mealInput, swap, reason });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page-enter min-h-screen bg-surface dark:bg-[#12121e] text-on-surface pt-[100px] pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 shadow-sm border border-primary/20">
          <Utensils className="w-8 h-8" />
        </div>
        <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Meal Swap AI</h1>
        <p className="text-on-surface-variant mt-3 max-w-xl mx-auto">
          Craving something heavy or unhealthy? Let AyurWell find a delicious, dosha-balancing alternative for you.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1c1c2e] rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 dark:border-white/10 mb-8">
        <form onSubmit={handleSwap} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              What are you craving right now?
            </label>
            <input
              type="text"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder="e.g., A large pepperoni pizza with extra cheese..."
              className="w-full ayur-input rounded-xl px-4 py-3 bg-surface-bright dark:bg-[#12121e] border-outline-variant/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-gray-100"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !mealInput.trim()}
            className="w-full ayur-btn-primary rounded-xl py-3 flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Find Ayurvedic Swap
          </button>
        </form>

        {result && !loading && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/30">
                <div className="text-xs font-bold uppercase text-red-500 tracking-wider mb-1">Your Craving</div>
                <div className="font-semibold text-gray-800 dark:text-gray-200">{result.original}</div>
              </div>
              
              <div className="text-gray-400 rotate-90 md:rotate-0">
                <ArrowRight className="w-6 h-6" />
              </div>
              
              <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-100 dark:border-green-900/30">
                <div className="text-xs font-bold uppercase text-green-600 dark:text-green-400 tracking-wider mb-1">Ayurvedic Swap</div>
                <div className="font-semibold text-green-800 dark:text-green-300">{result.swap}</div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/20">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Why this works
              </h4>
              <p className="text-sm text-blue-700/80 dark:text-blue-200/70 leading-relaxed">
                {result.reason}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link to="/dashboard" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
