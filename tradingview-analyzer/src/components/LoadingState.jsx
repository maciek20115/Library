import React, { useEffect, useState } from 'react';
import { Cpu, Eye, BarChart2, TrendingUp, Target } from 'lucide-react';

const STEPS = [
  { icon: Eye, label: 'Reading chart image...' },
  { icon: BarChart2, label: 'Identifying price levels...' },
  { icon: TrendingUp, label: 'Analyzing trend structure...' },
  { icon: Cpu, label: 'Processing indicators...' },
  { icon: Target, label: 'Generating recommendations...' },
];

export default function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Animated orb */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-[#2979ff]/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#2979ff]/20 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-[#2979ff]/30 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#2979ff]" />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-base font-semibold text-[#e6edf3]">AI Analysis in Progress</h3>
          <p className="text-xs text-[#8b949e] mt-1">Claude is analyzing your chart</p>
        </div>

        {/* Steps */}
        <div className="w-full space-y-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500
                ${active ? 'bg-[#2979ff]/10 border border-[#2979ff]/20' : done ? 'opacity-50' : 'opacity-30'}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#2979ff]' : done ? 'text-[#00c853]' : 'text-[#8b949e]'}`} />
                <span className={`text-xs ${active ? 'text-[#e6edf3]' : 'text-[#8b949e]'}`}>{s.label}</span>
                {active && (
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <div key={d} className="w-1 h-1 rounded-full bg-[#2979ff] animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                )}
                {done && <div className="ml-auto w-3 h-3 rounded-full bg-[#00c853] flex items-center justify-center text-[8px] text-[#0d1117] font-bold">✓</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
