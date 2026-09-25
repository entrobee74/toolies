/**
 * FREE TOOLS SUITE — Multi-Tool Platform
 * Tool 1: PIXELTEXT — AI Image Text Editor (Edit or replace text in any image)
 * Tool 2: DEGENCALC — Memecoin Profit & Fee Calculator
 */

import React, { useState, useEffect, useMemo } from 'react';
import { GlobalToolBar, ActiveTool } from './components/common/GlobalToolBar';
import { PixelTextView } from './components/pixeltext/PixelTextView';
import { Header } from './components/Header';
import { TokenLookup } from './components/TokenLookup';
import { PositionCalculator } from './components/PositionCalculator';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BreakEvenPanel } from './components/BreakEvenPanel';
import { PriceImpactEstimator } from './components/PriceImpactEstimator';
import { FeeStack } from './components/FeeStack';
import { ScenarioTable } from './components/ScenarioTable';
import { ShareCardModal } from './components/ShareCardModal';
import { AdPlacement } from './components/AdPlacement';
import { AAdsUnit } from './components/AAdsUnit';
import { SeoPageHeader, TraderGuideArticle, FaqSection } from './components/SeoPages';
import { Footer } from './components/Footer';
import { CalculatorInputs, CalculationResult, TokenMetadata } from './types/calculator';
import { calculatePosition } from './utils/math';

const ACTIVE_TOOL_KEY = 'free_tools_active_tool_v1';
const DEGEN_STORAGE_KEY = 'degencalc_inputs_v1';

const DEFAULT_DEGEN_INPUTS: CalculatorInputs = {
  currency: 'USD',
  nativePriceUsd: 150, // SOL price baseline
  investmentAmount: 1000,
  isInvestmentInNative: false,
  mode: 'PRICE',
  entryPrice: 0.00042,
  entryMcap: 420000,
  exitPrice: 0.0042, // 10x default target
  exitMcap: 4200000,
  tokenSupply: 1000000000,
  fees: {
    platformFeePct: 1.0,
    slippagePct: 1.0,
    buyTaxPct: 0.0,
    sellTaxPct: 0.0,
    gasFeeUsd: 0.75, // ~0.005 SOL
    gasFeeNative: 0.005,
    enabled: {
      platformFee: true,
      slippage: true,
      taxes: false,
      gasFee: true,
    },
  },
  tokenMeta: {
    name: 'Bonk',
    symbol: 'BONK',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    network: 'solana',
    priceUsd: 0.000021,
    priceNative: 0.00000014,
    fdv: 1470000000,
    marketCap: 1470000000,
    liquidityUsd: 28000000,
    volume24h: 350000000,
    priceChange24h: 4.8,
    pairAddress: '',
    dexId: 'raydium',
    fetchedAt: Date.now() - 32000,
  },
};

