import React from 'react';
import { Lock, Shield, Eye, Mic } from 'lucide-react';

interface PrivacyDataViewProps {
  onBack: () => void;
}

export const PrivacyDataView: React.FC<PrivacyDataViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-6 space-y-6 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#00FF87] text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>PRIVACY & ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          Privacy by Architecture
        </h1>
        <p className="text-xs font-mono text-slate-300">
          Primary Question: "How is my journey data kept private?"
        </p>
      </div>

      {/* Core Privacy Principles */}
      <div className="space-y-3.5 text-xs">
        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm font-['Space_Grotesk']">
            <Shield className="w-4 h-4 text-[#00FF87]" />
            <span>Local On-Device Processing</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            Core journey context is designed to be processed locally on your phone's neural processor. Raw camera frames and audio recordings are never stored as media files.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm font-['Space_Grotesk']">
            <Mic className="w-4 h-4 text-purple-400" />
            <span>Context-Only Sensor Usage</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            Camera and microphone are used solely to extract classification embeddings (such as road wind vs. screech, or horizon tilt) and immediately discarded.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm font-['Space_Grotesk']">
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Rider-Controlled Verification</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            You have explicit 1-tap control over when an assistance payload or contact alert is transmitted.
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

