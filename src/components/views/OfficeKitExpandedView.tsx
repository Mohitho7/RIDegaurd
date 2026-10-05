import React, { useState } from 'react';
import { TimelineEvent, JourneyContext } from '../../types/journey';
import { JourneyMap } from '../map/JourneyMap';
import { Laptop, Download, ArrowRight, Smartphone, FileText, CheckCircle2 } from 'lucide-react';

interface OfficeKitExpandedViewProps {
  timeline: TimelineEvent[];
  context: JourneyContext;
  onBack: () => void;
}

export const OfficeKitExpandedView: React.FC<OfficeKitExpandedViewProps> = ({
  timeline,
  context,
  onBack,
}) => {
  const hasLiveEvents = timeline && timeline.length > 0;

  // Chronological timeline from actual session data or representative reconstruction
  const chronologicalEvents = hasLiveEvents
    ? timeline.slice().reverse()
    : [
        {
          id: 'def-1',
          timeString: '09:41',
          state: 'NORMAL' as const,
          title: 'Started',
          description: 'Departure from Hyderabad toward HITAM.',
          severity: 'normal' as const,
          telemetrySnapshot: { speed: 40, accel: 0.2, sensor: 'Corridor GPS Fix' },
        },
        {
          id: 'def-2',
          timeString: '09:47',
          state: 'NORMAL' as const,
          title: 'Normal',
          description: 'Cruising steadily on primary corridor.',
          severity: 'normal' as const,
          telemetrySnapshot: { speed: 42, accel: 0.1, sensor: 'Corridor Cruising' },
        },
        {
          id: 'def-3',
          timeString: '09:52',
          state: 'MEANINGFUL_CHANGE' as const,
          title: 'Meaningful Change',
          description: 'Unexpected standstill detected on active lane.',
          severity: 'warning' as const,
          telemetrySnapshot: { speed: 0, accel: -6.5, sensor: 'Motion Standstill' },
        },
        {
          id: 'def-4',
          timeString: '09:52',
          state: 'CONTEXT_ANALYSIS' as const,
          title: 'Context Checked',
          description: 'Evaluated corridor traffic, acoustic level, and posture.',
          severity: 'info' as const,
          telemetrySnapshot: { speed: 0, accel: 0, sensor: 'Context Evaluator' },
        },
        {
          id: 'def-5',
          timeString: '09:53',
          state: 'NORMAL' as const,
          title: 'Resumed',
          description: 'Rider confirmed safety; journey returned to normal cruising.',
          severity: 'normal' as const,
          telemetrySnapshot: { speed: 41, accel: 2.1, sensor: 'Motion Resumed' },
        },
      ];

  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [isExported, setIsExported] = useState<boolean>(false);

  const activeEvent = chronologicalEvents[selectedEventIndex] || chronologicalEvents[0];
  const distanceTraveled = Math.max(0.4, 32.0 - context.distanceRemainingKm).toFixed(1);
  const durationMin = Math.round(context.elapsedSeconds / 60) || 1;
  const finalState = context.evaluatorResult?.state || 'NORMAL';

  const handleExport = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-6 space-y-5 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
          <Laptop className="w-3.5 h-3.5" />
          <span>OFFICE KIT COMPANION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          Journey Reconstruction
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Primary Question: "What happened during the journey?"
        </p>
      </div>

      {/* LEVEL 1: HERO TRANSMISSION FLOW (PHONE -> CONTEXT -> LAPTOP) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-cyan-950/30 to-emerald-950/40 border-2 border-sky-500/40 text-center space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-sky-300 font-bold">
          ARCHITECTURAL DATA PIPELINE
        </div>
        <div className="flex items-center justify-center gap-2 md:gap-3 font-['Space_Grotesk'] font-black text-xs md:text-sm text-white">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
            <Smartphone className="w-4 h-4 text-[#00FF87]" />
            <span>PHONE</span>
          </div>
          <span className="text-sky-400 font-bold text-base">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-200">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>STRUCTURED CONTEXT</span>
          </div>
          <span className="text-sky-400 font-bold text-base">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10">
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>LAPTOP</span>
          </div>
        </div>
      </div>

      {/* LEVEL 2: JOURNEY SUMMARY STATS */}
      <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider font-bold text-slate-300">ROUTE SUMMARY</span>
          <span className="text-[#00FF87] font-bold">ACTIVE RECONSTRUCTION</span>
        </div>

        <div className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
          <span>Hyderabad</span>
          <ArrowRight className="w-4 h-4 text-[#00FF87]" />
          <span>HITAM Campus</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-white/5">
            <div className="text-xs text-slate-400">Distance</div>
            <div className="text-base font-bold text-white mt-0.5">{distanceTraveled} km</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5">
            <div className="text-xs text-slate-400">Duration</div>
            <div className="text-base font-bold text-white mt-0.5">{durationMin} min</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5">
            <div className="text-xs text-slate-400">Status</div>
            <div className="text-xs font-bold text-[#00FF87] mt-1 truncate">{finalState}</div>
          </div>
        </div>
      </div>

      {/* LEVEL 1: HIGH-LEGIBILITY CHRONOLOGICAL TIMELINE */}
      <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider font-bold text-white text-sm">
            JOURNEY RECONSTRUCTION TIMELINE
          </span>
          <span className="text-sky-400 font-bold">{chronologicalEvents.length} Events</span>
        </div>

        {/* Clear, Scan-Friendly Feed */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {chronologicalEvents.map((evt, idx) => {
            const isSelected = selectedEventIndex === idx;
            return (
              <div
                key={evt.id || idx}
                onClick={() => setSelectedEventIndex(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-500/25 border-sky-400 text-white shadow-lg'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sky-400 font-mono text-xs font-bold w-12 shrink-0">
                    {evt.timeString.slice(0, 5)}
                  </span>
                  <span className="font-['Space_Grotesk'] font-bold text-sm text-white">
                    {evt.title}
                  </span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold font-mono ${
                  evt.severity === 'danger'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : evt.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : evt.severity === 'info'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/30'
                }`}>
                  {evt.state.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Event Details Card */}
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-sm text-white">{activeEvent.title}</span>
            <span className="text-sky-400 font-bold">{activeEvent.timeString}</span>
          </div>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            {activeEvent.description}
          </p>
          {activeEvent.telemetrySnapshot && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Speed: <strong className="text-white">{activeEvent.telemetrySnapshot.speed} km/h</strong></span>
              <span>Sensor: <strong className="text-sky-300">{activeEvent.telemetrySnapshot.sensor}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Route Corridor Map Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>CORRIDOR RECONSTRUCTION</span>
          <span className="text-sky-400 font-bold">Hyderabad → HITAM</span>
        </div>
        <JourneyMap state="NORMAL" routeProgress={context.routeProgress || 60} isCompact={true} />
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleExport}
          className="w-full py-3.5 px-4 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border-2 border-sky-500/50 text-sky-300 font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
        >
          {isExported ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          <span>{isExported ? 'REPORT GENERATED (SIMULATED JSON)' : 'EXPORT JOURNEY RECONSTRUCTION'}</span>
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono font-bold text-xs cursor-pointer transition-colors"
        >
          RETURN
        </button>
      </div>
    </div>
  );
};

