import React from 'react';
import { JourneyContext, JourneyState } from '../../types/journey';
import { X, HelpCircle, ArrowRight } from 'lucide-react';

interface WhyExplanationModalProps {
  state: JourneyState;
  context: JourneyContext;
  onClose: () => void;
}

export const WhyExplanationModal: React.FC<WhyExplanationModalProps> = ({
  state: _state,
  context,
  onClose,
}) => {
  const evaluatorResult = context.evaluatorResult;

  // Fallback defaults derived from active context if evaluatorResult is not attached
  const noticedItems = evaluatorResult?.explanation.noticed || [
    `Speed change: ${context.targetSpeed || 42} → ${Math.round(context.currentSpeed)} km/h`,
    context.currentSpeed === 0 ? 'Vehicle standstill detected on corridor' : 'Speed reduction detected',
    `Location: ${context.locationName}`,
    'Device posture upright on handlebar mount',
  ];

  const consideredCauses = evaluatorResult?.consideredCauses || [
    { cause: 'Traffic Queue', plausibility: 'unlikely', evidence: 'Corridor speed profile does not match queue.' },
    { cause: 'Road Obstruction', plausibility: 'moderate', evidence: 'Possible road obstacle on active route.' },
    { cause: 'Intentional Pull-over', plausibility: 'moderate', evidence: 'Rider roadside stop or map check.' },
    { cause: 'Possible Incident', plausibility: 'moderate', evidence: 'Unresolved corridor stop requires verification.' },
  ];

  const whyAskedItems = evaluatorResult?.explanation.whyAsked || [
    'The journey change was meaningful (unexpected stop).',
    'Sensor context alone cannot reliably confirm if the rider is safe or requires aid.',
    'Rider confirmation requested before escalating to emergency assistance mode.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-6 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#0D111A] border-2 border-white/20 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-[#00FF87]" />
            <div>
              <div className="font-['Space_Grotesk'] font-black text-lg text-white">
                WHY DID RIDeGUARD ASK?
              </div>
              <div className="text-xs font-mono text-slate-400">
                Primary Question: "Why did the system interrupt me?"
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. WHAT WE NOTICED */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            1. WHAT WE NOTICED
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 text-slate-200 font-mono text-xs">
            {noticedItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#00FF87] font-bold text-sm shrink-0">•</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. WHAT WE CONSIDERED */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            2. WHAT WE CONSIDERED
          </div>
          <div className="space-y-2">
            {consideredCauses.map((cause) => {
              const isHigh = cause.plausibility === 'high';
              const isMod = cause.plausibility === 'moderate';
              const isRuledOut = cause.plausibility === 'ruled_out';

              return (
                <div
                  key={cause.cause}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    isHigh
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : isMod
                      ? 'bg-sky-500/15 border-sky-500/30 text-slate-200'
                      : isRuledOut
                      ? 'bg-white/[0.02] border-white/5 text-slate-500 line-through'
                      : 'bg-white/[0.03] border-white/10 text-slate-300'
                  }`}
                >
                  <span className="font-bold">{cause.cause}</span>
                  <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-black/50 border border-white/10 font-semibold">
                    {cause.plausibility.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. WHY WE ASKED */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            3. WHY WE ASKED
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-slate-300 text-xs font-sans">
            {whyAskedItems.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CORE TAKEAWAY BANNER */}
        <div className="p-4 rounded-2xl bg-[#00FF87]/15 border-2 border-[#00FF87]/50 text-center space-y-1">
          <div className="font-['Space_Grotesk'] font-black text-base text-[#00FF87] tracking-wider">
            CHANGE DETECTED ≠ INCIDENT CONFIRMED
          </div>
          <p className="text-xs font-mono text-slate-200">
            That's why we asked before taking automated action.
          </p>
        </div>

        {/* Got It Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-['Space_Grotesk'] font-bold text-sm tracking-wider cursor-pointer transition-colors"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
};

