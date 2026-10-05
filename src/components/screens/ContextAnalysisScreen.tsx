import React, { useEffect } from 'react';
import { ArrowDown, Loader2, Sparkles } from 'lucide-react';

interface ContextAnalysisScreenProps {
  onProceedToConfirmation: () => void;
}

export const ContextAnalysisScreen: React.FC<ContextAnalysisScreenProps> = ({
  onProceedToConfirmation,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceedToConfirmation();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onProceedToConfirmation]);

  return (
    <div className="flex flex-col h-full justify-between px-5 py-7 text-center animate-fadeIn select-none">
      {/* Top Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>REASONING ENGINE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          UNDERSTANDING WHAT CHANGED
        </h1>
      </div>

      {/* Multimodal Reasoning Fusion Diagram (Glanceable in 3 seconds) */}
      <div className="p-5 rounded-3xl bg-white/[0.04] border-2 border-white/15 space-y-3.5 my-auto shadow-xl">
        <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold text-slate-200">
          <span className="p-2 rounded-xl bg-white/10 border border-white/10">MOTION</span>
          <span className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300">LOCATION</span>
          <span className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">ENVIRONMENT</span>
        </div>

        <div className="flex justify-center text-[#00FF87] py-0.5">
          <ArrowDown className="w-6 h-6 animate-bounce stroke-[3]" />
        </div>

        <div className="p-3.5 rounded-2xl bg-[#00FF87]/20 border-2 border-[#00FF87]/50 text-base font-black font-['Space_Grotesk'] text-[#00FF87] tracking-wider">
          JOURNEY STATE EVALUATOR
        </div>

        <div className="pt-2 text-sm font-bold text-white font-['Space_Grotesk']">
          Not every change is an incident.
        </div>

        <div className="flex items-center justify-center gap-2.5 text-xs font-mono font-bold text-[#00FF87] pt-1">
          <Loader2 className="w-4 h-4 animate-spin text-[#00FF87] stroke-[3]" />
          <span>Checking multimodal context...</span>
        </div>
      </div>

      {/* Possible Reasons */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-left">
        <div className="text-xs font-mono text-slate-400 uppercase font-bold">
          CONSIDERED HYPOTHESES:
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">• Traffic slowdown</div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">• Corridor halt</div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">• Lay-by pullover</div>
          <div className="p-2 rounded-lg bg-black/40 border border-white/5">• Possible incident</div>
        </div>
        <div className="pt-2 border-t border-white/5 text-xs text-[#00FF87] font-bold text-center font-mono">
          RIDeGUARD checks with the rider when cause is inconclusive.
        </div>
      </div>
    </div>
  );
};

