/**
 * DEGENCALC — Ad Placements
 * Crypto & Google AdSense Display Network Units
 * Configured with Google AdSense: pub-3344865492847998
 * Built with reserved slot heights to eliminate CLS (Cumulative Layout Shift).
 */

import React, { useEffect, useRef } from 'react';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

interface AdPlacementProps {
  slot: 'leaderboard' | 'rectangle' | 'sticky-mobile' | 'in-content';
  className?: string;
  adSlotId?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ slot, className = '', adSlotId }) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      }
    } catch (e) {
      // Ignore if AdSense script is blocking or pending approval
    }
  }, []);

  if (slot === 'sticky-mobile') {
    return (
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0c0f0c] border-t border-[#262E26] h-[60px] flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#181E18] border border-[#c5f300]/40 flex items-center justify-center text-[#c5f300] font-mono text-xs font-black">
            AD
          </div>
          <div className="text-[10px] font-mono">
            <div className="text-white font-semibold">GOOGLE &amp; CRYPTO NETWORK</div>
            <div className="text-gray-400">pub-3344865492847998</div>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#181E18] text-gray-400 border border-[#262E26]">
          SPONSORED
        </span>
      </div>
    );
  }

  if (slot === 'leaderboard') {
    // 728x90 desktop / 320x100 mobile reserved container
    return (
      <div
        className={`w-full max-w-4xl mx-auto my-6 min-h-[100px] bg-[#0c0f0c] border border-[#262E26] rounded-xl p-3 flex flex-col justify-center relative overflow-hidden ${className}`}
      >
        {/* Google AdSense container */}
        <div className="w-full flex flex-col items-center justify-center min-h-[90px]">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', minHeight: '90px', width: '100%', textAlign: 'center' }}
            data-ad-client="ca-pub-3344865492847998"
            data-ad-slot={adSlotId || 'default'}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />

          {/* Fallback & placeholder frame so container never collapses */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#181E18] border border-[#c5f300]/30 flex items-center justify-center text-[#c5f300] shrink-0 font-mono font-bold text-xs">
                ADS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    GOOGLE ADSENSE &amp; CRYPTO DISPLAY
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#181E18] text-[#c5f300] border border-[#c5f300]/30">
                    pub-3344865492847998
                  </span>
                </div>
                <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                  Verified publisher ad unit • 728x90 leaderboard slot reserved with zero CLS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
                RESERVED
              </span>
              <a
                href="/ads.txt"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-[#181E18] hover:bg-[#262E26] border border-[#262E26] text-[10px] font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>ads.txt</span>
                <ExternalLink className="w-2.5 h-2.5 text-gray-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slot === 'rectangle') {
    // 300x250 medium rectangle reserved container
    return (
      <div
        className={`w-full min-h-[260px] bg-[#0c0f0c] border border-[#262E26] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            SPONSORED (300x250)
          </span>
          <span className="text-[9px] font-mono text-[#c5f300] bg-[#c5f300]/10 px-1 rounded">
            GOOGLE ADSENSE
          </span>
        </div>

        <div className="my-auto text-center py-2 flex flex-col items-center justify-center min-h-[200px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '300px', height: '250px' }}
            data-ad-client="ca-pub-3344865492847998"
            data-ad-slot={adSlotId || 'default'}
          />
          <div className="mt-2 text-xs font-mono text-gray-400">
            Publisher: pub-3344865492847998
          </div>
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
    <div className="my-8 p-4 bg-[#0c0f0c] border border-[#262E26] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono min-h-[90px]">
      <div className="w-full">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-3344865492847998"
          data-ad-slot={adSlotId || 'default'}
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262E26]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c5f300] shrink-0" />
            <span className="text-white font-bold">
              GOOGLE ADSENSE IN-ARTICLE DISPLAY
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500 border border-[#262E26] px-2 py-0.5 rounded uppercase">
            pub-3344865492847998
          </span>
        </div>
      </div>
    </div>
  );
};
