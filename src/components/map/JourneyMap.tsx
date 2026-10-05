import React from 'react';
import { JourneyState } from '../../types/journey';

interface JourneyMapProps {
  state: JourneyState;
  routeProgress: number; // 0 to 100
  isCompact?: boolean;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ state, routeProgress, isCompact = false }) => {
  const startPoint = { x: 45, y: 160 };
  const midPoint1 = { x: 110, y: 130 };
  const midPoint2 = { x: 180, y: 85 };
  const midPoint3 = { x: 250, y: 55 };
  const endPoint = { x: 315, y: 30 };

  const progressRatio = Math.min(1, Math.max(0, routeProgress / 100));
  const riderX = 45 + (315 - 45) * progressRatio + Math.sin(progressRatio * Math.PI) * 12;
  const riderY = 160 - (160 - 30) * progressRatio + Math.cos(progressRatio * Math.PI) * 8;

  const isWarning = state === 'MEANINGFUL_CHANGE' || state === 'CONTEXT_ANALYSIS' || state === 'RIDER_CONFIRMATION';
  const isDanger = state === 'POSSIBLE_INCIDENT' || state === 'ASSIST';

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-white/5 bg-[#090C12] ${isCompact ? 'h-36' : 'h-48'}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-[#090C12] via-transparent to-[#090C12]/50 pointer-events-none" />

      {/* Simplified Vector Map */}
      <svg className="w-full h-full" viewBox="0 0 360 190" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Subtle Background Road Traces */}
        <path d="M10 180 Q130 150 200 170 T350 160" stroke="rgba(255,255,255,0.03)" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 90 Q150 110 280 80 T350 50" stroke="rgba(255,255,255,0.03)" strokeWidth="5" strokeLinecap="round" />

        {/* Primary Route Corridor */}
        <path
          d={`M ${startPoint.x} ${startPoint.y} Q ${midPoint1.x} ${midPoint1.y} ${midPoint2.x} ${midPoint2.y} T ${midPoint3.x} ${midPoint3.y} T ${endPoint.x} ${endPoint.y}`}
          stroke="#18202E"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Active Route Colored Line */}
        <path
          d={`M ${startPoint.x} ${startPoint.y} Q ${midPoint1.x} ${midPoint1.y} ${midPoint2.x} ${midPoint2.y} T ${midPoint3.x} ${midPoint3.y} T ${endPoint.x} ${endPoint.y}`}
          stroke={isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#00FF87'}
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-80"
        />

        {/* Origin Dot */}
        <circle cx={startPoint.x} cy={startPoint.y} r="3" fill="#00FF87" />

        {/* Destination Dot */}
        <circle cx={endPoint.x} cy={endPoint.y} r="4" fill="#38BDF8" />

        {/* Dynamic Rider Position */}
        <g transform={`translate(${riderX}, ${riderY})`}>
          <circle
            r="10"
            fill={isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#00FF87'}
            fillOpacity="0.25"
            className="animate-pulse"
          />
          <circle
            r="4.5"
            fill="#FFFFFF"
            stroke={isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#00FF87'}
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
};
