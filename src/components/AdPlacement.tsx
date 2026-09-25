/**
 * DEGENCALC — Ad Placements
 * Crypto Display Network Units (Coinzilla / A-ADS / AdSense)
 * Built with reserved slot heights to eliminate CLS (Cumulative Layout Shift).
 */

import React from 'react';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';

interface AdPlacementProps {
  slot: 'leaderboard' | 'rectangle' | 'sticky-mobile' | 'in-content';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ slot, className = '' }) => {
  if (slot === 'sticky-mobile') {
    return (
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c0f0c] border-t border-[#262E26] h-[60px] flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#181E18] border border-[#c5f300]/40 flex items-center justify-center text-[#c5f300] font-mono text-xs font-black">
            CZ
          </div>
          <div className="text-[10px] font-mono">
            <div className="text-white font-semibold">COINZILLA NETWORK</div>
            <div className="text-gray-400">Sponsored Crypto Terminal Partner</div>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#181E18] text-gray-500 border border-[#262E26]">
          SPONSORED
        </span>
      </div>
    );
  }

  if (slot === 'leaderboard') {
    // 728x90 desktop / 320x100 mobile reserved container
    return (
      <div
        className={`w-full max-w-4xl mx-auto my-6 min-h-[96px] bg-[#0c0f0c] border border-[#262E26] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#181E18] border border-[#c5f300]/30 flex items-center justify-center text-[#c5f300] shrink-0 font-mono font-bold text-sm">
            A-ADS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">
                PREMIUM CRYPTO DISPLAY NETWORK
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#181E18] text-[#c5f300] border border-[#c5f300]/30">
                A-ADS / COINZILLA
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-400 mt-0.5">
              Target 100,000+ active Solana &amp; EVM memecoin traders. Non-invasive crypto display.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
            728x90 RESERVED
          </span>
          <a
            href="mailto:ads@degencalc.com"
            className="px-3 py-1.5 rounded-lg bg-[#181E18] hover:bg-[#262E26] border border-[#262E26] text-[11px] font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Advertise Here</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </a>
        </div>
      </div>
    );
  }

  if (slot === 'rectangle') {
    // 300x250 medium rectangle reserved container
    return (
      <div
        className={`w-full min-h-[250px] bg-[#0c0f0c] border border-[#262E26] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            SPONSORED (300x250)
          </span>
          <span className="text-[9px] font-mono text-[#c5f300] bg-[#c5f300]/10 px-1 rounded">
            CRYPTO ADS
          </span>
        </div>

        <div className="my-auto text-center py-4">
          <div className="w-10 h-10 rounded-full bg-[#181E18] border border-[#c5f300]/40 mx-auto flex items-center justify-center text-[#c5f300] mb-2 font-mono font-bold">
            ⚡
          </div>
          <h4 className="text-sm font-mono font-bold text-white mb-1">
            Coinzilla &amp; A-ADS Crypto Slot
          </h4>
          <p className="text-xs font-mono text-gray-400">
            Automated crypto ad slot serving high CPM Web3 campaigns. Zero CLS layout reserved.
          </p>
        </div>

        <div className="text-center pt-2 border-t border-[#262E26]">
          <span className="text-[10px] font-mono text-gray-500">
            Ad slot verified via /ads.txt
          </span>
        </div>
      </div>
    );
  }

  // in-content slot for guide
  return (
    <div className="my-8 p-4 bg-[#0c0f0c] border border-[#262E26] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono min-h-[80px]">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#c5f300] shrink-0" />
        <div>
          <span className="text-white font-bold block">
            DEX TRADING TERMINAL AD PARTNER
          </span>
          <span className="text-gray-400 text-[11px]">
            Lightning-fast routing on Solana with zero platform lag.
          </span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-gray-500 border border-[#262E26] px-2 py-1 rounded uppercase">
        Sponsored Listing
      </span>
    </div>
  );
};
