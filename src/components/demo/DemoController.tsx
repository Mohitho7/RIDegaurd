import React from 'react';
import { JourneyState, TechModal } from '../../types/journey';
import { 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  AlertOctagon, 
  Users, 
  Laptop, 
  Cpu, 
  Layers, 
  Smartphone, 
  Lock, 
  HelpCircle,
  Play,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DemoControllerProps {
  currentState: JourneyState;
  onSetNormal: () => void;
  onTriggerOrdinaryChange: () => void;
  onTriggerMeaningfulChange: () => void;
  onTriggerPossibleIncident: () => void;
  onOpenGroupRide: () => void;
  onOpenOfficeKit: () => void;
  onOpenTechModal: (modal: TechModal) => void;
  onOpenWhy?: () => void;
  onReset: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  currentState,
  onSetNormal,
  onTriggerOrdinaryChange,
  onTriggerMeaningfulChange,
  onTriggerPossibleIncident,
  onOpenGroupRide,
  onOpenOfficeKit,
  onOpenTechModal,
  onOpenWhy,
  onReset,
  isOpen,
  onToggleOpen,
}) => {
  // Determine active demo instruction step
  let activeStep = 1;
  if (currentState === 'READY') {
    activeStep = 1;
  } else if (currentState === 'NORMAL' || currentState === 'NORMAL_RECOVERED') {
    activeStep = 2;
  } else {
    activeStep = 3;
  }

  return (
    <>
      {/* DESKTOP / WIDE SCREEN PERMANENT DOCKED COMPANION (Never hides, never covers phone) */}
      <aside 
        aria-label="Judge Demo Controller"
        className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 w-80 max-h-[92vh] flex-col rounded-3xl bg-[#0B0E14]/95 border border-white/20 p-4 shadow-2xl backdrop-blur-xl text-left select-none overflow-y-auto space-y-3.5 scrollbar-thin"
      >
        {/* Header */}
        <div className="pb-2 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-extrabold text-white tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
              <span>DEMO MODE</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Live Evaluation & Judge Proof
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
            {currentState}
          </span>
        </div>

        {/* PART 2: 3-STEP DEMO INSTRUCTION (Always visible, dynamically highlighted) */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span>HOW TO DEMO RIDeGUARD</span>
            <span className="text-slate-500">3 STEPS</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {/* Step 1 */}
            <div className={`p-1.5 rounded-xl transition-all flex items-center gap-2 ${
              activeStep === 1 
                ? 'bg-[#00FF87]/15 border border-[#00FF87]/40 text-[#00FF87] font-bold shadow-sm' 
                : 'text-slate-400 opacity-70'
            }`}>
              <span className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center text-[10px]">01</span>
              <span>START THE JOURNEY</span>
            </div>

            {/* Step 2 */}
            <div className={`p-1.5 rounded-xl transition-all flex items-center gap-2 ${
              activeStep === 2 
                ? 'bg-sky-500/15 border border-sky-500/40 text-sky-300 font-bold shadow-sm' 
                : 'text-slate-400 opacity-70'
            }`}>
              <span className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center text-[10px]">02</span>
              <span>LET IT CHANGE</span>
            </div>

            {/* Step 3 */}
            <div className={`p-1.5 rounded-xl transition-all flex items-center gap-2 ${
              activeStep === 3 
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold shadow-sm' 
                : 'text-slate-400 opacity-70'
            }`}>
              <span className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center text-[10px]">03</span>
              <span>WATCH RIDeGUARD UNDERSTAND</span>
            </div>
          </div>

          <p className="text-[10px] font-mono text-slate-400 leading-tight pt-1 border-t border-white/5">
            Use the live journey or choose a scenario.
          </p>
        </div>

        {/* STEP 1 — START */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>STEP 1 — START</span>
          </div>
          <button
            onClick={onSetNormal}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-left transition-colors flex items-center justify-between cursor-pointer"
          >
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#00FF87] fill-[#00FF87]" />
                <span>Start / Live Cruising</span>
              </div>
              <div className="text-[10px] text-slate-400 font-normal">Normal continuous travel (~42 km/h)</div>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
          </button>
        </div>

        {/* STEP 2 — TRIGGER: SCENARIOS */}
        <div className="pt-1 space-y-1.5 font-mono text-xs">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">
            STEP 2 — TRIGGER (SCENARIOS)
          </div>

          <button
            onClick={onSetNormal}
            className={`w-full py-2 px-3 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer ${
              currentState === 'NORMAL' ? 'bg-[#00FF87]/15 border border-[#00FF87]/40 text-[#00FF87]' : 'bg-white/5 hover:bg-white/10 text-slate-200'
            }`}
          >
            <div>
              <div className="font-bold">01 Normal Journey</div>
              <div className="text-[10px] text-slate-400 font-normal">Corridor baseline monitoring</div>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
          </button>

          <button
            onClick={onTriggerOrdinaryChange}
            className={`w-full py-2 px-3 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer ${
              currentState === 'ORDINARY_CHANGE' ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300' : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300'
            }`}
          >
            <div>
              <div className="font-bold">02 Traffic Slowdown</div>
              <div className="text-[10px] text-sky-400/80 font-normal">Ordinary change / stays quiet</div>
            </div>
            <Activity className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={onTriggerMeaningfulChange}
            className={`w-full py-2 px-3 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer ${
              currentState === 'MEANINGFUL_CHANGE' || currentState === 'CONTEXT_ANALYSIS' || currentState === 'RIDER_CONFIRMATION'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' 
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
            }`}
          >
            <div>
              <div className="font-bold">03 Meaningful Change</div>
              <div className="text-[10px] text-amber-400/80 font-normal">Sudden stop / asks rider</div>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onTriggerPossibleIncident}
            className={`w-full py-2 px-3 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer ${
              currentState === 'POSSIBLE_INCIDENT' || currentState === 'ASSIST' 
                ? 'bg-red-500/20 border border-red-500/50 text-red-300' 
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-300'
            }`}
          >
            <div>
              <div className="font-bold">04 Possible Incident</div>
              <div className="text-[10px] text-red-400/80 font-normal">Severe decel + tilt / assistance</div>
            </div>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* STEP 3 — OBSERVE / PROOF */}
        <div className="pt-2 border-t border-white/10 space-y-1.5 font-mono text-[11px]">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>STEP 3 — OBSERVE (PROOF)</span>
            <Eye className="w-3 h-3 text-[#00FF87]" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onOpenTechModal('SCENARIO_LAB')}
              className="py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Scenario Lab</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </button>

            {onOpenWhy && (
              <button
                onClick={onOpenWhy}
                className="py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00FF87] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Why RIDeGUARD Asked</span>
                <HelpCircle className="w-3.5 h-3.5 text-[#00FF87] shrink-0" />
              </button>
            )}

            <button
              onClick={() => onOpenTechModal('PIPELINE')}
              className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Intelligence Pipeline</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </button>

            <button
              onClick={() => onOpenTechModal('HARDWARE')}
              className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>iQOO HW</span>
              <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            </button>

            <button
              onClick={() => onOpenTechModal('EDGE_ARCH')}
              className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Edge Arch</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </button>

            <button
              onClick={onOpenOfficeKit}
              className="py-1.5 px-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Office Kit</span>
              <Laptop className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            </button>
          </div>

          <button
            onClick={() => onOpenTechModal('TECH_INSPECTOR')}
            className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Tech Inspector (Simulated 50Hz)</span>
            <Cpu className="w-3.5 h-3.5 text-[#00FF87]" />
          </button>
        </div>

        {/* FUTURE: GROUP RIDE */}
        <div className="pt-1.5 border-t border-white/10 space-y-1 font-mono text-[11px]">
          <button
            onClick={onOpenGroupRide}
            className="w-full py-1.5 px-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Collective Context (Group Preview)</span>
            <Users className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>

        {/* SYSTEM: RESET JOURNEY */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <button
            onClick={onReset}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00FF87]" />
            <span>RESET JOURNEY</span>
          </button>
        </div>
      </aside>

      {/* MOBILE / NARROW SCREEN FLOATING CONTROLLER (Docked at bottom-right, always accessible) */}
      <div className="lg:hidden fixed bottom-3 right-3 z-50 flex flex-col items-end select-none">
        {/* Expanded Drawer on Mobile */}
        {isOpen && (
          <div className="mb-2 w-76 rounded-3xl bg-[#0B0E14]/98 border border-white/20 p-4 shadow-2xl backdrop-blur-xl space-y-3 animate-fadeIn text-left max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="text-xs font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
                <span>DEMO MODE</span>
              </div>
              <button
                onClick={onToggleOpen}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Steps */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-[11px] font-mono">
              <div className="text-[10px] text-slate-400 font-bold uppercase">HOW TO DEMO RIDeGUARD</div>
              <div className={`p-1 rounded ${activeStep === 1 ? 'text-[#00FF87] font-bold' : 'text-slate-500'}`}>
                01 START THE JOURNEY
              </div>
              <div className={`p-1 rounded ${activeStep === 2 ? 'text-sky-300 font-bold' : 'text-slate-500'}`}>
                02 LET THE JOURNEY CHANGE
              </div>
              <div className={`p-1 rounded ${activeStep === 3 ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                03 WATCH RIDeGUARD UNDERSTAND
              </div>
            </div>

            {/* Scenarios */}
            <div className="space-y-1.5 font-mono text-xs">
              <button
                onClick={() => { onSetNormal(); onToggleOpen(); }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-left transition-colors flex items-center justify-between"
              >
                <span>01 Normal Journey</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF87]" />
              </button>

              <button
                onClick={() => { onTriggerOrdinaryChange(); onToggleOpen(); }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-sky-500/15 text-sky-300 text-left transition-colors flex items-center justify-between"
              >
                <span>02 Traffic Slowdown</span>
                <Activity className="w-3.5 h-3.5 text-sky-400" />
              </button>

              <button
                onClick={() => { onTriggerMeaningfulChange(); onToggleOpen(); }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/15 text-amber-300 text-left transition-colors flex items-center justify-between"
              >
                <span>03 Meaningful Change</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => { onTriggerPossibleIncident(); onToggleOpen(); }}
                className="w-full py-1.5 px-2.5 rounded-xl bg-red-500/15 text-red-300 text-left transition-colors flex items-center justify-between"
              >
                <span>04 Possible Incident</span>
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>

            {/* Proof quick links */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-1 text-[10px] font-mono">
              <button
                onClick={() => { onOpenTechModal('SCENARIO_LAB'); onToggleOpen(); }}
                className="py-1 px-2 rounded bg-amber-500/10 text-amber-300"
              >
                Scenario Lab
              </button>
              <button
                onClick={() => { onOpenOfficeKit(); onToggleOpen(); }}
                className="py-1 px-2 rounded bg-sky-500/10 text-sky-300"
              >
                Office Kit
              </button>
              <button
                onClick={() => { onOpenTechModal('PIPELINE'); onToggleOpen(); }}
                className="py-1 px-2 rounded bg-white/5 text-slate-300"
              >
                Pipeline
              </button>
              <button
                onClick={() => { onOpenTechModal('TECH_INSPECTOR'); onToggleOpen(); }}
                className="py-1 px-2 rounded bg-white/5 text-slate-300"
              >
                Tech Inspector
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={() => { onReset(); onToggleOpen(); }}
              className="w-full py-2 rounded-xl bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00FF87]" />
              <span>Reset Journey</span>
            </button>
          </div>
        )}

        {/* Persistent Pill Button on Mobile */}
        <button
          onClick={onToggleOpen}
          className="px-3.5 py-1.5 rounded-full bg-[#111622] hover:bg-[#182030] border border-white/20 text-slate-200 shadow-2xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
          <span>DEMO MODE</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );
};

