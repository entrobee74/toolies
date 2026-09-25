/**
 * DEGENCALC — Fee Stack Configuration Component
 * Toggleable fee inputs with sensible defaults for memecoin trading
 */

import React from 'react';
import { SlidersHorizontal, Check, Fuel, Percent, DollarSign, Layers } from 'lucide-react';
import { FeeStackConfig, CurrencyType } from '../types/calculator';

interface FeeStackProps {
  fees: FeeStackConfig;
  onChange: (fees: FeeStackConfig) => void;
  currency: CurrencyType;
  nativePriceUsd: number;
}

export const FeeStack: React.FC<FeeStackProps> = ({
  fees,
  onChange,
  currency,
  nativePriceUsd,
}) => {
  const toggleFee = (key: keyof FeeStackConfig['enabled']) => {
    onChange({
      ...fees,
      enabled: {
        ...fees.enabled,
        [key]: !fees.enabled[key],
      },
    });
  };

  const updateFeeValue = (field: keyof Omit<FeeStackConfig, 'enabled'>, val: number) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    let updated = { ...fees, [field]: num };

    // Keep gas fee synced between USD and native
    if (field === 'gasFeeNative' && nativePriceUsd > 0) {
      updated.gasFeeUsd = num * nativePriceUsd;
    } else if (field === 'gasFeeUsd' && nativePriceUsd > 0) {
      updated.gasFeeNative = num / nativePriceUsd;
    }

    onChange(updated);
  };

  // Quick preset buttons (Solana Pump.fun vs Uniswap EVM vs Zero Fees)
  const applyPreset = (preset: 'solana' | 'evm' | 'taxed' | 'zero') => {
    if (preset === 'solana') {
      onChange({
        platformFeePct: 1.0,
        slippagePct: 1.5,
        buyTaxPct: 0,
        sellTaxPct: 0,
        gasFeeUsd: 0.005 * (nativePriceUsd || 150),
        gasFeeNative: 0.005,
        enabled: { platformFee: true, slippage: true, taxes: false, gasFee: true },
      });
    } else if (preset === 'evm') {
      onChange({
        platformFeePct: 0.3,
        slippagePct: 1.0,
        buyTaxPct: 0,
        sellTaxPct: 0,
        gasFeeUsd: 3.50,
        gasFeeNative: 0.001,
        enabled: { platformFee: true, slippage: true, taxes: false, gasFee: true },
      });
    } else if (preset === 'taxed') {
      onChange({
        platformFeePct: 1.0,
        slippagePct: 2.0,
        buyTaxPct: 5.0,
        sellTaxPct: 5.0,
        gasFeeUsd: 1.0,
        gasFeeNative: 0.006,
        enabled: { platformFee: true, slippage: true, taxes: true, gasFee: true },
      });
    } else if (preset === 'zero') {
      onChange({
        ...fees,
        enabled: { platformFee: false, slippage: false, taxes: false, gasFee: false },
      });
    }
  };

  return (
    <div className="bg-[#181E18] border border-[#262E26] rounded-xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#c5f300]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
            FEE STACK (TOGGLEABLE)
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-gray-500 mr-1">Presets:</span>
          <button
            onClick={() => applyPreset('solana')}
            className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] text-gray-300 hover:text-[#c5f300] border border-[#262E26]"
          >
            Solana/Pump
          </button>
          <button
            onClick={() => applyPreset('evm')}
            className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] text-gray-300 hover:text-[#c5f300] border border-[#262E26]"
          >
            Uniswap/EVM
          </button>
          <button
            onClick={() => applyPreset('taxed')}
            className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] text-[#ffb4ab] border border-red-950 hover:border-red-900"
          >
            5/5 Tax
          </button>
          <button
            onClick={() => applyPreset('zero')}
            className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] text-gray-500 hover:text-white border border-[#262E26]"
          >
            Zero Fees
          </button>
        </div>
      </div>

      {/* Grid of fee inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {/* 1. Platform Fee */}
        <div
          className={`p-3 rounded-lg border transition-colors ${
            fees.enabled.platformFee
              ? 'bg-[#0c0f0c] border-[#384638]'
              : 'bg-[#0c0f0c]/40 border-[#262E26] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fees.enabled.platformFee}
                onChange={() => toggleFee('platformFee')}
                className="w-3.5 h-3.5 accent-[#c5f300] rounded"
              />
              Platform Fee
            </label>
            <span className="text-[10px] text-gray-500">Raydium/Trojan</span>
          </div>

          <div className="flex items-center gap-1 bg-[#181E18] px-2.5 py-1.5 rounded border border-[#262E26] focus-within:border-[#c5f300]">
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              disabled={!fees.enabled.platformFee}
              value={fees.platformFeePct}
              onChange={(e) => updateFeeValue('platformFeePct', parseFloat(e.target.value))}
              className="w-full bg-transparent text-white font-mono text-sm focus:outline-none disabled:text-gray-600"
            />
            <span className="text-gray-400 font-bold">%</span>
          </div>
        </div>

        {/* 2. Slippage Tolerance */}
        <div
          className={`p-3 rounded-lg border transition-colors ${
            fees.enabled.slippage
              ? 'bg-[#0c0f0c] border-[#384638]'
              : 'bg-[#0c0f0c]/40 border-[#262E26] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fees.enabled.slippage}
                onChange={() => toggleFee('slippage')}
                className="w-3.5 h-3.5 accent-[#c5f300] rounded"
              />
              Slippage Tol.
            </label>
            <span className="text-[10px] text-gray-500">Execution drift</span>
          </div>

          <div className="flex items-center gap-1 bg-[#181E18] px-2.5 py-1.5 rounded border border-[#262E26] focus-within:border-[#c5f300]">
            <input
              type="number"
              step="0.5"
              min="0"
              max="50"
              disabled={!fees.enabled.slippage}
              value={fees.slippagePct}
              onChange={(e) => updateFeeValue('slippagePct', parseFloat(e.target.value))}
              className="w-full bg-transparent text-white font-mono text-sm focus:outline-none disabled:text-gray-600"
            />
            <span className="text-gray-400 font-bold">%</span>
          </div>
        </div>

        {/* 3. Token Taxes */}
        <div
          className={`p-3 rounded-lg border transition-colors ${
            fees.enabled.taxes
              ? 'bg-[#0c0f0c] border-red-950/80'
              : 'bg-[#0c0f0c]/40 border-[#262E26] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fees.enabled.taxes}
                onChange={() => toggleFee('taxes')}
                className="w-3.5 h-3.5 accent-[#ff4d4d] rounded"
              />
              Taxes (Buy/Sell)
            </label>
            <span className="text-[10px] text-red-400">Token Tax</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1 bg-[#181E18] px-2 py-1.5 rounded border border-[#262E26] focus-within:border-[#ff4d4d]">
              <span className="text-[9px] text-gray-500">B:</span>
              <input
                type="number"
                step="1"
                min="0"
                max="50"
                disabled={!fees.enabled.taxes}
                value={fees.buyTaxPct}
                onChange={(e) => updateFeeValue('buyTaxPct', parseFloat(e.target.value))}
                className="w-full bg-transparent text-white font-mono text-xs focus:outline-none disabled:text-gray-600"
              />
              <span className="text-gray-400 text-xs">%</span>
            </div>
            <div className="flex items-center gap-1 bg-[#181E18] px-2 py-1.5 rounded border border-[#262E26] focus-within:border-[#ff4d4d]">
              <span className="text-[9px] text-gray-500">S:</span>
              <input
                type="number"
                step="1"
                min="0"
                max="50"
                disabled={!fees.enabled.taxes}
                value={fees.sellTaxPct}
                onChange={(e) => updateFeeValue('sellTaxPct', parseFloat(e.target.value))}
                className="w-full bg-transparent text-white font-mono text-xs focus:outline-none disabled:text-gray-600"
              />
              <span className="text-gray-400 text-xs">%</span>
            </div>
          </div>
        </div>

        {/* 4. Gas Estimate */}
        <div
          className={`p-3 rounded-lg border transition-colors ${
            fees.enabled.gasFee
              ? 'bg-[#0c0f0c] border-[#384638]'
              : 'bg-[#0c0f0c]/40 border-[#262E26] opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fees.enabled.gasFee}
                onChange={() => toggleFee('gasFee')}
                className="w-3.5 h-3.5 accent-[#c5f300] rounded"
              />
              Gas / Priority
            </label>
            <span className="text-[10px] text-gray-500">Per trade</span>
          </div>

          <div className="flex items-center gap-1 bg-[#181E18] px-2.5 py-1.5 rounded border border-[#262E26] focus-within:border-[#c5f300]">
            <span className="text-gray-500 font-mono text-xs">$</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              disabled={!fees.enabled.gasFee}
              value={Number(fees.gasFeeUsd.toFixed(3))}
              onChange={(e) => updateFeeValue('gasFeeUsd', parseFloat(e.target.value))}
              className="w-full bg-transparent text-white font-mono text-sm focus:outline-none disabled:text-gray-600"
            />
            <span className="text-[10px] text-gray-500 uppercase">
              {currency === 'SOL' ? 'SOL' : 'USD'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
