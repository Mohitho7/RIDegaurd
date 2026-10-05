import React from 'react';
import { Shield, Terminal } from 'lucide-react';

interface TopBarProps {
  onOpenDemoConsole: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenDemoConsole }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#07080B]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-all select-none">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#00FF87]/15 border border-[#00FF87]/30 flex items-center justify-center text-[#00FF87]">
          <Shield className="w-4 h-4" />
        </div>
        <span className="font-['Space_Grotesk'] font-extrabold tracking-wider text-base text-white">
          RIDEGUARD
        </span>
      </div>

      {/* Discreet Demo / Judge Trigger */}
      <button
        onClick={onOpenDemoConsole}
        title="Judge Demo Mode & Tech Suite"
        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
      >
        <Terminal className="w-3 h-3 text-[#00FF87]" />
        <span>DEMO</span>
      </button>
    </header>
  );
};
