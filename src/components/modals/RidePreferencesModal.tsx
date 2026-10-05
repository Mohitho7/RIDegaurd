import React, { useState } from 'react';
import { X, Sliders, VolumeX, BellRing, Gauge, ShieldCheck, Check } from 'lucide-react';

interface RidePreferencesModalProps {
  onClose: () => void;
}

export const RidePreferencesModal: React.FC<RidePreferencesModalProps> = ({ onClose }) => {
  const [silentKnownCorridors, setSilentKnownCorridors] = useState<boolean>(true);
  const [hapticAlerts, setHapticAlerts] = useState<boolean>(true);
  const [sensitivity, setSensitivity] = useState<'BALANCED' | 'HIGH' | 'CONSERVATIVE'>('BALANCED');
  const [speedWarningThreshold, setSpeedWarningThreshold] = useState<number>(60);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#0E121A] border border-white/20 rounded-3xl p-5 space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00FF87]" />
            <span className="font-['Space_Grotesk'] font-bold text-sm text-white">
              RIDE PREFERENCES
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Silent Adaptation on Known Corridors */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">Silent Mode on Corridors</span>
            </div>
            <button
              onClick={() => setSilentKnownCorridors(!silentKnownCorridors)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                silentKnownCorridors ? 'bg-[#00FF87]' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${
                  silentKnownCorridors ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Stay completely quiet during ordinary slowdowns when corridor context explains the change.
          </p>
        </div>

        {/* 2. Anomaly Gating Sensitivity */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
            <span className="font-bold text-white">Motion Gate Sensitivity</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono text-[11px]">
            {(['CONSERVATIVE', 'BALANCED', 'HIGH'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSensitivity(lvl)}
                className={`py-1.5 px-2 rounded-xl text-center font-bold transition-all cursor-pointer ${
                  sensitivity === lvl
                    ? 'bg-[#00FF87] text-black shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Haptic Alerts for Meaningful Change */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Haptic Prompts</span>
            </div>
            <button
              onClick={() => setHapticAlerts(!hapticAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                hapticAlerts ? 'bg-[#00FF87]' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${
                  hapticAlerts ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Vibrate device when prompting rider safety confirmation (“Are You Okay?”).
          </p>
        </div>

        {/* 4. Speed Advisory Filter */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white">Urban Speed Advisory</span>
            </div>
            <span className="font-mono text-[#00FF87] font-bold">{speedWarningThreshold} km/h</span>
          </div>
          <input
            type="range"
            min="40"
            max="90"
            step="5"
            value={speedWarningThreshold}
            onChange={(e) => setSpeedWarningThreshold(Number(e.target.value))}
            className="w-full accent-[#00FF87] cursor-pointer"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-[#00FF87] hover:bg-[#00FF87]/90 text-black font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4" />
              <span>PREFERENCES SAVED!</span>
            </>
          ) : (
            <span>APPLY & CLOSE</span>
          )}
        </button>
      </div>
    </div>
  );
};
