import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';

interface RiderConfirmationScreenProps {
  onConfirmImOkay: () => void;
  onConfirmNeedHelp: () => void;
  onOpenWhy: () => void;
}

export const RiderConfirmationScreen: React.FC<RiderConfirmationScreenProps> = ({
  onConfirmImOkay,
  onConfirmNeedHelp,
  onOpenWhy,
}) => {
  return (
    <div className="flex flex-col h-full justify-between px-5 py-8 text-center animate-fadeIn select-none">
      {/* Top Question */}
      <div className="space-y-4 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>MEANINGFUL CHANGE DETECTED</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight font-['Space_Grotesk'] text-white">
          ARE YOU OKAY?
        </h1>

        <p className="text-base text-slate-200 max-w-xs mx-auto font-medium leading-relaxed">
          RIDeGUARD noticed an unexpected stop in your journey.
        </p>
      </div>

      {/* Two Dominant Buttons (Clear Glanceability from 2 meters) */}
      <div className="space-y-3.5 pt-4">
        <button
          onClick={onConfirmImOkay}
          className="w-full py-5 px-6 rounded-2xl bg-[#00FF87] hover:bg-[#00FF87]/90 active:scale-[0.98] text-black font-['Space_Grotesk'] font-black text-2xl tracking-wider glow-neon-green shadow-2xl cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <span>I'M OKAY</span>
        </button>

        <button
          onClick={onConfirmNeedHelp}
          className="w-full py-5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-['Space_Grotesk'] font-black text-2xl tracking-wider glow-incident-red shadow-2xl cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <span>I NEED HELP</span>
        </button>
      </div>

      {/* Why Prompt */}
      <div className="pt-5">
        <button
          onClick={onOpenWhy}
          className="text-sm font-mono font-bold text-slate-300 hover:text-[#00FF87] flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer p-2 rounded-xl hover:bg-white/5"
        >
          <HelpCircle className="w-4 h-4 text-[#00FF87]" />
          <span>WHY DID RIDeGUARD ASK?</span>
        </button>
      </div>
    </div>
  );
};

