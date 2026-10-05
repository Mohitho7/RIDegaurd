import React from 'react';
import { Sliders, Phone, Lock, Settings, Terminal, ChevronRight } from 'lucide-react';

interface YouScreenProps {
  onOpenRidePreferences: () => void;
  onOpenEmergencyContacts: () => void;
  onOpenSettings: () => void;
  onOpenPrivacy: () => void;
  onOpenDemoConsole: () => void;
}

export const YouScreen: React.FC<YouScreenProps> = ({
  onOpenRidePreferences,
  onOpenEmergencyContacts,
  onOpenSettings,
  onOpenPrivacy,
  onOpenDemoConsole,
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          PROFILE & CONFIG
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Primary Question: "Who am I and how is RIDeGUARD configured?"
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-black/40 border-2 border-white/10 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/20 flex items-center justify-center font-black text-white text-lg font-['Space_Grotesk'] shadow-md shrink-0">
          MR
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black font-['Space_Grotesk'] text-white">
              Mohith R.
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00FF87]/20 text-[#00FF87] font-bold border border-[#00FF87]/30">
              VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            KTM Duke 390 · Hunter 350
          </p>
        </div>
      </div>

      {/* Menu Options (Clean, High-Contrast Rows) */}
      <div className="p-2.5 rounded-3xl bg-black/40 border-2 border-white/10 space-y-1.5 shadow-sm">
        {/* 1. Ride Preferences */}
        <button
          onClick={onOpenRidePreferences}
          className="w-full p-3 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-[#00FF87]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Ride Preferences</div>
              <div className="text-xs text-slate-400 font-mono">Silent corridor mode, haptics, sensitivity</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 2. Emergency Contacts */}
        <button
          onClick={onOpenEmergencyContacts}
          className="w-full p-3 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-red-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Emergency Contacts</div>
              <div className="text-xs text-slate-400 font-mono">Designated assistance payload recipients</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3. Privacy & Data */}
        <button
          onClick={onOpenPrivacy}
          className="w-full p-3 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Privacy & Data</div>
              <div className="text-xs text-slate-400 font-mono">On-device local inference, zero media storage</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 4. Settings */}
        <button
          onClick={onOpenSettings}
          className="w-full p-3 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Settings</div>
              <div className="text-xs text-slate-400 font-mono">Device frame, engine rate, vehicle dynamics</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Demo Mode / Tech Suite Access */}
      <div>
        <button
          onClick={onOpenDemoConsole}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 border-2 border-white/20 hover:border-[#00FF87]/50 transition-all flex items-center justify-between cursor-pointer group shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00FF87]/20 text-[#00FF87]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-white text-sm font-['Space_Grotesk'] group-hover:text-[#00FF87] transition-colors">
                DEMO MODE & TECH SUITE
              </div>
              <div className="text-xs text-slate-300 font-mono">
                Judge console, 50Hz sensors & pipeline proof
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#00FF87] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};


