import React from 'react';
import { ShieldCheck, Cpu, Lock, Zap } from 'lucide-react';

interface EdgeArchitectureViewProps {
  onBack: () => void;
}

export const EdgeArchitectureView: React.FC<EdgeArchitectureViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-6 space-y-6 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#00FF87] text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ON-DEVICE EDGE ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          Local Core Intelligence
        </h1>
        <p className="text-xs font-mono text-[#00FF87] font-bold">
          Primary Question: "Where does the intelligence run?"
        </p>
      </div>

      {/* Core Flow - Large & Glanceable */}
      <div className="p-5 rounded-3xl bg-white/[0.04] border-2 border-white/15 space-y-2.5 text-center text-xs font-mono shadow-xl">
        <div className="text-xs uppercase font-bold text-slate-400">ON-DEVICE EXECUTION STACK</div>
        <div className="p-2.5 rounded-xl bg-white/10 font-bold text-white text-sm">PHONE CONTEXT INPUTS</div>
        <div className="text-[#00FF87] font-bold text-base">↓</div>
        <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 font-bold text-cyan-200 text-sm">LOCAL PREPROCESSING (50Hz)</div>
        <div className="text-[#00FF87] font-bold text-base">↓</div>
        <div className="p-3 rounded-xl bg-[#00FF87]/20 border-2 border-[#00FF87]/50 font-black text-[#00FF87] text-base font-['Space_Grotesk']">
          LOCAL CONTEXT ENGINE (NPU TARGET)
        </div>
        <div className="text-[#00FF87] font-bold text-base">↓</div>
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 font-bold text-amber-200 text-sm">JOURNEY STATE EVALUATOR</div>
        <div className="text-[#00FF87] font-bold text-base">↓</div>
        <div className="p-2.5 rounded-xl bg-white/15 font-bold text-white text-sm">RIDER 1-TAP ACTION</div>
      </div>

      {/* Three Supporting Pillars */}
      <div className="space-y-3">
        {/* Pillar 1 */}
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm font-['Space_Grotesk']">
            <Cpu className="w-4 h-4 text-[#00FF87]" />
            <span>LOCAL OFFLINE OPERATION</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Evaluation functions continuously on remote highway stretches without active cell connectivity.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm font-['Space_Grotesk']">
            <Lock className="w-4 h-4 text-sky-400" />
            <span>PRIVATE DATA RETENTION</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Raw microphone audio and camera frames never leave the phone. Only structured state is output.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm font-['Space_Grotesk']">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>ZERO CLOUD LATENCY</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Decisions are made in under 100 milliseconds directly within the on-device inference loop.
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-mono font-bold text-xs cursor-pointer transition-colors"
      >
        RETURN
      </button>
    </div>
  );
};

