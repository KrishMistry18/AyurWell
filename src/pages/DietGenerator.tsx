import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw, Printer, Save, Check, Award, Sun, Utensils, Target, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TIPS = [
  "Consulting ancient Ayurvedic texts...",
  "Balancing your mind-body constitution...",
  "Selecting seasonal, life-giving ingredients...",
  "Harmonizing recipes with your Agni (digestive fire)..."
];

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" }
] as const;

function buildMockPlan(dosha: string, season: string, dietPref: string, goal: string) {
  const makeMeals = (dayName: string) => {
    const isPitta = dosha === "Pitta";
    const isVata = dosha === "Vata";
    const isKapha = dosha === "Kapha";

    const isVegan = dietPref.toLowerCase().includes("vegan");
    const isVeg = dietPref.toLowerCase().includes("veg") || isVegan;

    // Breakfast
    let breakfastName = `${dosha}-Balancing Porridge`;
    let breakfastIngredients = ["Oats", "Dates", "Cardamom", isVegan ? "Almond Milk" : "Ghee"];
    let breakfastBenefit = `Grounding and warm breakfast tailored to steady ${dosha} agni.`;
    let breakfastCal = 320;
    let bp = 12, bc = 48, bf = 10;
    let breakfastImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCI1a7xoJOfwyklj4fp96cXJ0aiETxgEHM2YmpTDSPfikJZ_dPgsULAXMyeT-Z8FMoeOEujtk_NAtBXKllNUf3veabET_VdEyMPBY26TbiOOFB4B84GE-3em61OE0HH8AOTXMYU36HAsZzD43oq6grPZwZuvQmFeOUNwEuafxdGXHrMwXZYejpkyNDVUO06tyBrVY3PX94gd4yxO3yHR4iFXcksvAWG1FI2Lwl9_mBcKyBgvZvt4w1HBy2MNQKi_K4B3Z2UxlCfIsY";

    if (isPitta) {
      breakfastName = "Cooling Coconut Oats with Fresh Berries";
      breakfastIngredients = ["Rolled Oats", "Coconut Flakes", "Maple Syrup", "Blueberries"];
      breakfastBenefit = "Sweet and cooling qualities to pacify hot, active Pitta energy.";
      breakfastCal = 340;
    } else if (isKapha) {
      breakfastName = "Spiced Amaranth Porridge with Stewed Apples";
      breakfastIngredients = ["Amaranth Grain", "Stewed Apples", "Cinnamon", "Ginger Powder"];
      breakfastBenefit = "Light, warm, and stimulating morning grain ideal for Kapha.";
      breakfastCal = 290;
    }

    // Lunch
    let lunchName = "Seasonal Kitchari Bowl";
    let lunchIngredients = ["Basmati Rice", "Yellow Mung Dal", "Ghee", "Coriander", "Cumin"];
    let lunchBenefit = "Traditional tri-doshic recipe, easy to digest and deeply detoxifying.";
    let lunchCal = 420;
    let lp = 18, lc = 55, lf = 12;
    let lunchImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuB7VsLTrRyfu8UYMhxsorzAFVZAdV4_FrzqOHbG9_nWUx2ElmBv_JPh1GiM1TeX5rg2QP1zNaGO_9qantDWJfMrCclQ3MHQxMvi7qGcbCNiXr5gnsJFgfw85gam87wyZLZ9uc3b-FDlLxLGa8Njs7q828c5wLxQA8mkkp5ADwcXGy4p6wz8h80ohbUEGylzf7ueR9VJ8B4AR1ppWZRleQejguE72jIimuElSAK-rNHurUO8IBzEnobsf_G5lpSCHunWPpdjO6C85lA";

    if (isPitta) {
      lunchName = "Basmati Bowl with Steamed Asparagus & Zucchini";
      lunchIngredients = ["Basmati Rice", "Asparagus", "Zucchini", "Coriander", "Fennel Seeds"];
      lunchBenefit = "A grounding, sweet, and bitter mid-day meal to soothe digestive fire.";
      lunchCal = 450;
      lp = 14; lc = 62; lf = 12;
    } else if (isKapha) {
      lunchName = "Spiced Quinoa & Red Lentil Bowl";
      lunchIngredients = ["Quinoa", "Red Lentils", "Ginger", "Mustard Seeds", "Kale"];
      lunchBenefit = "Light, dry, and heating lunch to stimulate digestion and energy.";
      lunchCal = 390;
    } else if (isVata) {
      lunchName = "Rich Mung Dal with Sweet Potatoes & Ghee";
      lunchIngredients = ["Mung Dal", "Sweet Potatoes", "Ghee", "Asafoetida", "Carrots"];
      lunchBenefit = "Oily, heavy, and warming dish to ground the airy, light Vata dosha.";
      lunchCal = 460;
    }

    // Dinner
    let dinnerName = "Light Seasonal Vegetable Soup";
    let dinnerIngredients = ["Zucchini", "Carrots", "Celery", "Fresh Herbs", "Vegetable Broth"];
    let dinnerBenefit = "Light evening meal for restful sleep and agni preservation.";
    let dinnerCal = 280;
    let dp = 10, dc = 30, df = 8;
    let dinnerImg = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600";

    if (!isVeg) {
      dinnerName = "Warming Bone Broth with Pulled Chicken & Root Veggies";
      dinnerIngredients = ["Chicken Broth", "Organic Chicken", "Carrots", "Sweet Potato", "Thyme"];
      dinnerBenefit = "Deeply nourishing and restorative proteins to build physical tissues.";
      dinnerCal = 350;
      dp = 28; dc = 18; df = 15;
    } else if (isPitta) {
      dinnerName = "Creamy Mung Bean Soup with Coconut Milk";
      dinnerIngredients = ["Whole Mung Beans", "Coconut Milk", "Cilantro", "Turmeric"];
      dinnerBenefit = "Cooling and calming soup that supports evening wind-down.";
      dinnerCal = 310;
    } else if (isKapha) {
      dinnerName = "Steamed Cauliflower & Broccoli Soup with Roasted Seeds";
      dinnerIngredients = ["Cauliflower", "Broccoli", "Pumpkin Seeds", "Black Pepper", "Turmeric"];
      dinnerBenefit = "Extremely light and low-calorie soup ideal for Kapha evenings.";
      dinnerCal = 240;
    }

    // Snack
    let snackName = "Spiced Stewed Fruit";
    let snackIngredients = ["Apple or Pear", "Cinnamon", "Clove", "Water"];
    let snackBenefit = "Sweet taste to soothe the nervous system in the afternoon.";
    let snackCal = 120;
    let sp = 1, sc = 28, sf = 2;
    let snackImg = "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&q=80&w=600";

    if (isPitta) {
      snackName = "Soothing Soaked Almonds & Raisins";
      snackIngredients = ["Blanched Almonds", "Sultana Raisins", "Rose Water"];
      snackBenefit = "Sweet, cooling snacks to nourish memory and satisfy cravings.";
      snackCal = 160;
    } else if (isKapha) {
      snackName = "Dry Roasted Pumpkin Seeds with Turmeric";
      snackIngredients = ["Pumpkin Seeds", "Turmeric", "Sea Salt", "Black Pepper"];
      snackBenefit = "A dry, light, and warming snack to boost vitality.";
      snackCal = 140;
    }

    return [
      { emoji: "🌅", type: "Breakfast", name: breakfastName, calories: breakfastCal, ingredients: breakfastIngredients, benefit: breakfastBenefit, p: bp, c: bc, f: bf, img: breakfastImg },
      { emoji: "☀️", type: "Lunch", name: lunchName, calories: lunchCal, ingredients: lunchIngredients, benefit: lunchBenefit, p: lp, c: lc, f: lf, img: lunchImg },
      { emoji: "🌙", type: "Dinner", name: dinnerName, calories: dinnerCal, ingredients: dinnerIngredients, benefit: dinnerBenefit, p: dp, c: dc, f: df, img: dinnerImg },
      { emoji: "🍎", type: "Snack", name: snackName, calories: snackCal, ingredients: snackIngredients, benefit: snackBenefit, p: sp, c: sc, sf: sf, img: snackImg }
    ];
  };

  const days: Record<string, { meals: ReturnType<typeof makeMeals> }> = {};
  DAYS.forEach((d) => {
    days[d.key] = { meals: makeMeals(d.label) };
  });
  return { dosha, season, dietPref, goal, generatedAt: Date.now(), days };
}

