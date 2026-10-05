import React from 'react';
import { JourneyContext, JourneyState } from '../../types/journey';
import { 
  Square, 
  Mic, 
  Eye, 
  Clock, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  AlertOctagon,
  Navigation,
} from 'lucide-react';

interface ActiveJourneyScreenProps {
  context: JourneyContext;
  state: JourneyState;
  onEndRide: () => void;
}

export const ActiveJourneyScreen: React.FC<ActiveJourneyScreenProps> = ({
  context,
  state,
  onEndRide,
}) => {
  const isOrdinary = state === 'ORDINARY_CHANGE';
  const isMeaningful = state === 'MEANINGFUL_CHANGE';
  const isIncident = state === 'POSSIBLE_INCIDENT' || state === 'ASSIST';
  const isStopped = context.currentSpeed === 0;

  const gating = context.sensorGating || {
    mic: 'STANDBY',
    camera: 'STANDBY',
    motion: 'LOW-POWER BASELINE',
    stage: 'BASELINE MONITORING',
  };

  const recentEvent = context.recentJourneyEvent || {
    title: 'Normal Cruising',
    description: 'Cruising steadily on primary corridor.',
    timestamp: '09:41:18',
    severity: 'normal' as const,
  };

  // State Banner Configuration for Instant Distance Readability
  const stateConfig = {
    NORMAL: {
      title: 'NORMAL RIDE',
      subtitle: 'Corridor baseline monitoring · Zero interruptions',
      border: 'border-[#00FF87]/50',
      bg: 'bg-[#00FF87]/10',
      textColor: 'text-[#00FF87]',
      badgeColor: 'bg-[#00FF87]',
      icon: ShieldCheck,
    },
    NORMAL_RECOVERED: {
      title: 'NORMAL RIDE',
      subtitle: 'Rider confirmed safe · Journey resumed',
      border: 'border-[#00FF87]/50',
      bg: 'bg-[#00FF87]/10',
      textColor: 'text-[#00FF87]',
      badgeColor: 'bg-[#00FF87]',
      icon: ShieldCheck,
    },
    ORDINARY_CHANGE: {
      title: 'ORDINARY CHANGE',
      subtitle: 'Traffic-like slowdown · Context matched · RIDeGUARD stayed quiet',
      border: 'border-sky-400/60',
      bg: 'bg-sky-500/15',
      textColor: 'text-sky-300',
      badgeColor: 'bg-sky-400',
      icon: Activity,
    },
    MEANINGFUL_CHANGE: {
      title: 'MEANINGFUL CHANGE',
      subtitle: 'Unexpected stop · Standstill on lane · Checking safety',
      border: 'border-amber-400/60',
      bg: 'bg-amber-500/20',
      textColor: 'text-amber-300',
      badgeColor: 'bg-amber-400',
      icon: AlertTriangle,
    },
    CONTEXT_ANALYSIS: {
      title: 'CONTEXT VALIDATION',
      subtitle: 'Analyzing motion, location & environment cues',
      border: 'border-amber-400/60',
      bg: 'bg-amber-500/20',
      textColor: 'text-amber-300',
      badgeColor: 'bg-amber-400',
      icon: AlertTriangle,
    },
    RIDER_CONFIRMATION: {
      title: 'MEANINGFUL CHANGE',
      subtitle: 'Awaiting rider safety confirmation',
      border: 'border-amber-400/60',
      bg: 'bg-amber-500/20',
      textColor: 'text-amber-300',
      badgeColor: 'bg-amber-400',
      icon: AlertTriangle,
    },
    POSSIBLE_INCIDENT: {
      title: 'POSSIBLE INCIDENT',
      subtitle: 'Severe decel + abnormal tilt · Assistance payload ready',
      border: 'border-red-500/60',
      bg: 'bg-red-500/20',
      textColor: 'text-red-400',
      badgeColor: 'bg-red-500',
      icon: AlertOctagon,
    },
    ASSIST: {
      title: 'ASSISTANCE MODE',
      subtitle: 'Preserved context payload ready for broadcast',
      border: 'border-red-500/60',
      bg: 'bg-red-500/20',
      textColor: 'text-red-400',
      badgeColor: 'bg-red-500',
      icon: AlertOctagon,
    },
    READY: {
      title: 'READY TO RIDE',
      subtitle: 'Journey intelligence initialized',
      border: 'border-white/20',
      bg: 'bg-white/5',
      textColor: 'text-white',
      badgeColor: 'bg-[#00FF87]',
      icon: ShieldCheck,
    }
  };

  const activeStateInfo = stateConfig[state] || stateConfig.NORMAL;
  const StateIcon = activeStateInfo.icon;

  return (
    <div className="flex flex-col h-full justify-between px-4 py-3 text-center animate-fadeIn select-none overflow-y-auto space-y-3 scrollbar-thin">
      {/* 1. ROUTE & CORRIDOR HEADER (High Contrast, Scannable) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-white">
            <Navigation className="w-4 h-4 text-[#00FF87]" />
            <span className="font-['Space_Grotesk'] font-bold text-sm tracking-wide">
              HYDERABAD → HITAM
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400">CORRIDOR:</span>
            <span className="font-bold text-[#00FF87] px-2 py-0.5 rounded bg-[#00FF87]/15 border border-[#00FF87]/30">
              {context.corridorStatus === 'TOLL_APPROACH' 
                ? 'Toll Approach' 
                : context.corridorStatus === 'SHOULDER' 
                ? 'Shoulder' 
                : 'Expected'}
            </span>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOrdinary ? 'bg-sky-400' : isMeaningful ? 'bg-amber-400' : isIncident ? 'bg-red-500' : 'bg-[#00FF87]'
            }`}
            style={{ width: `${Math.max(12, context.routeProgress)}%` }}
          />
        </div>
      </div>

      {/* 2. HERO JOURNEY STATE BANNER (DOMINANT, VISIBLE FROM 2 METERS) */}
      <div className={`p-4 rounded-3xl border-2 ${activeStateInfo.border} ${activeStateInfo.bg} shadow-lg text-left transition-all space-y-1`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${activeStateInfo.badgeColor} animate-pulse`} />
            <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
              JOURNEY STATE
            </span>
          </div>
          <StateIcon className={`w-5 h-5 ${activeStateInfo.textColor}`} />
        </div>

        <div className={`text-2xl font-black font-['Space_Grotesk'] tracking-tight ${activeStateInfo.textColor}`}>
          {activeStateInfo.title}
        </div>

        <p className="text-xs text-slate-200 font-medium leading-snug">
          {activeStateInfo.subtitle}
        </p>
      </div>

      {/* 3. HERO SPEEDOMETER & TRIP METRICS (Massive, Bold, Glanceable) */}
      <div className="p-3 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
        {/* Speed */}
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-7xl font-black font-['Space_Grotesk'] text-white tracking-tighter">
            {context.currentSpeed}
          </span>
          <span className="text-base font-mono font-bold text-slate-400">KM/H</span>

          {isStopped && context.stopDurationSeconds > 0 && (
            <div className="ml-2 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-500/50 text-amber-300 text-sm font-mono font-black animate-pulse">
              STOP 0:0{context.stopDurationSeconds}
            </div>
          )}
        </div>

        {/* Distance Remaining & ETA (Large, High Contrast) */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 font-mono">
          <div className="p-2 rounded-2xl bg-black/40 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">DISTANCE</div>
            <div className="text-base font-bold text-white mt-0.5">
              {context.distanceRemainingKm.toFixed(1)} km
            </div>
          </div>

          <div className="p-2 rounded-2xl bg-black/40 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>ETA</span>
            </div>
            <div className="text-base font-bold text-white mt-0.5">
              ~{context.etaMinutes} min
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT JOURNEY EVENT (Punchy, High Contrast, No Dense Paragraphs) */}
      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold">
          <span className="uppercase tracking-wider text-slate-300">RECENT EVENT</span>
          <span className="text-slate-400">{recentEvent.timestamp}</span>
        </div>

        <div className="text-sm font-bold text-white flex items-center gap-2">
          {recentEvent.severity === 'info' ? (
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
          ) : recentEvent.severity === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#00FF87] shrink-0" />
          )}
          <span>{recentEvent.title}</span>
        </div>

        <p className="text-xs text-slate-200 font-sans leading-relaxed">
          {recentEvent.description}
        </p>
      </div>

      {/* 5. CASCADED SENSING HUD (Simplified, Legible, No Clutter) */}
      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-left">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-slate-400">INTELLIGENCE STAGE:</span>
          <span className="text-[#00FF87] px-2 py-0.5 rounded bg-[#00FF87]/15 border border-[#00FF87]/30">
            {gating.stage}
          </span>
        </div>

        {/* 4 Clean Sensor Indicators */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* Motion */}
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400 font-bold">MOTION:</span>
            <span className={`font-black ${
              isStopped || gating.motion.includes('ANOMALY') ? 'text-amber-400' : 'text-[#00FF87]'
            }`}>
              {isStopped || gating.motion.includes('ANOMALY') ? 'ANOMALY' : 'ACTIVE'}
            </span>
          </div>

          {/* GNSS */}
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400 font-bold">GNSS:</span>
            <span className="font-black text-[#00FF87]">ACTIVE</span>
          </div>

          {/* Mic */}
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Mic className="w-3 h-3 text-purple-400" />
              <span>MIC:</span>
            </span>
            <span className={`font-black ${gating.mic.includes('ACTIVE') ? 'text-amber-400' : 'text-slate-400'}`}>
              {gating.mic.includes('ACTIVE') ? 'EVENT-GATED' : 'STANDBY'}
            </span>
          </div>

          {/* Camera */}
          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Eye className="w-3 h-3 text-teal-400" />
              <span>CAMERA:</span>
            </span>
            <span className={`font-black ${gating.camera.includes('ACTIVE') ? 'text-amber-400' : 'text-slate-400'}`}>
              {gating.camera.includes('ACTIVE') ? 'VALIDATING' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* 6. PRIMARY ACTION: END RIDE */}
      <div className="pt-1">
        <button
          onClick={onEndRide}
          className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.99]"
        >
          <Square className="w-3.5 h-3.5" />
          <span>END RIDE & SAVE TO TRIPS</span>
        </button>
      </div>
    </div>
  );
};

