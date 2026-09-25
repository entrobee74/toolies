/**
 * DEGENCALC — Memecoin Profit Calculator & Terminal
 * Free browser-based calculator, 100% client-side, zero backend, zero API keys.
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { SeoPageHeader, TraderGuideArticle, FaqSection } from './components/SeoPages';
import { Footer } from './components/Footer';
import { CalculatorInputs, CalculationResult, TokenMetadata } from './types/calculator';
import { calculatePosition } from './utils/math';

const LOCAL_STORAGE_KEY = 'degencalc_inputs_v1';

const DEFAULT_INPUTS: CalculatorInputs = {
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
  // Load saved inputs from localStorage or defaults
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_INPUTS,
          ...parsed,
          fees: {
            ...DEFAULT_INPUTS.fees,
            ...(parsed.fees || {}),
            enabled: {
              ...DEFAULT_INPUTS.fees.enabled,
              ...(parsed.fees?.enabled || {}),
            },
          },
        };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return DEFAULT_INPUTS;
  });

  const [currentTab, setCurrentTab] = useState<string>('calculator');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inputs));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [inputs]);

  // Synchronous, pure live calculation on every render/state change
  const result: CalculationResult = useMemo(() => {
    return calculatePosition(inputs);
  }, [inputs]);

  // When a token is selected from lookup or popular preset
  const handleTokenSelected = (token: TokenMetadata) => {
    const supply = token.marketCap > 0 && token.priceUsd > 0
      ? Math.round(token.marketCap / token.priceUsd)
      : inputs.tokenSupply;

    setInputs((prev) => ({
      ...prev,
      tokenMeta: token,
      entryPrice: token.priceUsd,
      entryMcap: token.marketCap,
      // Target a 5x moonshot exit by default
      exitPrice: token.priceUsd * 5,
      exitMcap: token.marketCap * 5,
      tokenSupply: supply > 0 ? supply : 1000000000,
    }));
  };

  // Reset to default clean state
  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
  };

  // 1-Tap set scenario as exit target
  const handleApplyScenarioAsExit = (targetPrice: number, targetMcap: number) => {
    setInputs((prev) => ({
      ...prev,
      exitPrice: targetPrice,
      exitMcap: targetMcap,
    }));
  };

  // Tab routing support
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#111411] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#c5f300] selection:text-black">
      {/* Terminal Top Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenShare={() => setIsShareModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
        {/* Dynamic SEO Title & Intro */}
        <SeoPageHeader currentTab={currentTab} onSelectTab={handleTabChange} />

        {/* If Guide Tab */}
        {currentTab === 'guide' && (
          <TraderGuideArticle onGoToCalculator={() => handleTabChange('calculator')} />
        )}

        {/* If FAQ Tab */}
        {currentTab === 'faq' && (
          <FaqSection />
        )}

        {/* Core Terminal Components (Rendered on calculator, price-impact, and solana tabs) */}
        {currentTab !== 'guide' && currentTab !== 'faq' && (
          <>
            {/* 1. DexScreener Live Token Lookup */}
            <TokenLookup
              onTokenSelected={handleTokenSelected}
              currentToken={inputs.tokenMeta}
            />

            {/* 2. Position Inputs */}
            <PositionCalculator
              inputs={inputs}
              onChange={setInputs}
              tokensReceived={result.tokensReceived}
            />

            {/* 3. Aha-Moment Break-Even Panel (Prominent) */}
            <BreakEvenPanel result={result} fees={inputs.fees} />

            {/* 4. Live Results Dashboard */}
            <ResultsDashboard
              result={result}
              inputs={inputs}
              onOpenShareCard={() => setIsShareModalOpen(true)}
            />

            {/* 5. Price Impact Estimator */}
            <PriceImpactEstimator
              tradeSizeUsd={result.investedUsd}
              liquidityUsd={result.liquidityUsd || 0}
              priceImpactPct={result.priceImpactPct}
            />

            {/* 6. Toggleable Fee Stack */}
            <FeeStack
              fees={inputs.fees}
              onChange={(fees) => setInputs((prev) => ({ ...prev, fees }))}
              currency={inputs.currency}
              nativePriceUsd={inputs.nativePriceUsd}
            />

            {/* 7. Scenario Matrix (2x, 5x, 10x, 50x, 100x) */}
            <ScenarioTable
              scenarios={result.scenarios}
              inputs={inputs}
              onApplyScenarioAsExit={handleApplyScenarioAsExit}
            />

            {/* Coinzilla / A-ADS Leaderboard Display Slot */}
            <AdPlacement slot="leaderboard" />
          </>
        )}
      </main>

      {/* Share Card Modal (1080x1350 Canvas PNG render) */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        inputs={inputs}
        result={result}
      />

      {/* Sticky Mobile Ad Banner (Coinzilla / A-ADS unit with layout guard) */}
      <AdPlacement slot="sticky-mobile" />

      {/* Comprehensive Terminal Footer */}
      <Footer onSelectTab={handleTabChange} />
    </div>
  );
}
