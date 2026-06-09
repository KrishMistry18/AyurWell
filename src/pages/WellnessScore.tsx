import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";
import { Activity, Droplets, Wind, Brain } from "lucide-react";

const data = [
  { subject: 'Prana (Energy)', A: 85, fullMark: 100 },
  { subject: 'Nidra (Sleep)', A: 65, fullMark: 100 },
  { subject: 'Agni (Digestion)', A: 90, fullMark: 100 },
  { subject: 'Bhavana (Mood)', A: 75, fullMark: 100 },
  { subject: 'Jala (Hydration)', A: 60, fullMark: 100 },
];

export default function WellnessScore() {
  useEffect(() => {
    document.title = "Wellness Score - AyurWell";
  }, []);

  const overallScore = Math.round(data.reduce((acc, curr) => acc + curr.A, 0) / data.length);

  return (
    <div className="page-enter min-h-screen bg-surface dark:bg-[#12121e] text-on-surface pt-[100px] pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Your Wellness Score</h1>
        <p className="text-on-surface-variant mt-3 max-w-xl mx-auto">
          A holistic view of your mind, body, and spirit based on your recent check-ins and logs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Radar Chart Card */}
        <div className="bg-white dark:bg-[#1c1c2e] rounded-3xl p-6 shadow-sm border border-outline-variant/20 dark:border-white/10 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-4 w-full text-left">Balance Radar</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="You" dataKey="A" stroke="#2d6a4f" fill="#2d6a4f" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white dark:bg-[#1c1c2e] rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 dark:border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold">Overall Score</h2>
            <div className="text-4xl font-bold text-primary">{overallScore}<span className="text-xl text-gray-400">/100</span></div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"><Wind className="w-4 h-4 text-primary" /> Prana (Energy)</span>
                <span className="text-sm font-bold">85%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"><Activity className="w-4 h-4 text-orange-500" /> Agni (Digestion)</span>
                <span className="text-sm font-bold">90%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '90%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"><Brain className="w-4 h-4 text-purple-500" /> Nidra & Bhavana</span>
                <span className="text-sm font-bold">70%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"><Droplets className="w-4 h-4 text-blue-500" /> Jala (Hydration)</span>
                <span className="text-sm font-bold">60%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
            <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1 text-sm">Action Item</h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Your hydration (Jala) is running low. Drink a large glass of warm water right now to help flush out toxins and improve sleep quality!
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/dashboard" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
