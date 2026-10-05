import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { StructuredSensorContext } from '../../types/journey';
import { 
  evaluateJourneyContext, 
  createTrafficSlowdownContext, 
  createAbruptStopContext, 
  createRoadsidePullOverContext, 
  createPossibleIncidentContext, 
  createCruisingContext 
} from '../../engine/journeyEvaluator';

interface ScenarioLabViewProps {
  onLoadScenarioInput: (input: StructuredSensorContext) => void;
  onClose: () => void;
}

export const ScenarioLabView: React.FC<ScenarioLabViewProps> = ({
  onLoadScenarioInput,
  onClose,
}) => {
  const scenarioConfigs = [
    {
      id: 'traffic',
      title: 'Traffic Slowdown',
      tag: 'ORDINARY CHANGE',
      color: 'border-sky-500/50 bg-sky-500/10 text-sky-400',
      badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
      input: createTrafficSlowdownContext(),
      motionStatus: 'Decel: -1.8 m/s²',
      contextStatus: 'Corridor Traffic Queue',
      responsePolicy: 'Stay quiet · Silent adaptation',
    },
    {
      id: 'meaningful',
      title: 'Unexpected Stop',
      tag: 'MEANINGFUL CHANGE',
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      input: createAbruptStopContext(),
      motionStatus: 'Standstill: 0 km/h',
      contextStatus: 'Cause Inconclusive',
      responsePolicy: 'Ask rider · 1-tap confirmation',
    },
    {
      id: 'pullover',
      title: 'Intentional Pull-Over',
      tag: 'MEANINGFUL CHANGE',
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      input: createRoadsidePullOverContext(),
      motionStatus: 'Controlled decel (-4.2 m/s²)',
      contextStatus: 'Shoulder lay-by + 58° tilt',
      responsePolicy: 'Check with rider · Verify safe dismount',
    },
    {
      id: 'incident',
      title: 'Possible Incident',
      tag: 'POSSIBLE INCIDENT',
      color: 'border-red-500/50 bg-red-500/10 text-red-400',
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30',
      input: createPossibleIncidentContext(),
      motionStatus: 'Severe impact (-7.2 m/s²)',
      contextStatus: 'Vehicle tilt 78°',
      responsePolicy: 'Assistance mode · Location payload ready',
    },
    {
      id: 'cruising',
      title: 'Normal Cruising',
      tag: 'NORMAL',
      color: 'border-[#00FF87]/50 bg-[#00FF87]/10 text-[#00FF87]',
      badgeColor: 'bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/30',
      input: createCruisingContext(),
      motionStatus: 'Within envelope (42 km/h)',
      contextStatus: 'Clear expressway corridor',
      responsePolicy: 'Quiet background monitoring',
    },
  ];

  const [selectedId, setSelectedId] = useState<string>('traffic');

  const selectedScenario = scenarioConfigs.find((s) => s.id === selectedId) || scenarioConfigs[0];
  const evaluation = evaluateJourneyContext(selectedScenario.input);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-6 animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#0B0F17] border border-white/20 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#00FF87]" />
            <div>
              <div className="font-['Space_Grotesk'] font-bold text-lg text-white">
                SCENARIO LAB: CONTEXT VALIDATION
              </div>
              <div className="text-xs font-mono text-slate-400">
                Primary Question: "How does context change the journey state?"
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* LEVEL 1: HERO ARCHITECTURAL FLOW (Glanceable in 3 seconds from across the room) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-amber-500/10 border border-white/15 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 md:gap-4 font-['Space_Grotesk'] font-black text-sm md:text-base tracking-wide text-white">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-100">
                SAME EVENT
              </span>
              <span className="text-[#00FF87] font-bold text-lg">↓</span>
              <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                DIFFERENT CONTEXT
              </span>
              <span className="text-[#00FF87] font-bold text-lg">↓</span>
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                DIFFERENT STATE
              </span>
            </div>
          </div>

          {/* LEVEL 1: TWO LARGE COMPARISON BLOCKS (CASE A vs CASE B) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* CASE A */}
            <div className="p-4 rounded-2xl bg-sky-950/30 border-2 border-sky-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                <span className="font-['Space_Grotesk'] font-black text-sm text-sky-400 uppercase tracking-wider">
                  CASE A: EXPECTED TRAFFIC
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  SPEED 42 → 22 KM/H
                </span>
              </div>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div className="font-semibold text-white">CONTEXT: TRAFFIC CONGESTION</div>
                <div className="text-slate-400">Dense corridor flow + acoustic queues</div>
              </div>
              <div className="flex justify-center text-sky-400">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-500/40 text-center space-y-0.5">
                <div className="font-['Space_Grotesk'] font-black text-base text-sky-300 tracking-wide">
                  ORDINARY CHANGE
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400">
                  ACTION: STAY QUIET
                </div>
              </div>
            </div>

            {/* CASE B */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="font-['Space_Grotesk'] font-black text-sm text-amber-400 uppercase tracking-wider">
                  CASE B: UNRESOLVED STOP
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  SPEED 42 → 0 KM/H
                </span>
              </div>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div className="font-semibold text-white">CONTEXT: UNRESOLVED CAUSE</div>
                <div className="text-slate-400">No traffic queue · Unexpected standstill</div>
              </div>
              <div className="flex justify-center text-amber-400">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center space-y-0.5">
                <div className="font-['Space_Grotesk'] font-black text-base text-amber-300 tracking-wide">
                  MEANINGFUL CHANGE
                </div>
                <div className="text-xs font-mono font-bold text-amber-200">
                  ACTION: ASK RIDER
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 1: CORE TAKEAWAY BANNER */}
          <div className="p-3.5 rounded-2xl bg-[#00FF87]/15 border-2 border-[#00FF87]/50 text-center space-y-1">
            <div className="font-['Space_Grotesk'] font-black text-base md:text-lg text-[#00FF87] tracking-wider">
              CORE PRINCIPLE: EVENT ≠ MEANING
            </div>
            <p className="text-xs font-mono text-slate-200">
              A sudden deceleration is not automatically an incident. Multimodal context determines the state.
            </p>
          </div>

          {/* LEVEL 2 & 3: SECONDARY INTERACTIVE TESTER */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              INTERACTIVE SCENARIO INSPECTION
            </div>

            {/* Scenario Selection Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {scenarioConfigs.map((sc) => {
                const isSelected = selectedId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedId(sc.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? `${sc.badgeColor} shadow-md`
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc.title}
                  </button>
                );
              })}
            </div>

            {/* Selected Scenario Evaluator Snapshot */}
            <div className={`p-4 rounded-2xl border ${selectedScenario.color} space-y-3`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">EVALUATOR DECISION</div>
                  <div className="font-['Space_Grotesk'] font-black text-lg text-white">
                    {evaluation.state}
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-lg font-bold font-mono ${selectedScenario.badgeColor}`}>
                  {selectedScenario.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-slate-400 block text-[11px]">MOTION GATE</span>
                  <span className="text-white font-bold">{selectedScenario.motionStatus}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-slate-400 block text-[11px]">CONTEXT STATUS</span>
                  <span className="text-white font-bold">{selectedScenario.contextStatus}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 text-xs">
                <div className="text-slate-400 font-mono text-[11px]">REASONING:</div>
                <div className="text-slate-200 font-semibold">{evaluation.anomalyReason}</div>
                <div className="text-[#00FF87] font-mono font-bold pt-1">
                  RESPONSE: {selectedScenario.responsePolicy}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onLoadScenarioInput(selectedScenario.input);
              onClose();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#00FF87] hover:bg-[#00FF87]/90 active:scale-[0.98] text-black font-['Space_Grotesk'] font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl"
          >
            <span>LOAD CONDITIONS INTO SIMULATOR</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={onClose}
            className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono font-bold text-xs cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

