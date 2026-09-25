/**
 * DEGENCALC — Scenario Table (2x, 5x, 10x, 50x, 100x)
 * Interactive matrix of moonshot projections with 1-tap exit target application
 */

import React, { useState } from 'react';
import { Rocket, ArrowUpRight, Check, Sliders } from 'lucide-react';
import { ScenarioRow, CalculatorInputs } from '../types/calculator';
import { formatCompactCurrency, formatTokenPrice, formatRoi } from '../utils/math';

interface ScenarioTableProps {
  scenarios: ScenarioRow[];
  inputs: CalculatorInputs;
  onApplyScenarioAsExit: (targetPrice: number, targetMcap: number) => void;
}

export const ScenarioTable: React.FC<ScenarioTableProps> = ({
  scenarios,
  inputs,
  onApplyScenarioAsExit,
}) => {
  const [customMult, setCustomMult] = useState<number>(20);
  const [appliedMultiple, setAppliedMultiple] = useState<number | null>(null);

  const handleApply = (targetPrice: number, targetMcap: number, mult: number) => {
    onApplyScenarioAsExit(targetPrice, targetMcap);
    setAppliedMultiple(mult);
    setTimeout(() => setAppliedMultiple(null), 1500);
  };

  // Custom scenario calculation
  const customTargetPrice = inputs.entryPrice * customMult;
  const customTargetMcap = inputs.entryMcap * customMult;
  const customGross = (inputs.investmentAmount / (inputs.entryPrice || 1)) * customTargetPrice;

  return (
    <div className="bg-[#181E18] border border-[#262E26] rounded-xl p-4 sm:p-5">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[#c5f300]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
            PROJECTION MATRIX &amp; SCENARIO TABLE
          </h2>
        </div>
        <span className="text-[11px] font-mono text-gray-500">
          What your stack is worth at key multiples
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#262E26] text-gray-500 uppercase text-[11px]">
              <th className="py-2.5 px-3">Multiple</th>
              <th className="py-2.5 px-3">Target Price</th>
              <th className="py-2.5 px-3">Market Cap</th>
              <th className="py-2.5 px-3">Stack Value</th>
              <th className="py-2.5 px-3">Net Profit</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262E26]/60">
            {scenarios.map((row) => {
              const isCurrentExit =
                inputs.mode === 'PRICE'
                  ? Math.abs(inputs.exitPrice - row.targetPrice) < 0.000000001
                  : Math.abs(inputs.exitMcap - row.targetMcap) < 1;

              return (
                <tr
                  key={row.multiple}
                  className={`hover:bg-[#0c0f0c]/60 transition-colors ${
                    isCurrentExit ? 'bg-[#c5f300]/5 border-l-2 border-[#c5f300]' : ''
                  }`}
                >
                  {/* Multiple Label */}
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-[#c5f300] text-sm">
                      {row.label}
                    </span>
                  </td>

                  {/* Target Price */}
                  <td className="py-3 px-3 text-white font-medium">
                    {formatTokenPrice(row.targetPrice)}
                  </td>

                  {/* Target Market Cap */}
                  <td className="py-3 px-3 text-gray-300">
                    {formatCompactCurrency(row.targetMcap)}
                  </td>

                  {/* Portfolio Value */}
                  <td className="py-3 px-3 text-white font-bold text-sm">
                    {formatCompactCurrency(row.portfolioValue)}
                  </td>

                  {/* Net Profit */}
                  <td className="py-3 px-3">
                    <span className="text-[#c5f300] font-bold">
                      +{formatCompactCurrency(row.netProfit)}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-1.5">
                      ({formatRoi(row.netRoiPct)})
                    </span>
                  </td>

                  {/* Quick Action Button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleApply(row.targetPrice, row.targetMcap, row.multiple)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                        isCurrentExit
                          ? 'bg-[#c5f300] text-black font-bold'
                          : 'bg-[#0c0f0c] text-gray-400 hover:text-white hover:border-[#c5f300] border border-[#262E26]'
                      }`}
                    >
                      {appliedMultiple === row.multiple ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Set
                        </span>
                      ) : isCurrentExit ? (
                        'Active Target'
                      ) : (
                        'Set Exit'
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Custom Multiple Slider */}
      <div className="mt-4 pt-3 border-t border-[#262E26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono bg-[#0c0f0c] p-3 rounded-lg">
        <div className="flex items-center gap-3">
          <Sliders className="w-4 h-4 text-[#c5f300]" />
          <span className="text-gray-400">Custom Moonshot Multiple:</span>
          <span className="font-extrabold text-[#c5f300] text-sm">{customMult}x</span>
        </div>

        <div className="flex items-center gap-3 flex-1 sm:max-w-md">
          <input
            type="range"
            min="1.5"
            max="250"
            step="0.5"
            value={customMult}
            onChange={(e) => setCustomMult(parseFloat(e.target.value))}
            className="w-full accent-[#c5f300] cursor-pointer"
          />
          <button
            onClick={() => handleApply(customTargetPrice, customTargetMcap, customMult)}
            className="px-3 py-1 bg-[#c5f300] hover:bg-[#afd440] text-black font-bold text-[11px] rounded transition-colors shrink-0"
          >
            Apply {customMult}x
          </button>
        </div>
      </div>
    </div>
  );
};
