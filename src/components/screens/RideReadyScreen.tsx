import React, { useState } from 'react';
import { JourneyContext } from '../../types/journey';
import { JourneyMap } from '../map/JourneyMap';
import { Play, Map, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface RideReadyScreenProps {
  context: JourneyContext;
  onStartRide: () => void;
}

export const RideReadyScreen: React.FC<RideReadyScreenProps> = ({
  onStartRide,
}) => {
  const [showRouteMap, setShowRouteMap] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full justify-between px-5 py-7 text-left animate-fadeIn select-none">
      {/* Top Greeting & Hero */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF87]" />
            <span>SYSTEM STANDBY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-['Space_Grotesk'] text-white">
            READY FOR YOUR JOURNEY?
          </h1>
        </div>

        {/* Route Card - Glanceable in 3 seconds */}
        <div className="p-5 rounded-3xl bg-white/[0.04] border-2 border-white/10 space-y-3.5 shadow-xl">
          <div className="space-y-1.5">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              PLANNED ROUTE CORRIDOR
            </div>
            <div className="text-2xl font-black font-['Space_Grotesk'] text-white flex items-center gap-2.5">
              <span>Hyderabad</span>
              <ArrowRight className="w-5 h-5 text-[#00FF87]" />
              <span>HITAM</span>
            </div>
            <div className="text-sm font-mono text-slate-300 font-bold">
              32.0 km · ~45 min
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00FF87] pt-2 border-t border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF87] animate-pulse" />
            <span>Journey Intelligence Standby</span>
          </div>
        </div>

        {/* Optional Route Preview Map */}
        {showRouteMap && (
          <div className="space-y-1 animate-fadeIn">
            <JourneyMap state="READY" routeProgress={0} isCompact={true} />
          </div>
        )}
      </div>

      {/* Primary Actions */}
      <div className="space-y-3 pt-6">
        <button
          onClick={onStartRide}
          className="w-full py-5 px-6 rounded-2xl bg-[#00FF87] hover:bg-[#00FF87]/90 active:scale-[0.98] text-black font-['Space_Grotesk'] font-black text-xl tracking-wider flex items-center justify-center gap-2.5 glow-neon-green shadow-2xl cursor-pointer transition-all"
        >
          <Play className="w-6 h-6 fill-black stroke-none" />
          <span>START RIDE</span>
        </button>

        <button
          onClick={() => setShowRouteMap(!showRouteMap)}
          className="w-full py-3 text-center text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Map className="w-4 h-4" />
          <span>{showRouteMap ? 'HIDE ROUTE MAP' : 'VIEW ROUTE MAP'}</span>
          {showRouteMap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

