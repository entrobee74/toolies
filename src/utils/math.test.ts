/**
 * DEGENCALC — Unit tests for calculatePosition and mathematical helpers
 * Can be run via tsx src/utils/math.test.ts
 */

import { calculatePosition, calculatePriceImpact, formatTokenPrice } from './math';
import { CalculatorInputs } from '../types/calculator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runMathTests() {
  console.log('Running DEGENCALC Math Unit Tests...');

  // Test 1: Basic 2x without fees
  const baseInputs: CalculatorInputs = {
    currency: 'USD',
    nativePriceUsd: 150,
    investmentAmount: 1000,
    isInvestmentInNative: false,
    mode: 'PRICE',
    entryPrice: 0.01,
    entryMcap: 10_000_000,
    exitPrice: 0.02, // 2x
    exitMcap: 20_000_000,
    tokenSupply: 1_000_000_000,
    fees: {
      platformFeePct: 0,
      slippagePct: 0,
      buyTaxPct: 0,
      sellTaxPct: 0,
      gasFeeUsd: 0,
      gasFeeNative: 0,
      enabled: {
        platformFee: false,
        slippage: false,
        taxes: false,
        gasFee: false,
      },
    },
  };

  const res1 = calculatePosition(baseInputs);
  assert(res1.tokensReceived === 100_000, `Expected 100,000 tokens, got ${res1.tokensReceived}`);
  assert(res1.exitPortfolioValueUsd === 2000, `Expected $2,000 exit value, got ${res1.exitPortfolioValueUsd}`);
  assert(res1.grossProfitUsd === 1000, `Expected $1,000 gross profit, got ${res1.grossProfitUsd}`);
  assert(res1.grossRoiPct === 100, `Expected 100% gross ROI, got ${res1.grossRoiPct}%`);
  assert(Math.abs(res1.breakEvenMultiple - 1.0) < 0.001, `Expected 1.0x break even without fees, got ${res1.breakEvenMultiple}`);

  // Test 2: Fee Stack with 1% platform fee + 1% slippage + 5% buy tax + 5% sell tax
  const feeInputs: CalculatorInputs = {
    ...baseInputs,
    fees: {
      platformFeePct: 1,
      slippagePct: 1,
      buyTaxPct: 5,
      sellTaxPct: 5,
      gasFeeUsd: 1,
      gasFeeNative: 0.005,
      enabled: {
        platformFee: true,
        slippage: true,
        taxes: true,
        gasFee: true,
      },
    },
  };

  const res2 = calculatePosition(feeInputs);
  assert(res2.totalFeesUsd > 0, `Total fees should be > 0, got ${res2.totalFeesUsd}`);
  assert(res2.breakEvenMultiple > 1.05, `Break-even multiple should be > 1.05x with 10%+ fees, got ${res2.breakEvenMultiple}x`);
  assert(res2.netProfitUsd < res2.grossProfitUsd, `Net profit should be less than gross profit due to fees`);

  // Test 3: Price Impact Estimator
  const impact1 = calculatePriceImpact(1000, 100_000); // 1000 / 101000 ≈ 0.99%
  assert(impact1 < 1.1 && impact1 > 0.9, `Price impact of $1k on $100k liq should be ~0.99%, got ${impact1}`);

  const impactHeavy = calculatePriceImpact(10_000, 20_000); // 10000 / 30000 ≈ 33.3%
  assert(impactHeavy > 30, `Price impact should be > 30%, got ${impactHeavy}`);

  // Test 4: Extreme micro price format
  const microFormatted = formatTokenPrice(0.000000421);
  assert(microFormatted.includes('421'), `Micro price format should contain significant digits: ${microFormatted}`);

  console.log('✓ All math tests passed successfully!');
  return true;
}

// Auto-run if executed directly via Node / tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('math.test')) {
  runMathTests();
}
