import React from 'react';
import { MainTab } from '../../types/journey';
import { Navigation, Route, Users, User } from 'lucide-react';

interface PrimaryNavBarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  isRiding: boolean;
}

export const PrimaryNavBar: React.FC<PrimaryNavBarProps> = ({
  currentTab,
  onSelectTab,
  isRiding,
}) => {
  return (
    <nav className="shrink-0 bg-[#080B10]/95 backdrop-blur-md border-t border-white/10 px-6 py-2.5 flex items-center justify-between select-none z-30">
      {/* 1. RIDE */}
      <button
        onClick={() => onSelectTab('RIDE')}
        className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
          currentTab === 'RIDE'
            ? 'text-[#00FF87] font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Navigation className="w-5 h-5" />
          {isRiding && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
          )}
        </div>
        <span className="text-[10px] font-mono tracking-wider">RIDE</span>
      </button>

      {/* 2. TRIPS */}
      <button
        onClick={() => onSelectTab('TRIPS')}
        className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
          currentTab === 'TRIPS'
            ? 'text-[#00FF87] font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Route className="w-5 h-5" />
        <span className="text-[10px] font-mono tracking-wider">TRIPS</span>
      </button>

      {/* 3. GROUP */}
      <button
        onClick={() => onSelectTab('GROUP')}
        className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
          currentTab === 'GROUP'
            ? 'text-[#00FF87] font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] font-mono tracking-wider">GROUP</span>
      </button>

      {/* 4. YOU */}
      <button
        onClick={() => onSelectTab('YOU')}
        className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
          currentTab === 'YOU'
            ? 'text-[#00FF87] font-semibold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-mono tracking-wider">YOU</span>
      </button>
    </nav>
  );
};
