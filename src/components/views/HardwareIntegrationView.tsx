import React from 'react';
import { Smartphone, Activity, Radio, Mic, Eye, ShieldCheck } from 'lucide-react';

interface HardwareIntegrationViewProps {
  onBack: () => void;
}

export const HardwareIntegrationView: React.FC<HardwareIntegrationViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-6 space-y-6 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
          <Smartphone className="w-3.5 h-3.5" />
          <span>iQOO HARDWARE INTEGRATION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          The Phone is the Context Layer
        </h1>
        <p className="text-xs font-mono text-cyan-300 font-bold">
          Primary Question: "Where does the intelligence run?"
        </p>
      </div>

      {/* Central Phone Architecture Diagram */}
      <div className="p-5 rounded-3xl bg-white/[0.04] border-2 border-white/15 space-y-4 text-xs shadow-xl">
        <div className="text-xs font-mono text-slate-300 uppercase font-bold text-center">
          Hardware Inputs Feeding into On-Device Engine
        </div>

        {/* 6 Peripheral Context Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-[#00FF87]">
              <Activity className="w-4 h-4" />
              <span>MOTION / IMU</span>
            </div>
            <div className="text-xs text-slate-300">50Hz acceleration & deceleration dynamics</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-sky-400">
              <Radio className="w-4 h-4" />
              <span>GNSS FIX</span>
            </div>
            <div className="text-xs text-slate-300">Speed, trajectory & corridor GIS position</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-400">
              <Mic className="w-4 h-4" />
              <span>MICROPHONE</span>
            </div>
            <div className="text-xs text-slate-300">Acoustic background classification</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-teal-400">
              <Eye className="w-4 h-4" />
              <span>CAMERA</span>
            </div>
            <div className="text-xs text-slate-300">Visual horizon & road shoulder cues</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
              <Smartphone className="w-4 h-4" />
              <span>DEVICE STATE</span>
            </div>
            <div className="text-xs text-slate-300">Handlebar mount posture & angular tilt</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>RIDER ACTION</span>
            </div>
            <div className="text-xs text-slate-300">Direct 1-tap confirmation feedback</div>
          </div>
        </div>

        {/* Central Destination Pill */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-emerald-500/20 border-2 border-white/20 text-center space-y-1">
          <div className="font-['Space_Grotesk'] font-black text-sm text-white">
            ON-DEVICE JOURNEY INTELLIGENCE ENGINE
          </div>
          <div className="text-xs text-slate-200 font-mono font-bold">
            PHONE → SENSORS → MULTIMODAL CONTEXT → JOURNEY STATE → ACTION
          </div>
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