export default function App() {
  // Active Tool state (PixelText vs DegenCalc)
  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_TOOL_KEY);
      if (saved === 'degencalc' || saved === 'pixeltext') return saved;
    } catch (e) {
      // ignore
    }
    return 'pixeltext'; // Default to the newly added PixelText tool
  });

  const handleSelectTool = (tool: ActiveTool) => {
    setActiveTool(tool);
    try {
      localStorage.setItem(ACTIVE_TOOL_KEY, tool);
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- DegenCalc state ---
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem(DEGEN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DEGEN_INPUTS,
          ...parsed,
          fees: {
            ...DEFAULT_DEGEN_INPUTS.fees,
            ...(parsed.fees || {}),
            enabled: {
              ...DEFAULT_DEGEN_INPUTS.fees.enabled,
              ...(parsed.fees?.enabled || {}),
            },
          },
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return DEFAULT_DEGEN_INPUTS;
  });

  const [currentDegenTab, setCurrentDegenTab] = useState<string>('calculator');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DEGEN_STORAGE_KEY, JSON.stringify(inputs));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [inputs]);

  const result: CalculationResult = useMemo(() => {
    return calculatePosition(inputs);
  }, [inputs]);

  const handleTokenSelected = (token: TokenMetadata) => {
    const supply = token.marketCap > 0 && token.priceUsd > 0
      ? Math.round(token.marketCap / token.priceUsd)
      : inputs.tokenSupply;

    setInputs((prev) => ({
      ...prev,
      tokenMeta: token,
      entryPrice: token.priceUsd,
      entryMcap: token.marketCap,
      exitPrice: token.priceUsd * 5,
      exitMcap: token.marketCap * 5,
      tokenSupply: supply > 0 ? supply : 1000000000,
    }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_DEGEN_INPUTS);
  };

  const handleApplyScenarioAsExit = (targetPrice: number, targetMcap: number) => {
    setInputs((prev) => ({
      ...prev,
      exitPrice: targetPrice,
      exitMcap: targetMcap,
    }));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#00DDCB] selection:text-black">
      {/* 1. Global Multi-Tool Bar & Expandable Sidebar Drawer */}
      <GlobalToolBar
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
      />

      {/* 2. Tool Content Switcher */}
      {activeTool === 'pixeltext' ? (
        /* PIXELTEXT SUITE */
        <div className="flex-1 flex flex-col">
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-8">
            <PixelTextView />
          </main>

          {/* Sticky Mobile Ad Banner */}
          <AdPlacement slot="sticky-mobile" />

          {/* Unified Compliance Footer */}
          <footer className="border-t border-[#2A2A2A] bg-[#0c0c0c] text-gray-500 font-inter text-xs pt-12 pb-20 sm:pb-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#2A2A2A]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-space font-extrabold text-base text-white tracking-tight">
                      PIXEL<span className="text-[#00DDCB]">TEXT</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00DDCB]/10 text-[#00DDCB] border border-[#00DDCB]/30">
                      FREE UTILITY
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    Free AI-powered in-image text replacement engine. Preserves font styles, angles, perspective, and backgrounds with zero sign-up.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[10px] text-[#00DDCB]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00DDCB]" />
                    In-Memory Processing • No Image Storage
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-white mb-3">
                    Free Web Tools
                  </h4>
                  <ul className="space-y-2 text-[11px]">
                    <li>
                      <button onClick={() => handleSelectTool('pixeltext')} className="text-[#00DDCB] hover:underline">
                        PixelText — AI Image Text Editor
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleSelectTool('degencalc')} className="hover:text-white transition-colors">
                        DegenCalc — Memecoin Profit Calculator
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-white mb-3">
                    Popular Guides
                  </h4>
                  <ul className="space-y-2 text-[11px]">
                    <li>
                      <span className="hover:text-white transition-colors cursor-pointer">
                        How to edit text on product photos
                      </span>
                    </li>
                    <li>
                      <span className="hover:text-white transition-colors cursor-pointer">
                        Replacing storefront signage with AI
                      </span>
                    </li>
                    <li>
                      <span className="hover:text-white transition-colors cursor-pointer">
                        Meme caption swap tips
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-space font-bold uppercase tracking-wider text-white mb-3">
                    Verified Ads &amp; Privacy
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    Supported by Google AdSense (pub-3344865492847998) &amp; Coinzilla display ads.
                  </p>
                  <div className="flex flex-col gap-1 text-[11px]">
                    <a href="/ads.txt" target="_blank" rel="noreferrer" className="text-[#00DDCB] hover:underline">
                      View /ads.txt
                    </a>
                    <span className="text-gray-500">Contact: support@pixeltext.io</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
                <div>© {new Date().getFullYear()} PixelText. Free browser-based AI text editor.</div>
                <div>Processed locally &amp; in-memory. Zero images stored or logged.</div>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* DEGENCALC SUITE */
        <div className="flex-1 flex flex-col">
          <Header
            currentTab={currentDegenTab}
            onSelectTab={setCurrentDegenTab}
            onOpenShare={() => setIsShareModalOpen(true)}
            onReset={handleReset}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
            <SeoPageHeader currentTab={currentDegenTab} onSelectTab={setCurrentDegenTab} />

            {currentDegenTab === 'guide' && (
              <TraderGuideArticle onGoToCalculator={() => setCurrentDegenTab('calculator')} />
            )}

            {currentDegenTab === 'faq' && <FaqSection />}

            {currentDegenTab !== 'guide' && currentDegenTab !== 'faq' && (
              <>
                <TokenLookup
                  onTokenSelected={handleTokenSelected}
                  currentToken={inputs.tokenMeta}
                />
                <PositionCalculator
                  inputs={inputs}
                  onChange={setInputs}
                  tokensReceived={result.tokensReceived}
                />
                <BreakEvenPanel result={result} fees={inputs.fees} />
                <ResultsDashboard
                  result={result}
                  inputs={inputs}
                  onOpenShareCard={() => setIsShareModalOpen(true)}
                />
                <PriceImpactEstimator
                  tradeSizeUsd={result.investedUsd}
                  liquidityUsd={result.liquidityUsd || 0}
                  priceImpactPct={result.priceImpactPct}
                />
                <FeeStack
                  fees={inputs.fees}
                  onChange={(fees) => setInputs((prev) => ({ ...prev, fees }))}
                  currency={inputs.currency}
                  nativePriceUsd={inputs.nativePriceUsd}
                />
                <ScenarioTable
                  scenarios={result.scenarios}
                  inputs={inputs}
                  onApplyScenarioAsExit={handleApplyScenarioAsExit}
                />
                <AAdsUnit />
                <AdPlacement slot="leaderboard" />
              </>
            )}
          </main>

          <ShareCardModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            inputs={inputs}
            result={result}
          />

          <AdPlacement slot="sticky-mobile" />
          <Footer onSelectTab={setCurrentDegenTab} />
        </div>
      )}
    </div>
  );
}
