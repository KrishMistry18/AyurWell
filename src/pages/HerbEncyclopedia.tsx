import { useMemo, useState } from "react";
import { Leaf, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DoshaEffect = "balances" | "aggravates" | "neutral";

export type Herb = {
  name: string;
  sanskrit: string;
  emoji: string;
  description: string;
  benefits: string[];
  dosha: { vata: DoshaEffect; pitta: DoshaEffect; kapha: DoshaEffect };
  bestForm: string;
  avoidIf: string;
  taste: string;
  color: string;
};

const HERBS: Herb[] = [
  { name: "Ashwagandha", sanskrit: "Withania somnifera", emoji: "🌿", description: "Rejuvenating adaptogen supporting stress resilience and sleep.", benefits: ["Stress", "Energy", "Sleep", "Muscle tone"], dosha: { vata: "balances", pitta: "neutral", kapha: "aggravates" }, bestForm: "Powder in warm milk", avoidIf: "Hyperthyroid — consult practitioner", taste: "Bitter, sweet", color: "emerald" },
  { name: "Turmeric", sanskrit: "Haridra", emoji: "🟡", description: "Golden spice supporting healthy inflammation response and digestion.", benefits: ["Inflammation", "Digestion", "Immunity", "Skin"], dosha: { vata: "balances", pitta: "balances", kapha: "balances" }, bestForm: "Fresh or powder with black pepper", avoidIf: "Bleeding disorders, high doses with blood thinners", taste: "Bitter, pungent", color: "amber" },
  { name: "Triphala", sanskrit: "Triphala", emoji: "🍇", description: "Three-fruit formula for gentle detox and regular elimination.", benefits: ["Digestion", "Eyes", "Antioxidant", "Gut motility"], dosha: { vata: "balances", pitta: "balances", kapha: "balances" }, bestForm: "Capsule or tea before bed", avoidIf: "Diarrhea, pregnancy (use supervised)", taste: "All six tastes", color: "purple" },
  { name: "Brahmi", sanskrit: "Bacopa monnieri", emoji: "🧠", description: "Cooling herb for clarity, memory, and nervous system ease.", benefits: ["Focus", "Calm", "Memory", "Cooling"], dosha: { vata: "balances", pitta: "balances", kapha: "neutral" }, bestForm: "Ghee infusion or tea", avoidIf: "Bradycardia — caution", taste: "Bitter", color: "sky" },
  { name: "Neem", sanskrit: "Nimba", emoji: "🌳", description: "Bitter cooling herb for skin and blood purification.", benefits: ["Skin", "Blood sugar", "Cooling", "Microbes"], dosha: { vata: "aggravates", pitta: "balances", kapha: "balances" }, bestForm: "Leaf tea or oil (external)", avoidIf: "Pregnancy, infertility goals", taste: "Bitter", color: "green" },
  { name: "Tulsi", sanskrit: "Holy Basil", emoji: "🌸", description: "Sacred aromatic for respiratory comfort and emotional steadiness.", benefits: ["Respiration", "Stress", "Immunity", "Prana"], dosha: { vata: "balances", pitta: "neutral", kapha: "balances" }, bestForm: "Fresh tea", avoidIf: "Low blood sugar caution", taste: "Pungent, bitter", color: "violet" },
  { name: "Shatavari", sanskrit: "Asparagus racemosus", emoji: "🤍", description: "Nourishing female reproductive tonic and demulcent.", benefits: ["Moisture", "Hormones", "Digestion", "Cooling"], dosha: { vata: "balances", pitta: "balances", kapha: "aggravates" }, bestForm: "Powder with milk", avoidIf: "Kapha congestion excess", taste: "Sweet, bitter", color: "pink" },
  { name: "Amalaki", sanskrit: "Emblica officinalis", emoji: "🍋", description: "Vitamin C–rich rejuvenative for tissues and immunity.", benefits: ["Immunity", "Skin", "Eyes", "Digestion"], dosha: { vata: "balances", pitta: "balances", kapha: "neutral" }, bestForm: "Chyawanprash or powder", avoidIf: "Diarrhea in excess", taste: "Sour, sweet", color: "lime" },
  { name: "Ginger", sanskrit: "Shunti", emoji: "🫚", description: "Warming digestive spark for agni and circulation.", benefits: ["Digestion", "Circulation", "Nausea", "Warmth"], dosha: { vata: "balances", pitta: "aggravates", kapha: "balances" }, bestForm: "Fresh tea or cooking spice", avoidIf: "Active ulcers, bleeding", taste: "Pungent", color: "orange" },
  { name: "Cardamom", sanskrit: "Ela", emoji: "💚", description: "Aromatic carminative for sweet digestion and fresh breath.", benefits: ["Gas", "Breath", "Mood", "Agni"], dosha: { vata: "balances", pitta: "neutral", kapha: "balances" }, bestForm: "Pods in tea or cooking", avoidIf: "GERD if overused", taste: "Sweet, pungent", color: "emerald" },
  { name: "Cumin", sanskrit: "Jiraka", emoji: "🟤", description: "Everyday spice to kindle digestion without overheating.", benefits: ["Bloating", "Agni", "Minerals", "Detox"], dosha: { vata: "balances", pitta: "balances", kapha: "balances" }, bestForm: "Dry roast then powder", avoidIf: "Rare allergy", taste: "Pungent", color: "amber" },
  { name: "Fennel", sanskrit: "Shatapushpa", emoji: "🌼", description: "Sweet cooling digestive for pitta-type acidity.", benefits: ["Gas", "Cooling", "Lactation", "Breath"], dosha: { vata: "balances", pitta: "balances", kapha: "neutral" }, bestForm: "Chew seeds or tea", avoidIf: "Estrogen-sensitive conditions — ask clinician", taste: "Sweet", color: "yellow" },
  { name: "Licorice", sanskrit: "Yashtimadhu", emoji: "🟫", description: "Sweet demulcent for throat, adrenals, and inflamed gut lining.", benefits: ["Throat", "Adrenals", "Mucosa", "Anti-inflammatory"], dosha: { vata: "balances", pitta: "balances", kapha: "aggravates" }, bestForm: "Decoction or powder", avoidIf: "Hypertension, edema, pregnancy high dose", taste: "Sweet", color: "stone" },
  { name: "Manjistha", sanskrit: "Rubia cordifolia", emoji: "🔴", description: "Blood-cleansing herb for clear skin and healthy flow.", benefits: ["Skin", "Blood", "Lymph", "Heat"], dosha: { vata: "neutral", pitta: "balances", kapha: "balances" }, bestForm: "Powder with honey", avoidIf: "Pregnancy without guidance", taste: "Bitter, astringent", color: "rose" },
  { name: "Guduchi", sanskrit: "Tinospora cordifolia", emoji: "🌿", description: "Bitter immune-modulator and fever companion in Ayurvedic care.", benefits: ["Immunity", "Liver", "Fever", "Recovery"], dosha: { vata: "neutral", pitta: "balances", kapha: "balances" }, bestForm: "Stem juice or tablet", avoidIf: "Autoimmune — supervised use", taste: "Bitter", color: "teal" },
  { name: "Bhringraj", sanskrit: "Eclipta alba", emoji: "🖤", description: "Cooling liver and hair tonic in traditional formulas.", benefits: ["Hair", "Liver", "Sleep", "Cooling"], dosha: { vata: "balances", pitta: "balances", kapha: "neutral" }, bestForm: "Oil (scalp) or powder", avoidIf: "Hypotension caution", taste: "Bitter", color: "slate" },
  { name: "Pippali", sanskrit: "Long pepper", emoji: "🌶️", description: "Deep lung and agni stimulant used in small doses.", benefits: ["Lungs", "Metabolism", "Kapha", "Bioavailability"], dosha: { vata: "balances", pitta: "aggravates", kapha: "balances" }, bestForm: "Powder with honey (short courses)", avoidIf: "Hyperacidity, pregnancy", taste: "Pungent", color: "red" },
  { name: "Shankhpushpi", sanskrit: "Convolvulus pluricaulis", emoji: "💙", description: "Cooling nervine for calm focus and sleep onset.", benefits: ["Calm", "Memory", "Sleep", "Pitta mind"], dosha: { vata: "balances", pitta: "balances", kapha: "neutral" }, bestForm: "Powder with milk", avoidIf: "Sedatives — additive effect", taste: "Bitter", color: "indigo" },
  { name: "Arjuna", sanskrit: "Terminalia arjuna", emoji: "🫀", description: "Heart-tree bark for emotional and circulatory steadiness.", benefits: ["Heart", "Cholesterol support", "Calm", "Strength"], dosha: { vata: "neutral", pitta: "balances", kapha: "balances" }, bestForm: "Powder with water", avoidIf: "Hypotension, cardiac meds — clinician", taste: "Astringent", color: "brown" },
  { name: "Vidanga", sanskrit: "Embelia ribes", emoji: "🫐", description: "Digestive spice used in parasite protocols traditionally.", benefits: ["Digestion", "Metabolism", "Kapha", "Cleansing"], dosha: { vata: "neutral", pitta: "neutral", kapha: "balances" }, bestForm: "Powder in formula", avoidIf: "Pregnancy, debility", taste: "Pungent, astringent", color: "violet" },
  { name: "Musta", sanskrit: "Cyperus rotundus", emoji: "🌾", description: "Carminative for menstrual comfort and GI ease.", benefits: ["Cycles", "Gas", "Heat", "Comfort"], dosha: { vata: "balances", pitta: "balances", kapha: "balances" }, bestForm: "Powder decoction", avoidIf: "Constipation tendency in excess", taste: "Bitter, pungent", color: "tan" },
  { name: "Haritaki", sanskrit: "Terminalia chebula", emoji: "🍂", description: "One fruit of triphala — cleansing and vata-moving.", benefits: ["Elimination", "Clarity", "Tissues", "Detox"], dosha: { vata: "balances", pitta: "neutral", kapha: "balances" }, bestForm: "Triphala blend", avoidIf: "Pregnancy, dehydration", taste: "Five tastes", color: "amber" },
  { name: "Bibhitaki", sanskrit: "Terminalia bellirica", emoji: "🍂", description: "Kapha-pacifying fruit in triphala for lungs and weight.", benefits: ["Kapha", "Lungs", "Eyes", "Metabolism"], dosha: { vata: "neutral", pitta: "neutral", kapha: "balances" }, bestForm: "Triphala blend", avoidIf: "Dry constipation tendency", taste: "Astringent", color: "brown" },
  { name: "Jatamansi", sanskrit: "Nardostachys jatamansi", emoji: "💜", description: "Grounding aromatic for anxious vata and busy mind.", benefits: ["Sleep", "Calm", "Focus", "Grounding"], dosha: { vata: "balances", pitta: "balances", kapha: "neutral" }, bestForm: "Oil or powder", avoidIf: "Pregnancy — avoid high dose", taste: "Bitter, astringent", color: "purple" },
  { name: "Guggulu", sanskrit: "Commiphora mukul", emoji: "🪨", description: "Resin for healthy joints, lipids, and tissue metabolism.", benefits: ["Joints", "Metabolism", "Detox", "Kapha"], dosha: { vata: "balances", pitta: "neutral", kapha: "balances" }, bestForm: "Tablet in classical formulas", avoidIf: "Pregnancy, thyroid meds — supervised", taste: "Bitter, astringent", color: "stone" },
];

const tone: Record<DoshaEffect, string> = {
  balances: "text-emerald-700",
  aggravates: "text-red-600",
  neutral: "text-amber-700",
};

const sym: Record<DoshaEffect, string> = {
  balances: "✓",
  aggravates: "✗",
  neutral: "~",
};

const HerbEncyclopedia = () => {
  const [q, setQ] = useState("");
  const [doshaFilter, setDoshaFilter] = useState<string>("All");
  const [mine, setMine] = useState(false);
  const [sort, setSort] = useState<"name" | "benefit" | "dosha">("name");
  const [open, setOpen] = useState<Herb | null>(null);

  const userDosha = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("dosha_result") || "{}").dominant as string | undefined;
    } catch {
      return undefined;
    }
  }, []);

  const filtered = useMemo(() => {
    let list = HERBS.filter((h) => h.name.toLowerCase().includes(q.toLowerCase()) || h.sanskrit.toLowerCase().includes(q.toLowerCase()));
    if (mine && userDosha) {
      const k = userDosha.toLowerCase() as keyof Herb["dosha"];
      list = list.filter((h) => h.dosha[k] === "balances");
    }
    if (doshaFilter !== "All") {
      const k = doshaFilter.toLowerCase() as keyof Herb["dosha"];
      list = list.filter((h) => h.dosha[k] === "balances");
    }
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "benefit") list = [...list].sort((a, b) => (b.benefits[0] || "").localeCompare(a.benefits[0] || ""));
    if (sort === "dosha") list = [...list].sort((a, b) => a.dosha.vata.localeCompare(b.dosha.vata));
    return list;
  }, [q, doshaFilter, sort, mine, userDosha]);

  const savePref = (h: Herb) => {
    const arr = JSON.parse(localStorage.getItem("herb_prefs") || "[]") as string[];
    if (!arr.includes(h.name)) {
      arr.push(h.name);
      localStorage.setItem("herb_prefs", JSON.stringify(arr));
    }
    setOpen(null);
  };

  return (
    <div className="page-enter min-h-screen bg-surface dark:bg-[#1a1a2e]">
      <section className="bg-primary-dark py-16 text-center text-white">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4">
          <Leaf className="h-14 w-14 text-primary-light" />
          <h1 className="font-display text-4xl md:text-5xl">Dravyaguna</h1>
          <p className="text-primary-light">The Science of Ayurvedic Herbs</p>
          <div className="relative mt-4 w-full max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search herbs..."
              className="w-full rounded-full border-0 py-3 pl-12 pr-4 text-gray-900 shadow-md outline-none ring-2 ring-white/20"
            />
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-surface/95 px-4 py-4 backdrop-blur md:px-8 dark:bg-[#1a1a2e]/95">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
          For My Dosha
        </label>
        <div className="flex flex-wrap gap-2">
          {["All", "Vata", "Pitta", "Kapha"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDoshaFilter(d)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                doshaFilter === d ? "bg-primary text-white" : "border border-gray-200 bg-white dark:border-white/10 dark:bg-[#0f3460]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <select
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs dark:border-white/10 dark:bg-[#0f3460]"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="name">Name A-Z</option>
          <option value="benefit">By Benefit</option>
          <option value="dosha">By Dosha</option>
        </select>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 md:p-8">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <p className="text-lg">No herbs found</p>
            <Button variant="outline" className="mt-4" onClick={() => setQ("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          filtered.map((h) => (
            <button
              key={h.name}
              type="button"
              onClick={() => setOpen(h)}
              className="ayur-card block cursor-pointer overflow-hidden text-left"
            >
              <div className="flex h-28 items-center justify-center bg-primary/10">
                <span className="text-6xl">{h.emoji}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{h.name}</p>
                <p className="text-xs italic text-gray-400">{h.sanskrit}</p>
                <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-medium">
                  <span className={tone[h.dosha.vata]}>
                    {sym[h.dosha.vata]} Vata
                  </span>
                  <span className={tone[h.dosha.pitta]}>
                    {sym[h.dosha.pitta]} Pitta
                  </span>
                  <span className={tone[h.dosha.kapha]}>
                    {sym[h.dosha.kapha]} Kapha
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {h.benefits.slice(0, 2).map((b) => (
                    <span key={b} className="rounded-full bg-surface px-2 py-0.5 text-xs text-gray-600 dark:bg-[#1a1a2e] dark:text-gray-300">
                      {b}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-primary">View Details →</p>
              </div>
            </button>
          ))
        )}
      </div>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  <span className="mr-2 text-3xl">{open.emoji}</span>
                  {open.name}
                </DialogTitle>
                <p className="text-sm italic text-gray-400">{open.sanskrit}</p>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{open.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-semibold text-primary">Benefits</p>
                  <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                    {open.benefits.map((b) => (
                      <li key={b}>
                        🌿 {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-semibold">Dosha</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vata {open.dosha.vata}, Pitta {open.dosha.pitta}, Kapha {open.dosha.kapha}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Best form</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{open.bestForm}</p>
                  <p className="mt-4 font-semibold">Taste</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{open.taste}</p>
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
                    Avoid if: {open.avoidIf}
                  </div>
                </div>
              </div>
              <Button className="ayur-btn-primary w-full" type="button" onClick={() => savePref(open)}>
                Add to My Preferences
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HerbEncyclopedia;
