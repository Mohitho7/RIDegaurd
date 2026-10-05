import React from 'react';
import { X, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  isFrameEnabled: boolean;
  onToggleFrame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isFrameEnabled,
  onToggleFrame,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0D111A] border border-white/20 rounded-3xl p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00FF87]" />
            <span className="font-['Space_Grotesk'] font-bold text-sm text-white">
              RIDEGUARD PREFERENCES
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Display Mode */}
        <div className="glass-panel p-3 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase">
            Demo Display Frame
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">iQOO 13 Smartphone Frame</div>
              <div className="text-[10px] text-slate-400">Toggle realistic mobile bezel viewport</div>
            </div>
            <button
              onClick={onToggleFrame}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                isFrameEnabled
                  ? 'bg-[#00FF87] text-black'
                  : 'bg-white/10 text-slate-400 border border-white/20'
              }`}
            >
              {isFrameEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* On-Device Core Intelligence Config */}
        <div className="glass-panel p-3 rounded-2xl space-y-2.5 text-xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            On-Device Engine Settings
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Local Journey-State Engine</span>
            <span className="text-[#00FF87] font-mono font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Sampling Rate</span>
            <span className="text-slate-300 font-mono">50 Hz Continuous</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">Anomaly Verification Delay</span>
            <span className="text-slate-300 font-mono">1.8 Seconds</span>
          </div>
        </div>

        {/* Vehicle Profile */}
        <div className="glass-panel p-3 rounded-2xl space-y-1.5 text-xs">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            Selected Vehicle Profile
          </div>
          <div className="text-white font-semibold">Two-Wheeler (Performance Sport / Roadster)</div>
          <div className="text-[11px] text-slate-400 font-mono">
            Optimized for motorcycle deceleration dynamics and lean-angles.
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold cursor-pointer transition-colors"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};
