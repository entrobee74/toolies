/**
 * DEGENCALC — Terminal Header
 */

import React from 'react';
import { Activity, Zap, Share2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenShare: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenShare,
  onReset,
}) => {
  return (
    <header className="border-b border-[#262E26] bg-[#0c0f0c]/95 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('calculator')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded bg-[#181E18] border border-[#c5f300]/40 flex items-center justify-center text-[#c5f300] font-black group-hover:lime-glow transition-all">
              <Zap className="w-5 h-5 fill-[#c5f300]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#c5f300] transition-colors">
                  DEGEN<span className="text-[#c5f300]">CALC</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c5f300]/10 text-[#c5f300] border border-[#c5f300]/30">
                  v2.4 TERMINAL
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider hidden md:block">
                Memecoin Profit & Fee Calculator
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-mono">
          <button
            onClick={() => onSelectTab('calculator')}
            className={`px-3 py-1.5 rounded transition-colors ${
              currentTab === 'calculator'
                ? 'bg-[#181E18] text-[#c5f300] border border-[#c5f300]/40'
                : 'text-gray-400 hover:text-white hover:bg-[#181E18]/50'
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => onSelectTab('price-impact')}
            className={`px-3 py-1.5 rounded transition-colors ${
              currentTab === 'price-impact'
                ? 'bg-[#181E18] text-[#c5f300] border border-[#c5f300]/40'
                : 'text-gray-400 hover:text-white hover:bg-[#181E18]/50'
            }`}
          >
            PRICE IMPACT
          </button>
          <button
            onClick={() => onSelectTab('solana')}
            className={`px-3 py-1.5 rounded transition-colors ${
              currentTab === 'solana'
                ? 'bg-[#181E18] text-[#c5f300] border border-[#c5f300]/40'
                : 'text-gray-400 hover:text-white hover:bg-[#181E18]/50'
            }`}
          >
            SOLANA PnL
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 rounded transition-colors ${
              currentTab === 'guide'
                ? 'bg-[#181E18] text-[#c5f300] border border-[#c5f300]/40'
                : 'text-gray-400 hover:text-white hover:bg-[#181E18]/50'
            }`}
          >
            TRADER GUIDE
          </button>
          <button
            onClick={() => onSelectTab('faq')}
            className={`px-3 py-1.5 rounded transition-colors ${
              currentTab === 'faq'
                ? 'bg-[#181E18] text-[#c5f300] border border-[#c5f300]/40'
                : 'text-gray-400 hover:text-white hover:bg-[#181E18]/50'
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181E18] border border-[#262E26] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#c5f300] animate-pulse"></span>
            <span className="text-gray-300">DEX ENGINE</span>
            <span className="text-[#c5f300] font-bold">ONLINE</span>
          </div>

          <button
            onClick={onReset}
            title="Reset calculator inputs"
            className="p-2 rounded bg-[#181E18] border border-[#262E26] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenShare}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#c5f300] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#afd440] transition-all lime-glow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Card</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden border-t border-[#262E26] px-3 py-1.5 flex items-center gap-2 overflow-x-auto text-[11px] font-mono no-scrollbar">
        {[
          { id: 'calculator', label: 'Terminal' },
          { id: 'price-impact', label: 'Price Impact' },
          { id: 'solana', label: 'Solana PnL' },
          { id: 'guide', label: 'Guide (800w)' },
          { id: 'faq', label: 'FAQ' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-2.5 py-1 rounded shrink-0 ${
              currentTab === item.id
                ? 'bg-[#c5f300] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
