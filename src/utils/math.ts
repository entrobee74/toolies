/**
 * DEGENCALC — Pure Mathematical Calculation Engine
 * 100% Client-side, deterministic, zero-dependency.
 */

import { CalculatorInputs, CalculationResult, ScenarioRow } from '../types/calculator';

/**
 * Format small prices (e.g., $0.00000421) safely without scientific notation.
 * Uses subscript representation for zeros when decimals are very small, or standard fixed.
 */
export function formatTokenPrice(price: number): string {
  if (isNaN(price) || price === 0) return '$0.00';
  if (price >= 1) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }

  // Handle tiny numbers below 1
  const priceStr = price.toFixed(12);
  const match = priceStr.match(/^0\.(0+)(\d+)/);
  if (match) {
    const zeroCount = match[1].length;
    const significantDigits = match[2].slice(0, 4);
    if (zeroCount >= 4) {
      // Subscript representation: 0.0₅4210
      const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
      const subscriptStr = zeroCount.toString().split('').map(d => subscripts[parseInt(d, 10)]).join('');
      return `$0.0${subscriptStr}${significantDigits}`;
    }
  }

  // Standard precision for 0.0001 - 0.9999
  const decimals = price < 0.001 ? 7 : price < 0.01 ? 5 : 4;
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * Format currency with compact suffix (e.g. $1.25M, $420.5K, $2.50B)
 */
