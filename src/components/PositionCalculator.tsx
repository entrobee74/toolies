/**
 * DEGENCALC — Position Calculator Inputs
 * Primary input engine with real-time recalculations and unit syncing
 */

import React, { useState } from 'react';
import { Calculator, ArrowRight, Coins, DollarSign, TrendingUp, Layers } from 'lucide-react';
import { CalculatorInputs, CalculationMode, CurrencyType } from '../types/calculator';
import { formatNumberWithCommas, formatTokenPrice, formatCompactCurrency } from '../utils/math';

interface PositionCalculatorProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  tokensReceived: number;
}

export const PositionCalculator: React.FC<PositionCalculatorProps> = ({
  inputs,
  onChange,
  tokensReceived,
}) => {
  const [supplyExpanded, setSupplyExpanded] = useState(false);

  const handleInvestmentChange = (val: number) => {
    onChange({
      ...inputs,
      investmentAmount: isNaN(val) ? 0 : Math.max(0, val),
    });
  };

  const handleCurrencyChange = (currency: CurrencyType) => {
    // If switching currency, update default native price
    let nativePrice = inputs.nativePriceUsd;
    if (currency === 'SOL') nativePrice = 150;
    if (currency === 'ETH') nativePrice = 3200;

    onChange({
      ...inputs,
      currency,
      nativePriceUsd: nativePrice,
      isInvestmentInNative: currency !== 'USD',
    });
  };

  const handleModeChange = (mode: CalculationMode) => {
    onChange({
      ...inputs,
      mode,
    });
  };

  const handleEntryChange = (val: number) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    if (inputs.mode === 'PRICE') {
      onChange({
        ...inputs,
        entryPrice: num,
        entryMcap: num * inputs.tokenSupply,
      });
    } else {
      onChange({
        ...inputs,
        entryMcap: num,
        entryPrice: inputs.tokenSupply > 0 ? num / inputs.tokenSupply : 0,
      });
    }
  };

  const handleExitChange = (val: number) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    if (inputs.mode === 'PRICE') {
      onChange({
        ...inputs,
        exitPrice: num,
        exitMcap: num * inputs.tokenSupply,
      });
    } else {
      onChange({
        ...inputs,
        exitMcap: num,
        exitPrice: inputs.tokenSupply > 0 ? num / inputs.tokenSupply : 0,
      });
    }
  };

  const handleSupplyChange = (val: number) => {
    const supply = isNaN(val) || val <= 0 ? 1_000_000_000 : val;
    // Resync mcap or price based on mode
    if (inputs.mode === 'PRICE') {
      onChange({
        ...inputs,
        tokenSupply: supply,
        entryMcap: inputs.entryPrice * supply,
        exitMcap: inputs.exitPrice * supply,
      });
    } else {
      onChange({
        ...inputs,
        tokenSupply: supply,
        entryPrice: supply > 0 ? inputs.entryMcap / supply : 0,
        exitPrice: supply > 0 ? inputs.exitMcap / supply : 0,
      });
    }
  };

  const applyExitMultiplier = (mult: number) => {
    if (inputs.mode === 'PRICE') {
      const newExit = inputs.entryPrice * mult;
      onChange({
        ...inputs,
        exitPrice: newExit,
        exitMcap: newExit * inputs.tokenSupply,
      });
    } else {
      const newMcap = inputs.entryMcap * mult;
      onChange({
        ...inputs,
        exitMcap: newMcap,
        exitPrice: inputs.tokenSupply > 0 ? newMcap / inputs.tokenSupply : 0,
      });
    }
  };

  return (
    <div className="bg-[#181E18] border border-[#262E26] rounded-xl p-4 sm:p-5">
      {/* Title & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#c5f300]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
            POSITION PARAMETERS
          </h2>
        </div>

        {/* Price vs Market Cap Mode */}
        <div className="flex items-center bg-[#0c0f0c] p-0.5 rounded-lg border border-[#262E26] text-xs font-mono">
          <button
            onClick={() => handleModeChange('PRICE')}
            className={`px-3 py-1 rounded transition-colors ${
              inputs.mode === 'PRICE'
                ? 'bg-[#c5f300] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Token Price ($)
          </button>
          <button
            onClick={() => handleModeChange('MCAP')}
            className={`px-3 py-1 rounded transition-colors ${
              inputs.mode === 'MCAP'
                ? 'bg-[#c5f300] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Market Cap ($)
          </button>
        </div>
      </div>

      {/* Grid of Main Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Buy Investment Amount */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-semibold uppercase text-gray-400">
              Buy Amount
            </label>
            {/* Currency selector */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {(['USD', 'SOL', 'ETH'] as CurrencyType[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => handleCurrencyChange(cur)}
                  className={`px-1.5 py-0.5 rounded ${
                    inputs.currency === cur
                      ? 'bg-[#c5f300] text-black font-bold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center bg-[#0c0f0c] border border-[#262E26] focus-within:border-[#c5f300] rounded-lg px-3 py-2.5 transition-colors">
            <span className="font-mono text-gray-500 mr-2 text-sm">
              {inputs.currency === 'USD' ? '$' : inputs.currency}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={inputs.investmentAmount || ''}
              onChange={(e) => handleInvestmentChange(parseFloat(e.target.value))}
              placeholder="1000"
              className="w-full bg-transparent font-mono text-base sm:text-lg text-white font-bold focus:outline-none placeholder-gray-700"
            />
          </div>

          {/* Quick presets for investment */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {(inputs.currency === 'SOL'
              ? [0.5, 1, 5, 10, 25]
              : inputs.currency === 'ETH'
              ? [0.1, 0.25, 0.5, 1, 2]
              : [100, 250, 500, 1000, 5000]
            ).map((preset) => (
              <button
                key={preset}
                onClick={() => handleInvestmentChange(preset)}
                className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] text-[10px] font-mono text-gray-400 hover:text-[#c5f300] border border-[#262E26]"
              >
                {inputs.currency === 'USD' ? `$${preset}` : `${preset} ${inputs.currency}`}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Entry Price / Market Cap */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-semibold uppercase text-gray-400">
              {inputs.mode === 'PRICE' ? 'Entry Price' : 'Entry Market Cap'}
            </label>
            <span className="text-[10px] font-mono text-gray-500">
              {inputs.mode === 'PRICE'
                ? `MCap: ${formatCompactCurrency(inputs.entryMcap)}`
                : `Price: ${formatTokenPrice(inputs.entryPrice)}`}
            </span>
          </div>

          <div className="relative flex items-center bg-[#0c0f0c] border border-[#262E26] focus-within:border-[#c5f300] rounded-lg px-3 py-2.5 transition-colors">
            <span className="font-mono text-gray-500 mr-2 text-sm">$</span>
            <input
              type="number"
              step="any"
              min="0"
              value={
                inputs.mode === 'PRICE'
                  ? inputs.entryPrice || ''
                  : inputs.entryMcap || ''
              }
              onChange={(e) => handleEntryChange(parseFloat(e.target.value))}
              placeholder={inputs.mode === 'PRICE' ? '0.00042' : '1000000'}
              className="w-full bg-transparent font-mono text-base sm:text-lg text-white font-bold focus:outline-none placeholder-gray-700"
            />
          </div>

          {/* Quick presets for entry */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {inputs.mode === 'MCAP' ? (
              [
                { label: '$100K', val: 100_000 },
                { label: '$500K', val: 500_000 },
                { label: '$1M', val: 1_000_000 },
                { label: '$5M', val: 5_000_000 },
                { label: '$20M', val: 20_000_000 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleEntryChange(p.val)}
                  className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] text-[10px] font-mono text-gray-400 hover:text-[#c5f300] border border-[#262E26]"
                >
                  {p.label}
                </button>
              ))
            ) : (
              <span className="text-[10px] font-mono text-gray-500">
                Pasted token address auto-fills this
              </span>
            )}
          </div>
        </div>

        {/* 3. Exit Price / Target Market Cap */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-semibold uppercase text-[#c5f300]">
              {inputs.mode === 'PRICE' ? 'Exit Price Target' : 'Exit Market Cap Target'}
            </label>
            <span className="text-[10px] font-mono text-gray-500">
              {inputs.mode === 'PRICE'
                ? `MCap: ${formatCompactCurrency(inputs.exitMcap)}`
                : `Price: ${formatTokenPrice(inputs.exitPrice)}`}
            </span>
          </div>

          <div className="relative flex items-center bg-[#0c0f0c] border border-[#c5f300]/60 focus-within:border-[#c5f300] rounded-lg px-3 py-2.5 transition-colors lime-glow-sm">
            <span className="font-mono text-[#c5f300] mr-2 text-sm">$</span>
            <input
              type="number"
              step="any"
              min="0"
              value={
                inputs.mode === 'PRICE'
                  ? inputs.exitPrice || ''
                  : inputs.exitMcap || ''
              }
              onChange={(e) => handleExitChange(parseFloat(e.target.value))}
              placeholder={inputs.mode === 'PRICE' ? '0.0021' : '5000000'}
              className="w-full bg-transparent font-mono text-base sm:text-lg text-[#c5f300] font-bold focus:outline-none placeholder-gray-700"
            />
          </div>

          {/* Quick Multiple Fast Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            {[2, 5, 10, 25, 50, 100].map((mult) => (
              <button
                key={mult}
                onClick={() => applyExitMultiplier(mult)}
                className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#c5f300] hover:text-black text-[10px] font-mono font-bold text-gray-300 border border-[#262E26] transition-colors"
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tokens Received Live Metric & Token Supply Setting */}
      <div className="mt-4 pt-3 border-t border-[#262E26] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-[#c5f300]" />
          <span className="text-gray-400">Tokens Received (Net of Buy Fees):</span>
          <span className="text-white font-bold text-sm bg-[#0c0f0c] px-2 py-0.5 rounded border border-[#262E26]">
            {formatNumberWithCommas(tokensReceived, 0)} {inputs.tokenMeta?.symbol || 'TOKENS'}
          </span>
        </div>

        {/* Token supply toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSupplyExpanded(!supplyExpanded)}
            className="text-[11px] text-gray-400 hover:text-white underline decoration-dotted"
          >
            {supplyExpanded ? 'Hide Token Supply' : `Supply: ${formatCompactCurrency(inputs.tokenSupply, '')}`}
          </button>
          {supplyExpanded && (
            <div className="flex items-center gap-1 bg-[#0c0f0c] px-2 py-1 rounded border border-[#262E26]">
              <input
                type="number"
                value={inputs.tokenSupply}
                onChange={(e) => handleSupplyChange(parseFloat(e.target.value))}
                className="w-32 bg-transparent text-white font-mono text-xs focus:outline-none"
              />
              <span className="text-gray-500 text-[10px]">Supply</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
