import React, { useState } from 'react';
import { Users, Volume2, Mic, CheckCircle2, ChevronRight, X, Radio } from 'lucide-react';

interface RiderGroupState {
  id: string;
  riderNumber: string;
  name: string;
  state: 'NORMAL' | 'UNEXPECTED CHANGE' | 'CONTEXT CHECK';
  detail: string;
  telemetry: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const GroupScreen: React.FC = () => {
  const [selectedRider, setSelectedRider] = useState<RiderGroupState | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);

  // Deterministic 4-rider group states matching Part 7 & 18
  const riders: RiderGroupState[] = [
    { 
      id: 'r1', 
      riderNumber: 'RIDER 01', 
      name: 'You (Lead)', 
      state: 'NORMAL', 
      detail: 'Cruising steadily on primary corridor', 
      telemetry: '42 km/h · 0.0g tilt',
      color: 'bg-[#00FF87]', 
      badgeBg: 'bg-[#00FF87]/20 border-2 border-[#00FF87]/50', 
      badgeText: 'text-[#00FF87]' 
    },
    { 
      id: 'r2', 
      riderNumber: 'RIDER 02', 
      name: 'Aditya', 
      state: 'NORMAL', 
      detail: 'Corridor formation (+120m)', 
      telemetry: '41 km/h · in lane',
      color: 'bg-emerald-400', 
      badgeBg: 'bg-emerald-500/20 border-2 border-emerald-500/40', 
      badgeText: 'text-emerald-300' 
    },
    { 
      id: 'r3', 
      riderNumber: 'RIDER 03', 
      name: 'Rohan', 
      state: 'UNEXPECTED CHANGE', 
      detail: 'Sudden deceleration on travel lane', 
      telemetry: '0 km/h · Standstill',
      color: 'bg-amber-400', 
      badgeBg: 'bg-amber-500/25 border-2 border-amber-500/60', 
      badgeText: 'text-amber-300' 
    },
    { 
      id: 'r4', 
      riderNumber: 'RIDER 04', 
      name: 'Varun', 
      state: 'CONTEXT CHECK', 
      detail: 'Evaluating speed gap & acoustic context', 
      telemetry: '18 km/h · Validating',
      color: 'bg-purple-400', 
      badgeBg: 'bg-purple-500/25 border-2 border-purple-500/60', 
      badgeText: 'text-purple-300' 
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4 text-left animate-fadeIn pb-24 select-none">
      {/* 1. Primary Header: GROUP JOURNEY (Glanceable from 2m) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5" />
            <span>COLLECTIVE MESH PREVIEW</span>
          </div>
          <span className="text-xs font-mono text-[#00FF87] font-bold">4 Active Nodes</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          GROUP JOURNEY
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Primary Question: "What is happening across the group?"
        </p>
      </div>

      {/* 2. Core Architectural Flow */}
      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
          <span>GROUP INTELLIGENCE FLOW</span>
          <span className="text-[#00FF87]">LOCAL MESH</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center">
            <span className="text-[#00FF87] font-black text-xs">INDIVIDUAL</span>
            <span className="text-slate-400 text-[11px] mt-0.5">Local Eval</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 flex flex-col justify-center">
            <span className="text-purple-300 font-black text-xs">GROUP MESH</span>
            <span className="text-slate-400 text-[11px] mt-0.5">Shared State</span>
          </div>
          <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 flex flex-col justify-center">
            <span className="text-sky-300 font-black text-xs">AWARENESS</span>
            <span className="text-slate-400 text-[11px] mt-0.5">Silent Cues</span>
          </div>
        </div>
      </div>

      {/* 3. Deterministic Group Roster (4 Riders with Large, Glanceable States) */}
      <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
          <span>FORMATION ROSTER</span>
          <span className="text-slate-500">Tap rider to inspect</span>
        </div>

        <div className="space-y-2.5">
          {riders.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRider(r)}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full shrink-0 ${r.color}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white font-['Space_Grotesk']">{r.name}</span>
                    <span className="text-xs font-mono font-bold text-slate-500">{r.riderNumber}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{r.detail}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-mono px-2.5 py-1 rounded-lg font-bold inline-block ${r.badgeBg} ${r.badgeText}`}>
                  {r.state}
                </span>
                <div className="text-xs font-mono text-slate-400 mt-1">{r.telemetry}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="py-3 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>INTERCOM PREVIEW</span>
          </button>

          <button
            onClick={() => setSelectedRider(riders[2])}
            className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>INSPECT ROHAN</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. IN-PHONE MODAL / BOTTOM SHEET (Strictly contained within phone casing) */}
      {(selectedRider || isVoiceOpen) && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex flex-col justify-end animate-fadeIn">
          <div className="w-full bg-[#0E121A] border-2 border-white/20 rounded-3xl p-5 space-y-4 shadow-2xl text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {isVoiceOpen ? (
                  <>
                    <Mic className="w-5 h-5 text-purple-400 animate-pulse" />
                    <span className="text-sm font-black text-white font-['Space_Grotesk']">
                      SIMULATED INTERCOM PREVIEW
                    </span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 text-sky-400" />
                    <span className="text-sm font-black text-white font-['Space_Grotesk']">
                      {selectedRider?.riderNumber} CONTEXT INSPECTOR
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => { setSelectedRider(null); setIsVoiceOpen(false); }}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Intercom Simulation */}
            {isVoiceOpen ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <p className="text-slate-200 text-sm">
                    <strong className="text-white">Lead (You):</strong> “Rohan stopped ahead. Is it intentional?”
                  </p>
                  <p className="text-amber-300 font-mono text-xs">
                    <strong>Rohan (RIDER 03):</strong> “Pulled over on shoulder to check map. All clear.”
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Silent Context Propagated</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Group state transitioned from UNEXPECTED CHANGE to INTENTIONAL STOP without interrupting followers.
                  </p>
                </div>
              </div>
            ) : selectedRider && (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">{selectedRider.name}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${selectedRider.badgeBg} ${selectedRider.badgeText}`}>
                      {selectedRider.state}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-sans">{selectedRider.detail}</div>
                  <div className="text-xs text-slate-400 pt-2 border-t border-white/10">
                    Telemetry: <strong className="text-white">{selectedRider.telemetry}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                  Mesh insight: Peer evaluated state locally and broadcast only the validated change flag to conserve bandwidth and battery.
                </div>
              </div>
            )}

            <button
              onClick={() => { setSelectedRider(null); setIsVoiceOpen(false); }}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


