/**
 * DEGENCALC — Results Dashboard
 * Displays core live outputs: exit portfolio value, gross profit, total fees, net profit, and ROI %
 */

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Share2, Sparkles, AlertCircle, Layers } from 'lucide-react';
import { CalculationResult, CalculatorInputs } from '../types/calculator';
import { formatCompactCurrency, formatRoi, formatNumberWithCommas } from '../utils/math';

interface ResultsDashboardProps {
  result: CalculationResult;
  inputs: CalculatorInputs;
  onOpenShareCard: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  inputs,
  onOpenShareCard,
}) => {
  const [flashClass, setFlashClass] = useState('');

  // Flash green or red when outputs change
  useEffect(() => {
    const isProfit = result.netProfitUsd >= 0;
    setFlashClass(isProfit ? 'animate-flash-green' : 'animate-flash-red');
    const timer = setTimeout(() => setFlashClass(''), 400);
    return () => clearTimeout(timer);
  }, [result.netProfitUsd, result.exitPortfolioValueUsd]);

  const isNetProfit = result.netProfitUsd >= 0;
  const isGrossProfit = result.grossProfitUsd >= 0;

  return (
    <div className={`bg-[#181E18] border border-[#262E26] rounded-xl p-4 sm:p-6 transition-all ${flashClass}`}>
      {/* Top Banner / Hero ROI */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#262E26]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              NET ESTIMATED RETURN
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0c0f0c] text-gray-400 border border-[#262E26]">
              AFTER ALL FEES &amp; TAXES
            </span>
          </div>

          <div className="flex items-baseline gap-4 flex-wrap">
            <div
              className={`text-4xl sm:text-6xl font-black font-mono tracking-tight ${
                isNetProfit ? 'text-[#c5f300]' : 'text-[#ff4d4d]'
              }`}
            >
              {formatRoi(result.netRoiPct)}
            </div>

            <div className="flex items-center gap-1.5 text-lg sm:text-2xl font-mono font-bold text-white">
              <span>{isNetProfit ? '+' : ''}{formatCompactCurrency(result.netProfitUsd)}</span>
              <span className="text-xs text-gray-500 font-normal">NET PROFIT</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-mono mt-1">
            From initial capital of {formatCompactCurrency(result.investedUsd)}{' '}
            {inputs.currency !== 'USD' && `(${result.investedNative.toFixed(3)} ${inputs.currency})`}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShareCard}
            className="w-full sm:w-auto px-6 py-3 bg-[#c5f300] hover:bg-[#afd440] text-black font-bold text-sm tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 lime-glow"
          >
            <Share2 className="w-4 h-4" />
            <span>Generate Share Card (1080x1350)</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Metric Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
        {/* Metric 1: Exit Portfolio Value */}
        <div className="bg-[#0c0f0c] p-3 sm:p-4 rounded-xl border border-[#262E26]">
          <span className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase block mb-1">
            EXIT STACK VALUE
          </span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-white">
            {formatCompactCurrency(result.exitPortfolioValueUsd)}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            {formatNumberWithCommas(result.tokensReceived, 0)} tokens
          </span>
        </div>

        {/* Metric 2: Gross Profit */}
        <div className="bg-[#0c0f0c] p-3 sm:p-4 rounded-xl border border-[#262E26]">
          <span className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase block mb-1">
            GROSS PROFIT
          </span>
          <div
            className={`text-lg sm:text-2xl font-bold font-mono ${
              isGrossProfit ? 'text-white' : 'text-[#ff4d4d]'
            }`}
          >
            {isGrossProfit ? '+' : ''}{formatCompactCurrency(result.grossProfitUsd)}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            Before exchange fees
          </span>
        </div>

        {/* Metric 3: Total Friction & Fees */}
        <div className="bg-[#0c0f0c] p-3 sm:p-4 rounded-xl border border-[#262E26]">
          <span className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase block mb-1">
            TOTAL FEES &amp; SLIPPAGE
          </span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-[#ffb4ab]">
            -${result.totalFeesUsd.toFixed(2)}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            DEX + Slippage + Gas
          </span>
        </div>

        {/* Metric 4: Net Multiple */}
        <div className="bg-[#0c0f0c] p-3 sm:p-4 rounded-xl border border-[#262E26]">
          <span className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase block mb-1">
            NET MULTIPLE
          </span>
          <div className="text-lg sm:text-2xl font-bold font-mono text-[#c5f300]">
            {(result.investedUsd > 0
              ? (result.exitPortfolioValueUsd - result.totalFeesUsd) / result.investedUsd
              : 0
            ).toFixed(2)}x
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">
            Net capital multiple
          </span>
        </div>
      </div>
    </div>
  );
};
