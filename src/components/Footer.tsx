/**
 * DEGENCALC — Terminal Footer
 * Mandatory disclaimer: "Estimates only. Not financial advice."
 * Complete internal links and ads.txt reference.
 */

import React from 'react';
import { ShieldAlert, Zap, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-[#262E26] bg-[#0c0f0c] text-gray-500 font-mono text-xs pt-12 pb-20 sm:pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#262E26]">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-[#181E18] border border-[#c5f300]/40 flex items-center justify-center text-[#c5f300] font-black">
                <Zap className="w-4 h-4 fill-[#c5f300]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                DEGEN<span className="text-[#c5f300]">CALC</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              Free, 100% client-side browser terminal for memecoin profit simulation, slippage estimation, and fee break-even analysis.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#181E18] border border-[#262E26] text-[10px] text-[#c5f300]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5f300]"></span>
              Zero Tracking • Zero Wallets
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Calculators &amp; Tools
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectTab('calculator')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  Memecoin Profit Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('price-impact')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  Price Impact &amp; Liquidity Meter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('solana')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  Solana Memecoin PnL Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('calculator')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  Crypto Break-Even Multiple Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Research &amp; Guides
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectTab('guide')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  How to Calculate Memecoin Profits (800w)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  Trading Friction &amp; DEX Fees FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('price-impact')}
                  className="hover:text-[#c5f300] transition-colors"
                >
                  Understanding AMM Pool Slippage
                </button>
              </li>
            </ul>
          </div>

          {/* Advertiser & Compliance Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Monetization &amp; Ads
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
              Monetized via verified crypto display networks (Coinzilla &amp; A-ADS).
            </p>
            <div className="flex flex-col gap-1 text-[11px]">
              <a
                href="/ads.txt"
                target="_blank"
                rel="noreferrer"
                className="text-[#c5f300] hover:underline"
              >
                View /ads.txt
              </a>
              <span className="text-gray-500">Contact: ads@degencalc.com</span>
            </div>
          </div>
        </div>

        {/* Mandatory Hard Rule Disclaimer Box */}
        <div className="bg-[#181E18] border border-[#262E26] rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed text-gray-400 mb-6">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block uppercase tracking-wider mb-0.5">
              Estimates only. Not financial advice.
            </span>
            <p className="text-[11px]">
              All calculation outputs, price impacts, fees, and scenario tables rendered by DEGENCALC are simulated estimations based on mathematical formulas and third-party DexScreener spot price lookups. Cryptocurrency and memecoin investments involve extreme volatility, risk of total loss, smart contract exploits, and execution slippage. Always conduct independent due diligence before committing capital.
            </p>
          </div>
        </div>

        {/* Copyright and Bottom Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} DEGENCALC Terminal. Built for decentralized crypto traders.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by DexScreener Public API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
