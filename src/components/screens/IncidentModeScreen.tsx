import React from 'react';
import { JourneyContext } from '../../types/journey';
import { AlertOctagon, MapPin, Clock, ShieldAlert } from 'lucide-react';

interface IncidentModeScreenProps {
  context: JourneyContext;
  onCancelIncident: () => void;
  onOpenEmergencyModal: () => void;
}

export const IncidentModeScreen: React.FC<IncidentModeScreenProps> = ({
  context,
  onCancelIncident,
  onOpenEmergencyModal,
}) => {
  const anomalyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="flex flex-col h-full justify-between px-5 py-7 text-left animate-fadeIn select-none">
      {/* Top Header */}
      <div className="space-y-5">
        {/* DOMINANT HERO STATE BANNER - Readable from across the room */}
        <div className="p-4 rounded-3xl bg-red-600/20 border-2 border-red-500/60 shadow-2xl space-y-1.5 glow-incident-red">
          <div className="inline-flex items-center gap-2 text-red-300 font-mono font-bold text-xs uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>JOURNEY STATE</span>
          </div>
          <div className="font-['Space_Grotesk'] font-black text-2xl md:text-3xl text-red-300 tracking-wider flex items-center gap-2">
            <AlertOctagon className="w-7 h-7 text-red-400 shrink-0" />
            <span>POSSIBLE INCIDENT</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-['Space_Grotesk'] text-white">
            ASSISTANCE MODE
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Your journey context has been preserved and prepared for emergency dispatch.
          </p>
        </div>

        {/* Clean Context Card */}
        <div className="p-5 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3.5">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>CURRENT LOCATION</span>
            </div>
            <div className="text-base font-bold text-white mt-1">
              {context.locationName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>TIME OF EVENT</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                {anomalyTime}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>PAYLOAD STATUS</span>
              </div>
              <div className="text-sm font-bold text-red-400 mt-1">
                Ready to Transmit
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {/* Primary: PAYLOAD */}
        <button
          onClick={onOpenEmergencyModal}
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-['Space_Grotesk'] font-black text-lg tracking-wider glow-incident-red shadow-2xl cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <span>VIEW ASSISTANCE PAYLOAD (READY)</span>
        </button>

        {/* Secondary: CANCEL */}
        <button
          onClick={onCancelIncident}
          className="w-full py-3 text-center text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          CANCEL & RETURN TO RIDE
        </button>
      </div>
    </div>
  );
};

