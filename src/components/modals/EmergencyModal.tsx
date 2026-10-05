import React from 'react';
import { JourneyContext } from '../../types/journey';
import { X, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  context: JourneyContext;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  context,
  onClose,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#0E1118] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-[#00FF87]" />
            <span className="font-['Space_Grotesk'] font-bold text-base text-white">
              ASSISTANCE READY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prototype Simulation Notice */}
        <p className="text-xs text-slate-400 font-mono">
          Prototype simulation: Context assistance payload prepared for emergency broadcast.
        </p>

        {/* Clean Context Payload Summary */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
          <div className="text-slate-400 font-mono text-[11px] uppercase">
            Preserved Location & Context
          </div>
          <div className="text-white font-semibold">
            {context.locationName}
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            {context.coordinates.lat.toFixed(4)}° N, {context.coordinates.lng.toFixed(4)}° E • {currentTime}
          </div>
          {context.observedAnomalyReason && (
            <div className="pt-2 border-t border-white/5 text-[11px] text-amber-300 font-mono">
              Observed: {context.observedAnomalyReason}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-['Space_Grotesk'] font-bold text-sm tracking-wide cursor-pointer transition-all"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
};
