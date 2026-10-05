import React, { useEffect } from 'react';
import { Loader2, HelpCircle, AlertTriangle } from 'lucide-react';

interface JourneyChangeScreenProps {
  onProceedToContextAnalysis: () => void;
  onOpenWhy: () => void;
}

export const JourneyChangeScreen: React.FC<JourneyChangeScreenProps> = ({
  onProceedToContextAnalysis,
  onOpenWhy,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceedToContextAnalysis();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onProceedToContextAnalysis]);

  return (
    <div className="flex flex-col h-full justify-between px-5 py-7 text-center animate-fadeIn select-none">
      {/* Primary Hero Section */}
      <div className="space-y-5 my-auto">
        {/* DOMINANT HERO STATE BANNER - Cannot be missed from 2 meters away */}
        <div className="p-4 rounded-3xl bg-amber-500/20 border-2 border-amber-500/60 shadow-xl space-y-1.5 glow-amber">
          <div className="inline-flex items-center gap-2 text-amber-300 font-mono font-bold text-xs uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>JOURNEY STATE</span>
          </div>
          <div className="font-['Space_Grotesk'] font-black text-2xl md:text-3xl text-amber-300 tracking-wider">
            MEANINGFUL CHANGE
          </div>
        </div>

        {/* Hero Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-['Space_Grotesk'] text-white">
            Journey Changed Unexpectedly
          </h1>
          <p className="text-sm font-medium text-slate-300">
            Evaluating whether this is an ordinary slowdown or requires rider verification.
          </p>
        </div>

        {/* High-Contrast Event Card */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
          <div className="text-xs font-mono uppercase text-slate-400">DETECTED EVENT</div>
          <div className="text-base font-bold text-white flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Sudden Standstill (0 km/h)</span>
          </div>
        </div>

        {/* Processing Indicator */}
        <div className="flex items-center justify-center gap-2.5 text-sm font-mono font-bold text-amber-400 pt-1">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400 stroke-[3]" />
          <span>Validating Context...</span>
        </div>
      </div>

      {/* Why Button */}
      <div className="pt-4">
        <button
          onClick={onOpenWhy}
          className="text-xs font-mono font-bold text-slate-300 hover:text-[#00FF87] flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer p-2 rounded-xl hover:bg-white/5"
        >
          <HelpCircle className="w-4 h-4 text-[#00FF87]" />
          <span>WHY DID RIDeGUARD DETECT THIS?</span>
        </button>
      </div>
    </div>
  );
};

