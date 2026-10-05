import React, { useState } from 'react';
import { TripItem } from '../../types/journey';
import { Check, AlertCircle, ChevronRight, X, AlertOctagon } from 'lucide-react';

interface TripsScreenProps {
  trips?: TripItem[];
}

export const TripsScreen: React.FC<TripsScreenProps> = ({ trips: propTrips }) => {
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);

  const defaultTrips: TripItem[] = [
    {
      id: 'trip-today',
      dateLabel: 'TODAY',
      origin: 'Hyderabad',
      destination: 'HITAM',
      distance: '32.4 km',
      duration: '45 min',
      statusText: 'NORMAL',
      statusType: 'normal',
      sequence: 'NORMAL ── QUIET MONITORING',
      events: [
        { time: '09:41', label: 'Started', detail: 'Departure toward HITAM campus' },
        { time: '09:47', label: 'Cruising', detail: 'Steady 42 km/h corridor cruising' },
        { time: '10:26', label: 'Arrived safely', detail: 'Trip complete at destination' },
      ],
    },
    {
      id: 'trip-yesterday',
      dateLabel: 'YESTERDAY',
      origin: 'HITAM',
      destination: 'Hyderabad',
      distance: '34.0 km',
      duration: '52 min',
      statusText: 'MEANINGFUL CHANGE',
      statusType: 'warning',
      sequence: 'NORMAL ── MEANINGFUL CHANGE ── NORMAL',
      events: [
        { time: '18:15', label: 'Started', detail: 'Return commute from campus' },
        { time: '18:32', label: 'Traffic slowdown', detail: 'Ordinary flow adaptation near Medchal' },
        { time: '18:48', label: 'Roadside stop', detail: 'Confirmed safe via 1-tap confirmation' },
        { time: '19:07', label: 'Arrived safely', detail: 'Trip complete' },
      ],
    },
    {
      id: 'trip-sep30',
      dateLabel: 'SEP 30',
      origin: 'City Center',
      destination: 'Gachibowli IT Corridor',
      distance: '18.0 km',
      duration: '31 min',
      statusText: 'NORMAL',
      statusType: 'normal',
      sequence: 'NORMAL',
      events: [
        { time: '11:20', label: 'Started', detail: 'Urban route' },
        { time: '11:51', label: 'Arrived safely', detail: 'Smooth trip' },
      ],
    },
  ];

  const trips = (propTrips && propTrips.length > 0) ? propTrips : defaultTrips;

  return (
    <div className="flex flex-col h-full relative overflow-y-auto px-4 py-4 space-y-4 text-left animate-fadeIn pb-24 select-none">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black font-['Space_Grotesk'] text-white">
          JOURNEY HISTORY
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Primary Question: "What happened during my previous journeys?"
        </p>
      </div>

      {/* Trips List - High Visual Hierarchy */}
      <div className="space-y-3">
        {trips.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTrip(t)}
            className="p-4 rounded-3xl bg-black/40 border-2 border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-2.5 group active:scale-[0.99] shadow-sm"
          >
            {/* Top row: Date + Prominent State Badge */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400 font-black tracking-wider">{t.dateLabel}</span>
              <span
                className={`font-mono text-xs px-2.5 py-1 rounded-lg border-2 font-black flex items-center gap-1.5 ${
                  t.statusType === 'normal'
                    ? 'bg-emerald-500/20 border-[#00FF87]/50 text-[#00FF87]'
                    : t.statusType === 'warning'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-red-500/20 border-red-500/60 text-red-300'
                }`}
              >
                {t.statusType === 'normal' ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : t.statusType === 'warning' ? (
                  <AlertCircle className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <AlertOctagon className="w-3.5 h-3.5 stroke-[3]" />
                )}
                <span>{t.statusText}</span>
              </span>
            </div>

            {/* Destination Headline */}
            <div className="text-lg font-black text-white group-hover:text-[#00FF87] transition-colors font-['Space_Grotesk']">
              {t.origin} → {t.destination}
            </div>

            {/* Distance & Duration */}
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-bold pt-2 border-t border-white/10">
              <span>{t.distance} · {t.duration}</span>
              <div className="flex items-center gap-1 text-[#00FF87]">
                <span>INSPECT</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Journey Summary Modal (Contained within Phone Viewport) */}
      {selectedTrip && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex flex-col justify-end animate-fadeIn">
          <div className="w-full bg-[#0E121A] border-2 border-white/20 rounded-3xl p-5 space-y-4 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <div className="text-xs font-mono uppercase text-slate-400 font-bold">JOURNEY AUDIT</div>
                <div className="font-['Space_Grotesk'] font-black text-lg text-white">
                  {selectedTrip.origin} → {selectedTrip.destination}
                </div>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
              <span>Distance: {selectedTrip.distance}</span>
              <span>•</span>
              <span>Duration: {selectedTrip.duration}</span>
            </div>

            {/* Sequence pill */}
            <div className="p-3 rounded-2xl bg-[#00FF87]/15 border border-[#00FF87]/30 font-mono text-xs text-center font-black text-[#00FF87]">
              {selectedTrip.sequence}
            </div>

            {/* Event Timeline */}
            <div className="space-y-2 text-xs">
              <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                TIMELINE RECONSTRUCTION
              </div>
              {selectedTrip.events.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-mono text-sky-400 text-xs font-bold shrink-0 mt-0.5">{evt.time}</span>
                  <div>
                    <div className="font-bold text-white text-xs">{evt.label}</div>
                    <div className="text-slate-300 text-xs mt-0.5">{evt.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedTrip(null)}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              CLOSE AUDIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
