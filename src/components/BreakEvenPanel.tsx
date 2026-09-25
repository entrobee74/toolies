/**
 * DEGENCALC — Break-Even Panel (The Aha-Moment Feature)
 * Shows the exact multiple and price needed to cover the entire fee & tax stack.
 */

import React from 'react';
import { Target, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CalculationResult, FeeStackConfig } from '../types/calculator';
import { formatCompactCurrency, formatTokenPrice } from '../utils/math';

interface BreakEvenPanelProps {
  result: CalculationResult;
  fees: FeeStackConfig;
}

export const BreakEvenPanel: React.FC<BreakEvenPanelProps> = ({ result, fees }) => {
  const multipleFormatted = result.breakEvenMultiple.toFixed(2);
  const percentageMove = ((result.breakEvenMultiple - 1) * 100).toFixed(1);
  const isHighToll = result.breakEvenMultiple >= 1.15;

  return (
    <div className="bg-[#0c0f0c] border border-[#c5f300]/50 rounded-xl p-4 sm:p-5 relative overflow-hidden lime-glow-sm">
      {/* Background neon accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5f300]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Main Aha Callout */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#c5f300]/10 text-[#c5f300]">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#c5f300]">
              THE BREAK-EVEN METRIC
            </span>
            {isHighToll && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-[#ff4d4d] border border-red-800">
                <AlertTriangle className="w-3 h-3" /> HIGH FEE LOAD
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            You need a{' '}
            <span className="text-[#c5f300] font-mono font-extrabold text-2xl sm:text-3xl px-1">
              {multipleFormatted}x
            </span>{' '}
            move (+{percentageMove}%) just to break even
          </h3>

          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            Exit target must reach{' '}
            <span className="text-white font-semibold">
              {formatTokenPrice(result.breakEvenPrice)}
            </span>{' '}
            or{' '}
            <span className="text-white font-semibold">
              {formatCompactCurrency(result.breakEvenMcap)}
            </span>{' '}
            MCap to cover total fee toll (-${result.totalFeesUsd.toFixed(2)}).
          </p>
        </div>

        {/* Quick Fee Friction Breakdown pills */}
        <div className="w-full md:w-auto flex flex-wrap md:flex-col gap-1.5 text-[11px] font-mono bg-[#181E18] p-2.5 rounded-lg border border-[#262E26] shrink-0">
          <div className="flex items-center justify-between gap-4 text-gray-400">
            <span>DEX Fee (Buy+Sell):</span>
            <span className="text-white font-bold">
              ${result.breakdownFees.platformFeeUsd.toFixed(2)} ({fees.platformFeePct * 2}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-gray-400">
            <span>Est. Slippage:</span>
            <span className="text-white font-bold">
              ${result.breakdownFees.slippageCostUsd.toFixed(2)} ({fees.slippagePct}%)
            </span>
          </div>

          {(fees.buyTaxPct > 0 || fees.sellTaxPct > 0) && (
            <div className="flex items-center justify-between gap-4 text-gray-400">
              <span className="text-[#ffb4ab]">Memecoin Taxes:</span>
              <span className="text-[#ff4d4d] font-bold">
                ${(result.breakdownFees.buyTaxUsd + result.breakdownFees.sellTaxUsd).toFixed(2)} ({fees.buyTaxPct + fees.sellTaxPct}%)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 text-gray-400 border-t border-[#262E26] pt-1">
            <span>Roundtrip Gas:</span>
            <span className="text-[#c5f300] font-bold">
              ${result.breakdownFees.gasFeeUsd.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
