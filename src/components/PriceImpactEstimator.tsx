/**
 * DEGENCALC — Price Impact Estimator
 * Computes trade size impact against pool liquidity with colored meter
 */

import React from 'react';
import { Gauge, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { formatCompactCurrency } from '../utils/math';

interface PriceImpactEstimatorProps {
  tradeSizeUsd: number;
  liquidityUsd: number;
  priceImpactPct: number;
}

export const PriceImpactEstimator: React.FC<PriceImpactEstimatorProps> = ({
  tradeSizeUsd,
  liquidityUsd,
  priceImpactPct,
}) => {
  // Meter states: green <2%, amber 2-5%, red >5%
  const isGreen = priceImpactPct < 2;
  const isAmber = priceImpactPct >= 2 && priceImpactPct <= 5;
  const isRed = priceImpactPct > 5;

  const meterColor = isGreen
    ? 'bg-[#c5f300]'
    : isAmber
    ? 'bg-amber-400'
    : 'bg-[#ff4d4d]';

  const textColor = isGreen
    ? 'text-[#c5f300]'
    : isAmber
    ? 'text-amber-400'
    : 'text-[#ff4d4d]';

  const borderColor = isGreen
    ? 'border-[#c5f300]/30'
    : isAmber
    ? 'border-amber-400/40'
    : 'border-[#ff4d4d]/50';

  return (
    <div className={`bg-[#181E18] border ${borderColor} rounded-xl p-4 sm:p-5 transition-all`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Gauge className={`w-4 h-4 ${textColor}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
            PRICE IMPACT ESTIMATOR
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-xs text-gray-400">Estimated Impact:</span>
          <span className={`text-sm sm:text-base font-extrabold ${textColor}`}>
            {priceImpactPct.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Colored Progress Bar */}
      <div className="w-full bg-[#0c0f0c] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#262E26] relative">
        <div
          className={`h-full rounded-full transition-all duration-300 ${meterColor}`}
          style={{ width: `${Math.min(Math.max(priceImpactPct * 10, 2), 100)}%` }}
        />
      </div>

      {/* Scale indicators */}
      <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1.5 px-0.5">
        <span className="text-[#c5f300]">0% (Safe &lt; 2%)</span>
        <span className="text-amber-400">2% - 5% (Moderate)</span>
        <span className="text-[#ff4d4d]">&gt; 5% (High Impact)</span>
      </div>

      {/* Context info & Liquidity Details */}
      <div className="mt-3 pt-3 border-t border-[#262E26] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3 text-gray-400">
          <span>
            Trade Size: <strong className="text-white">${tradeSizeUsd.toFixed(2)}</strong>
          </span>
          <span>•</span>
          <span>
            Pool Liquidity:{' '}
            <strong className="text-white">
              {liquidityUsd > 0 ? formatCompactCurrency(liquidityUsd) : 'Simulated ($50K)'}
            </strong>
          </span>
        </div>

        {/* Warning or OK Status */}
        {isRed && (
          <div className="flex items-center gap-1.5 text-xs text-[#ff4d4d] font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Your exit is limited by liquidity — at this size you&apos;d move the price.</span>
          </div>
        )}

        {isAmber && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <Info className="w-4 h-4 shrink-0" />
            <span>Moderate price slippage expected. Consider staged limit orders.</span>
          </div>
        )}

        {isGreen && (
          <div className="flex items-center gap-1.5 text-xs text-[#c5f300] font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pool depth is adequate for this trade size. Minimal slippage.</span>
          </div>
        )}
      </div>
    </div>
  );
};
