import React from 'react';
import { ArrowDown, Layers } from 'lucide-react';
import { JourneyState } from '../../types/journey';

interface IntelligencePipelineViewProps {
  currentStage?: string;
  currentState?: JourneyState;
  onBack: () => void;
}

export const IntelligencePipelineView: React.FC<IntelligencePipelineViewProps> = ({ 
  currentStage = 'BASELINE MONITORING',
  currentState = 'NORMAL',
  onBack 
}) => {
  const stages = [
    {
      step: '01',
      id: 'SIGNALS',
      title: 'SIGNALS (MULTIMODAL)',
      sub: '50Hz continuous IMU, multi-band GNSS, acoustics, and device posture.',
      tag: '50Hz SENSORS',
    },
    {
      step: '02',
      id: 'MOTION_GATE',
      title: 'MOTION GATE',
      sub: 'Low-power baseline envelope check. Filters ordinary riding dynamics.',
      tag: 'LOW-POWER FILTER',
    },
    {
      step: '03',
      id: 'ANOMALY_CANDIDATE',
      title: 'ANOMALY CANDIDATE',
      sub: 'Tripwire tripped by sudden deceleration, unusual tilt, or standstill.',
      tag: 'TRIPWIRE TRIP',
    },
    {
      step: '04',
      id: 'CONTEXT_VALIDATION',
      title: 'CONTEXT VALIDATION',
      sub: 'Corridor traffic check, acoustic queues, and camera horizon confirmation.',
      tag: 'MULTIMODAL REASONING',
    },
    {
      step: '05',
      id: 'JOURNEY_STATE',
      title: 'JOURNEY STATE',
      sub: 'Deterministic evaluator determines condition: Normal vs. Change vs. Incident.',
      tag: 'SOURCE OF TRUTH',
    },
    {
      step: '06',
      id: 'RIDER_RESPONSE',
      title: 'RIDER RESPONSE',
      sub: 'Action policy: Stay quiet, prompt 1-tap confirmation, or ready dispatch.',
      tag: 'ZERO FALSE ALARMS',
    },
  ];

  const isAnomaly = currentState === 'MEANINGFUL_CHANGE' || currentState === 'CONTEXT_ANALYSIS' || currentStage.includes('CANDIDATE');
  const isValidation = currentState === 'CONTEXT_ANALYSIS' || currentStage.includes('VALIDATION');
  const isResponse = currentState === 'RIDER_CONFIRMATION' || currentState === 'NORMAL_RECOVERED' || currentState === 'ASSIST';

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-4 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00FF87]/15 border border-[#00FF87]/30 text-[#00FF87] text-xs font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>CAUSAL ARCHITECTURE</span>
          </div>
          <span className="text-xs font-mono text-slate-300 font-bold">
            Active: <strong className="text-[#00FF87]">{currentState}</strong>
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          Intelligence Pipeline
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Primary Question: "How does RIDeGUARD reason?"
        </p>
      </div>

      {/* Large Readable Stage Nodes (Glanceable in 3 seconds) */}
      <div className="space-y-2">
        {stages.map((st, idx) => {
          let isActive = false;
          if (st.id === 'SIGNALS') isActive = true;
          else if (st.id === 'MOTION_GATE') isActive = currentState === 'NORMAL' || currentState === 'ORDINARY_CHANGE';
          else if (st.id === 'ANOMALY_CANDIDATE') isActive = isAnomaly;
          else if (st.id === 'CONTEXT_VALIDATION') isActive = isValidation;
          else if (st.id === 'JOURNEY_STATE') isActive = true;
          else if (st.id === 'RIDER_RESPONSE') isActive = isResponse;

          return (
            <React.Fragment key={st.step}>
              <div className={`p-4 rounded-2xl border-2 transition-all ${
                isActive
                  ? 'border-[#00FF87]/60 bg-[#00FF87]/10 text-white shadow-md'
                  : 'border-white/10 bg-black/40 text-slate-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-[#00FF87] text-black' : 'bg-white/10 text-slate-400'
                    }`}>
                      {st.step}
                    </span>
                    <span className="font-['Space_Grotesk'] font-black text-sm md:text-base text-white">
                      {st.title}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-[#00FF87]/20 text-[#00FF87]' : 'bg-white/5 text-slate-500'
                  }`}>
                    {st.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1.5 leading-relaxed">
                  {st.sub}
                </p>
              </div>

              {idx < stages.length - 1 && (
                <div className="flex justify-center text-[#00FF87]/60 py-0.5">
                  <ArrowDown className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Return button */}
      <div className="pt-2">
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono font-bold text-xs cursor-pointer transition-colors"
        >
          RETURN TO JOURNEY
        </button>
      </div>
    </div>
  );
};