const DietGenerator = () => {
  const [doshaName, setDoshaName] = useState("Vata");
  const [season, setSeason] = useState<string>("Summer");
  const [dietPref, setDietPref] = useState<string>("Vegetarian");
  const [goal, setGoal] = useState<string>("Energy Boost");
  const [planGenerated, setPlanGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [activeDay, setActiveDay] = useState<string>("mon");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Personalized Diet Plan - AyurWell";
    try {
      const d = localStorage.getItem("dosha_result");
      if (d) {
        setDoshaName(JSON.parse(d).dominant || "Vata");
      }
    } catch (e) {
      console.error(e);
    }
    const existing = localStorage.getItem("diet_plan_7day");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setSeason(parsed.season || "Summer");
        setDietPref(parsed.dietPref || "Vegetarian");
        setGoal(parsed.goal || "Energy Boost");
        setPlanGenerated(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setTipIdx((i) => (i + 1) % TIPS.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [loading]);

  const currentPlan = useMemo(() => {
    return buildMockPlan(doshaName, season, dietPref, goal);
  }, [doshaName, season, dietPref, goal]);

  const generate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2200));
    localStorage.setItem("diet_plan_7day", JSON.stringify(currentPlan));
    setPlanGenerated(true);
    setLoading(false);
    toast({
      title: "Plan Created!",
      description: `Your custom ${doshaName} diet plan has been generated.`
    });
  };

  const handleReset = () => {
    localStorage.removeItem("diet_plan_7day");
    setPlanGenerated(false);
  };

  const handleSave = () => {
    localStorage.setItem("diet_plan_7day", JSON.stringify(currentPlan));
    toast({
      title: "Saved Successfully",
      description: "Your personalized diet plan has been saved to your profile."
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Preparing Document",
      description: "Compiling your print-friendly Ayurvedic Diet Plan..."
    });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Determine styles for the dosha badge
  const doshaBadgeColors: Record<string, string> = {
    Vata: "bg-dosha-vata/20 text-dosha-vata border-dosha-vata/30",
    Pitta: "bg-dosha-pitta/20 text-dosha-pitta border-dosha-pitta/30",
    Kapha: "bg-dosha-kapha/20 text-dosha-kapha border-dosha-kapha/30"
  };

  const doshaEmojis: Record<string, string> = {
    Vata: "🍃",
    Pitta: "🔥",
    Kapha: "🌱"
  };

  return (
    <div className="relative min-h-screen bg-surface dark:bg-[#1A1A2E] text-on-surface dark:text-gray-100 overflow-hidden pb-32">
      {/* Decorative overlays */}
      <div className="grain-overlay opacity-[0.03] dark:opacity-[0.015]" />
      <div className="mandala-bg absolute inset-0 pointer-events-none z-0" />

      <main className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-16 py-8 md:py-12 flex flex-col gap-8 md:gap-12">
        
        {/* Top Header Section */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-primary dark:text-primary-light flex items-center gap-3">
                🌿 Personalized Diet Plan
              </h1>
              <p className="font-sans text-on-surface-variant dark:text-gray-400 mt-2 max-w-2xl">
                Curated recipes and meal structures designed to balance your mind-body constitution (Prakriti) and support your current wellness objectives.
              </p>
            </div>
            
            {/* Dosha Badge */}
            <div className={`inline-flex items-center gap-2 border px-5 py-2.5 rounded-full shadow-sm w-fit ${doshaBadgeColors[doshaName] || "bg-primary/20 text-primary border-primary/30"}`}>
              <span className="text-xl leading-none">{doshaEmojis[doshaName] || "🪷"}</span>
              <span className="font-sans text-sm font-semibold uppercase tracking-wider">{doshaName} constitution</span>
            </div>
          </div>
        </section>

        {/* LOADING STATE */}
        {loading && (
          <section className="glass-card rounded-3xl p-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-xl border border-primary/10">
            <Loader2 className="h-12 w-12 animate-spin text-primary dark:text-primary-light mb-6" />
            <h3 className="font-display text-2xl text-primary dark:text-primary-light mb-3">Aligning Your Diet</h3>
            <p className="font-sans text-on-surface-variant dark:text-gray-400 animate-pulse">{TIPS[tipIdx]}</p>
          </section>
        )}

        {/* CONFIGURATION & GENERATOR FORM (When not loading) */}
        {!loading && !planGenerated && (
          <section className="max-w-3xl mx-auto w-full">
            <div className="glass-card rounded-3xl p-8 md:p-12 border border-outline-variant/30 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 border border-primary/5 rounded-full pointer-events-none" />
              
              <div className="text-center mb-10">
                <span className="text-4xl">🪷</span>
                <h2 className="font-display text-3xl text-primary dark:text-primary-light mt-2">Nourish Your Prakriti</h2>
                <p className="text-sm text-on-surface-variant dark:text-gray-400 mt-2">Tailor your Ayurvedic dietary guideline in just a few clicks</p>
              </div>

              <div className="space-y-8">
                {/* 1. Season Selection */}
                <div>
                  <h3 className="font-sans font-medium text-on-surface dark:text-gray-200 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Sun className="w-[18px] h-[18px] text-amber-500" /> Current Season
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { id: "Spring", label: "Spring", emoji: "🌸" },
                      { id: "Summer", label: "Summer", emoji: "☀️" },
                      { id: "Autumn", label: "Autumn", emoji: "🍂" },
                      { id: "Winter", label: "Winter", emoji: "❄️" }
                    ].map((s) => {
                      const isActive = season === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSeason(s.id)}
                          className={`rounded-2xl border p-4 text-center transition-all ${
                            isActive
                              ? "border-primary dark:border-primary-light bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold shadow-sm ring-1 ring-primary/20"
                              : "border-outline-variant/40 bg-surface-container-lowest dark:bg-[#1f1f38] hover:border-primary/45"
                          }`}
                        >
                          <span className="text-2xl block mb-1">{s.emoji}</span>
                          <span className="text-xs font-sans font-medium uppercase tracking-wider">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Dietary Preferences */}
                <div>
                  <h3 className="font-sans font-medium text-on-surface dark:text-gray-200 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Utensils className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" /> Dietary Preference
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "Vegan", label: "Vegan", emoji: "🌱" },
                      { id: "Vegetarian", label: "Vegetarian", emoji: "🥦" },
                      { id: "Omnivore", label: "Omnivore", emoji: "🍗" }
                    ].map((p) => {
                      const isActive = dietPref === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setDietPref(p.id)}
                          className={`rounded-2xl border py-4 text-center transition-all ${
                            isActive
                              ? "border-primary dark:border-primary-light bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold shadow-sm ring-1 ring-primary/20"
                              : "border-outline-variant/40 bg-surface-container-lowest dark:bg-[#1f1f38] hover:border-primary/45"
                          }`}
                        >
                          <span className="text-xl block mb-1">{p.emoji}</span>
                          <span className="text-xs font-sans font-medium uppercase tracking-wider">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Primary Health Goal */}
                <div>
                  <h3 className="font-sans font-medium text-on-surface dark:text-gray-200 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Target className="w-[18px] h-[18px] text-rose-500" /> Primary Wellness Goal
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "Energy Boost", label: "Energy Boost", desc: "Build stamina and agni vitality", emoji: "⚡" },
                      { id: "Detox", label: "Detox & Cleanse", desc: "Clear internal toxins (Ama)", emoji: "🧼" },
                      { id: "Digestion", label: "Gut Health", desc: "Enhance bowel & gut comfort", emoji: "🧘" },
                      { id: "Weight", label: "Weight Balance", desc: "Stabilize body tissues", emoji: "⚖️" }
                    ].map((g) => {
                      const isActive = goal === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoal(g.id)}
                          className={`rounded-2xl border p-4 text-left transition-all flex items-start gap-3 ${
                            isActive
                              ? "border-primary dark:border-primary-light bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold shadow-sm ring-1 ring-primary/20"
                              : "border-outline-variant/40 bg-surface-container-lowest dark:bg-[#1f1f38] hover:border-primary/45"
                          }`}
                        >
                          <span className="text-2xl mt-0.5">{g.emoji}</span>
                          <div>
                            <span className="text-sm font-sans font-semibold block">{g.label}</span>
                            <span className="text-[11px] font-sans opacity-70 block mt-0.5">{g.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={generate}
                    className="w-full bg-primary dark:bg-primary-light text-on-primary dark:text-primary-dark font-sans text-sm font-semibold uppercase tracking-wider py-4 rounded-full shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-98"
                  >
                    <span>Generate My 7-Day Plan</span>
                    <span>🌿</span>
                  </button>
                  <div className="text-center mt-3">
                    <Link to="/dashboard" className="text-xs text-on-surface-variant dark:text-gray-400 hover:text-primary underline">
                      Return to Dashboard
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ACTIVE MEAL PLAN CANVAS */}
        {!loading && planGenerated && (
          <>
            {/* Configuration Quick Info (Dynamic Bento Box Layout) */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Quick Settings Indicator Card */}
              <div className="bg-surface-container-lowest dark:bg-[#16162d] rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-sans text-on-surface-variant dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Plan Focus
                  </h4>
                  <p className="text-lg font-bold text-primary dark:text-primary-light">{doshaName}-Balancing</p>
                  <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">Stabilizing {doshaName} dosha with dietary remedies.</p>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-4 text-xs text-primary dark:text-primary-light font-sans font-semibold hover:underline flex items-center gap-1 w-fit bg-transparent border-0 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Customize Inputs
                </button>
              </div>

              {/* Season Selection Bento */}
              <div className="bg-surface-container-lowest dark:bg-[#16162d] rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h4 className="text-[11px] font-sans text-on-surface-variant dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <Clock className="w-3.5 h-3.5" /> Season
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Spring", "Summer", "Autumn", "Winter"].map((s) => {
                    const active = season === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSeason(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all ${
                          active
                            ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold border border-primary/30"
                            : "border border-outline-variant/30 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preference Bento */}
              <div className="bg-surface-container-lowest dark:bg-[#16162d] rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h4 className="text-[11px] font-sans text-on-surface-variant dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <Utensils className="w-3.5 h-3.5" /> Preference
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Vegan", "Vegetarian", "Omnivore"].map((p) => {
                    const active = dietPref === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setDietPref(p)}
                        className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all ${
                          active
                            ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-semibold border border-primary/30"
                            : "border border-outline-variant/30 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Bento */}
              <div className="bg-surface-container-lowest dark:bg-[#16162d] rounded-2xl p-6 shadow-sm border border-outline-variant/20">
                <h4 className="text-[11px] font-sans text-on-surface-variant dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <Target className="w-3.5 h-3.5" /> Primary Goal
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Energy Boost", "Detox", "Digestion", "Weight"].map((g) => {
                    const active = goal === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all text-center ${
                          active
                            ? "bg-primary dark:bg-primary-light text-on-primary dark:text-primary-dark font-semibold shadow-sm"
                            : "bg-surface-container-low dark:bg-[#1f1f3a] text-on-surface dark:text-gray-300 hover:bg-surface-container-high border border-outline-variant/20"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

            </section>

            {/* Diet Plan Canvas */}
            <section className="flex flex-col gap-8">
              
              {/* Day Tabs Navigation */}
              <div className="flex overflow-x-auto hide-scrollbar border-b border-outline-variant/30 pb-px">
                {DAYS.map((d) => {
                  const isActive = activeDay === d.key;
                  return (
                    <button
                      key={d.key}
                      onClick={() => setActiveDay(d.key)}
                      className={`px-6 py-3 font-sans text-sm font-semibold transition-all relative whitespace-nowrap bg-transparent border-0 cursor-pointer ${
                        isActive
                          ? "text-primary dark:text-primary-light border-b-2 border-accent dark:border-accent font-bold"
                          : "text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
                      }`}
                    >
                      {d.label}
                      {isActive && (
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Meals List */}
              <div className="flex flex-col gap-6">
                {(currentPlan.days[activeDay]?.meals || []).map((m: any, i: number) => (
                  <article
                    key={i}
                    className="bg-surface-container-lowest dark:bg-[#16162d] rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col md:flex-row overflow-hidden group hover:shadow-md transition-all duration-300"
                  >
                    
                    {/* Meal Image/Illustration Container */}
                    <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden bg-surface-container-low dark:bg-[#202040]">
                      <img
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={m.img}
                      />
                      <div className="absolute top-3 left-3 bg-primary dark:bg-primary-dark/80 text-on-primary dark:text-primary-light px-3 py-1 rounded-full text-xs font-sans font-semibold flex items-center gap-1 shadow-sm backdrop-blur-md bg-opacity-95">
                        <Check className="w-3.5 h-3.5" /> Balances {doshaName}
                      </div>
                    </div>

                    {/* Meal Content Panel */}
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-sans text-xs text-accent-dark dark:text-accent font-bold uppercase tracking-widest">{m.type}</h4>
                        <span className="font-sans text-xs font-semibold text-on-surface-variant dark:text-gray-400 bg-surface-container-low dark:bg-[#222240] px-2.5 py-1 rounded">
                          {m.calories} kcal
                        </span>
                      </div>
                      
                      <h2 className="font-display text-xl md:text-2xl text-primary dark:text-primary-light font-semibold mb-3">
                        {m.name}
                      </h2>
                      
                      <p className="font-sans text-sm text-on-surface-variant dark:text-gray-300 mb-6 leading-relaxed">
                        {m.benefit}
                      </p>

                      {/* Ingredients & Nutrients Metrics */}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/20 pt-4">
                        
                        {/* Ingredients Pills */}
                        <div className="flex flex-wrap gap-1.5 max-w-lg">
                          {(m.ingredients || []).map((ing: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded-full bg-surface dark:bg-[#202040] text-on-surface-variant dark:text-gray-300 px-3 py-1 text-xs border border-outline-variant/20 font-sans"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>

                        {/* Nutrition Macros */}
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            P: {m.p}g
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                            C: {m.c}g
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                            F: {m.sf !== undefined ? m.sf : m.f}g
                          </span>
                        </div>
                      </div>

                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

      </main>

      {/* Sticky Bottom Actions Bar (only when plan is generated) */}
      {planGenerated && !loading && (
        <div className="fixed bottom-0 left-0 w-full bg-surface/90 dark:bg-[#1A1A2E]/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-8px_32px_0_rgba(45,106,79,0.05)] z-50 transition-colors">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="hidden sm:block">
              <p className="font-sans text-xs text-on-surface-variant dark:text-gray-400">
                Review your 7-day Ayurvedic plan. Save it to keep it active on your dashboard.
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-3 rounded-full border-2 border-accent dark:border-accent text-accent-dark dark:text-accent font-sans text-sm font-semibold hover:bg-accent/5 transition-all bg-transparent cursor-pointer"
              >
                <Printer className="w-4.5 h-4.5" /> Print / Download PDF
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-8 py-3 rounded-full bg-primary dark:bg-primary-light text-on-primary dark:text-primary-dark font-sans text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all border-0 cursor-pointer active:scale-98"
              >
                <Save className="w-4.5 h-4.5" /> Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietGenerator;