export function formatCompactCurrency(val: number, prefix: string = '$'): string {
  if (isNaN(val)) return `${prefix}0`;
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${prefix}${(abs / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${prefix}${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${prefix}${(abs / 1_000).toFixed(2)}K`;
  }
  if (abs < 0.01 && abs > 0) {
    return `${sign}${formatTokenPrice(abs)}`;
  }
  return `${sign}${prefix}${abs.toFixed(2)}`;
}

/**
 * Format standard integers with commas
 */
export function formatNumberWithCommas(val: number, maxDecimals: number = 2): string {
  if (isNaN(val)) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

/**
 * Format ROI percentage with +/-
 */
export function formatRoi(roiPct: number): string {
  if (isNaN(roiPct)) return '0.00%';
  const prefix = roiPct > 0 ? '+' : '';
  return `${prefix}${roiPct.toFixed(2)}%`;
}

/**
 * Calculate Price Impact %
 * impact ≈ trade size / (liquidity + trade size)
 */
export function calculatePriceImpact(tradeUsd: number, liquidityUsd: number): number {
  if (!liquidityUsd || liquidityUsd <= 0 || !tradeUsd || tradeUsd <= 0) return 0;
  const impact = (tradeUsd / (liquidityUsd + tradeUsd)) * 100;
  return Math.min(Math.max(impact, 0), 100);
}

/**
 * Main Pure Position Calculator
 */
export function calculatePosition(inputs: CalculatorInputs): CalculationResult {
  const {
    currency,
    nativePriceUsd,
    investmentAmount,
    isInvestmentInNative,
    mode,
    entryPrice: rawEntryPrice,
    entryMcap: rawEntryMcap,
    exitPrice: rawExitPrice,
    exitMcap: rawExitMcap,
    tokenSupply: rawTokenSupply,
    fees,
    tokenMeta,
  } = inputs;

  const tokenSupply = rawTokenSupply > 0 ? rawTokenSupply : 1_000_000_000;

  // Investment conversion
  let investedUsd = 0;
  let investedNative = 0;
  const currentNativePrice = nativePriceUsd > 0 ? nativePriceUsd : (currency === 'SOL' ? 150 : 3200);

  if (isInvestmentInNative && currency !== 'USD') {
    investedNative = Math.max(0, investmentAmount || 0);
    investedUsd = investedNative * currentNativePrice;
  } else {
    investedUsd = Math.max(0, investmentAmount || 0);
    investedNative = currentNativePrice > 0 ? investedUsd / currentNativePrice : 0;
  }

  // Resolve Entry Price & Market Cap
  let entryPrice = 0;
  let entryMcap = 0;
  if (mode === 'MCAP') {
    entryMcap = Math.max(0, rawEntryMcap || 0);
    entryPrice = tokenSupply > 0 ? entryMcap / tokenSupply : 0;
  } else {
    entryPrice = Math.max(0, rawEntryPrice || 0);
    entryMcap = entryPrice * tokenSupply;
  }

  // Resolve Exit Price & Market Cap
  let exitPrice = 0;
  let exitMcap = 0;
  if (mode === 'MCAP') {
    exitMcap = Math.max(0, rawExitMcap || 0);
    exitPrice = tokenSupply > 0 ? exitMcap / tokenSupply : 0;
  } else {
    exitPrice = Math.max(0, rawExitPrice || 0);
    exitMcap = exitPrice * tokenSupply;
  }

  // Fee rates (toggleable)
  const platformFeeRate = fees.enabled.platformFee ? (fees.platformFeePct || 0) / 100 : 0;
  const slippageRate = fees.enabled.slippage ? (fees.slippagePct || 0) / 100 : 0;
  const buyTaxRate = fees.enabled.taxes ? (fees.buyTaxPct || 0) / 100 : 0;
  const sellTaxRate = fees.enabled.taxes ? (fees.sellTaxPct || 0) / 100 : 0;
  const totalGasFeeUsd = fees.enabled.gasFee ? (fees.gasFeeUsd || 0) * 2 : 0; // buy + sell gas

  // Buy Phase Breakdown
  const buyPlatformFeeUsd = investedUsd * platformFeeRate;
  const buySlippageLossUsd = investedUsd * (slippageRate * 0.5); // estimated effective slippage
  const buyTaxUsd = investedUsd * buyTaxRate;
  const netCapitalForTokensUsd = Math.max(0, investedUsd - buyPlatformFeeUsd - buyTaxUsd);

  // Tokens received based on entry price and slippage-adjusted effective entry
  const effectiveEntryPrice = entryPrice * (1 + (fees.enabled.slippage ? slippageRate * 0.25 : 0));
  const tokensReceived = effectiveEntryPrice > 0 ? netCapitalForTokensUsd / effectiveEntryPrice : 0;

  // Gross Portfolio Value at Exit
  const exitPortfolioValueUsd = tokensReceived * exitPrice;
  const grossProfitUsd = exitPortfolioValueUsd - investedUsd;
  const grossRoiPct = investedUsd > 0 ? (grossProfitUsd / investedUsd) * 100 : 0;

  // Sell Phase Breakdown
  const sellPlatformFeeUsd = exitPortfolioValueUsd * platformFeeRate;
  const sellSlippageLossUsd = exitPortfolioValueUsd * (slippageRate * 0.5);
  const sellTaxUsd = exitPortfolioValueUsd * sellTaxRate;

  // Total Fees
  const totalPlatformFeesUsd = buyPlatformFeeUsd + sellPlatformFeeUsd;
  const totalSlippageUsd = buySlippageLossUsd + sellSlippageLossUsd;
  const totalTaxesUsd = buyTaxUsd + sellTaxUsd;
  const totalFeesUsd = totalPlatformFeesUsd + totalSlippageUsd + totalTaxesUsd + totalGasFeeUsd;

  // Net Portfolio Value after sell fees
  const netExitValueUsd = Math.max(0, exitPortfolioValueUsd - sellPlatformFeeUsd - sellSlippageLossUsd - sellTaxUsd - (fees.enabled.gasFee ? fees.gasFeeUsd || 0 : 0));
  const netProfitUsd = netExitValueUsd - investedUsd - (fees.enabled.gasFee ? fees.gasFeeUsd || 0 : 0);
  const netRoiPct = investedUsd > 0 ? (netProfitUsd / investedUsd) * 100 : 0;

  // Break-even Multiple Calculation:
  // We want netExitValueUsd = investedUsd + gasFees
  // Let M = exitPrice / entryPrice
  // At break-even:
  // Tokens received = (investedUsd * (1 - platformFee - buyTax)) / (entryPrice * (1 + slippageBuy))
  // Gross Exit = Tokens * P_be
  // Net Exit = Gross Exit * (1 - platformFee - sellTax - slippageSell) - gasSell = investedUsd + gasBuy
  const buyEfficiency = (1 - platformFeeRate - buyTaxRate) / (1 + (fees.enabled.slippage ? slippageRate * 0.25 : 0));
  const sellEfficiency = (1 - platformFeeRate - sellTaxRate - (fees.enabled.slippage ? slippageRate * 0.5 : 0));

  let breakEvenMultiple = 1.0;
  if (buyEfficiency > 0 && sellEfficiency > 0 && investedUsd > 0) {
    const requiredGrossReturn = (investedUsd + totalGasFeeUsd) / sellEfficiency;
    const requiredRatio = (requiredGrossReturn / investedUsd) / buyEfficiency;
    breakEvenMultiple = Math.max(1.0, requiredRatio);
  } else if (investedUsd === 0) {
    breakEvenMultiple = 1 / Math.max(0.01, (1 - platformFeeRate * 2 - buyTaxRate - sellTaxRate - slippageRate));
  }

  const breakEvenPrice = entryPrice * breakEvenMultiple;
  const breakEvenMcap = entryMcap * breakEvenMultiple;

  // Price impact estimation
  const liquidity = tokenMeta?.liquidityUsd || 0;
  const priceImpactPct = calculatePriceImpact(investedUsd, liquidity);

  // Scenario Table: 2x, 5x, 10x, 25x, 50x, 100x
  const standardMultipliers = [2, 5, 10, 25, 50, 100];
  const scenarios: ScenarioRow[] = standardMultipliers.map((mult) => {
    const targetPrice = entryPrice * mult;
    const targetMcap = entryMcap * mult;
    const targetGrossUsd = tokensReceived * targetPrice;
    const targetSellFees = (targetGrossUsd * (platformFeeRate + sellTaxRate + (fees.enabled.slippage ? slippageRate * 0.5 : 0))) + (fees.enabled.gasFee ? fees.gasFeeUsd || 0 : 0);
    const targetNetUsd = targetGrossUsd - targetSellFees;
    const targetNetProfit = targetNetUsd - investedUsd - (fees.enabled.gasFee ? fees.gasFeeUsd || 0 : 0);
    const targetNetRoi = investedUsd > 0 ? (targetNetProfit / investedUsd) * 100 : 0;

    return {
      multiple: mult,
      label: `${mult}x`,
      targetPrice,
      targetMcap,
      portfolioValue: targetGrossUsd,
      grossProfit: targetGrossUsd - investedUsd,
      netProfit: targetNetProfit,
      netRoiPct: targetNetRoi,
    };
  });

  return {
    investedUsd,
    investedNative,
    tokensReceived,
    entryPrice,
    entryMcap,
    exitPrice,
    exitMcap,
    exitPortfolioValueUsd,
    grossProfitUsd,
    grossRoiPct,
    totalFeesUsd,
    breakdownFees: {
      platformFeeUsd: totalPlatformFeesUsd,
      slippageCostUsd: totalSlippageUsd,
      buyTaxUsd,
      sellTaxUsd,
      gasFeeUsd: totalGasFeeUsd,
    },
    netProfitUsd,
    netRoiPct,
    breakEvenMultiple,
    breakEvenPrice,
    breakEvenMcap,
    priceImpactPct,
    liquidityUsd: liquidity,
    scenarios,
  };
}
