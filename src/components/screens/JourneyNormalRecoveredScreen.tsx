import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface JourneyNormalRecoveredScreenProps {
  onReturnToJourney: () => void;
}

export const JourneyNormalRecoveredScreen: React.FC<JourneyNormalRecoveredScreenProps> = ({
  onReturnToJourney,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReturnToJourney();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onReturnToJourney]);
  return (
    <div className="flex flex-col h-full justify-between px-6 py-8 text-center animate-fadeIn select-none">
      {/* Center confirmation */}
      <div className="space-y-4 my-auto">
        <div className="w-16 h-16 rounded-full bg-[#00FF87]/15 border-2 border-[#00FF87] flex items-center justify-center mx-auto text-[#00FF87] shadow-xl">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
          ALL GOOD
        </h1>

        <div className="space-y-1">
          <p className="text-base text-slate-200 font-medium">
            Continuing your journey.
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            RideGuard will keep watching quietly in the background.
          </p>
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-6">
        <button
          onClick={onReturnToJourney}
          className="w-full py-4 px-6 rounded-2xl bg-[#00FF87] hover:bg-[#00FF87]/90 active:scale-[0.98] text-black font-['Space_Grotesk'] font-bold text-base tracking-wider glow-neon-green shadow-xl cursor-pointer transition-all"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};
