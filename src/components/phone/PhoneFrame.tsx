import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isFrameEnabled: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isFrameEnabled }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isFrameEnabled) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#07080B] text-slate-100 flex flex-col relative shadow-2xl">
        {children}
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 flex items-center justify-center min-h-screen bg-[#040507] p-2">
      {/* Phone Casing */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-[#07080B] rounded-[50px] border-[6px] border-[#1C2230] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,255,135,0.08)] flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Top Bezel & Camera Cutout */}
        <div className="absolute top-0 left-0 right-0 z-40 px-7 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 font-mono select-none bg-gradient-to-b from-[#07080B] to-transparent">
          {/* Clock */}
          <span className="font-semibold text-white tracking-tight">{currentTime}</span>

          {/* iQOO Flagship Punch Hole Camera */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 rounded-full bg-black border border-white/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-cyan-900" />
          </div>

          {/* Status Icons: 5G, Wifi, Local NPU, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-[#00FF87] border border-emerald-500/40">
              CORE
            </span>
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">94%</span>
              <BatteryMedium className="w-4 h-4 text-[#00FF87]" />
            </div>
          </div>
        </div>

        {/* Screen Container */}
        <div className="flex-1 flex flex-col pt-9 overflow-hidden relative">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
