/**
 * DEGENCALC — Types
 */

export type CurrencyType = 'USD' | 'SOL' | 'ETH';

export type CalculationMode = 'PRICE' | 'MCAP';

export interface FeeStackConfig {
  platformFeePct: number; // e.g. 1.0 = 1% (Raydium / Uniswap / Pump.fun / Trojan)
  slippagePct: number; // e.g. 1.0 = 1%
  buyTaxPct: number; // e.g. 0% or memecoin tax
  sellTaxPct: number; // e.g. 0% or memecoin tax
  gasFeeUsd: number; // flat gas estimate e.g. $0.005 for Solana or $2.50 for EVM
  gasFeeNative: number; // in SOL or ETH
  enabled: {
    platformFee: boolean;
    slippage: boolean;
    taxes: boolean;
    gasFee: boolean;
  };
}

export interface CalculatorInputs {
  currency: CurrencyType;
  nativePriceUsd: number; // e.g. SOL price ($150) or ETH price ($3200)
  investmentAmount: number; // In selected currency (or USD)
  isInvestmentInNative: boolean; // true = user typed 5 SOL, false = user typed $500 USD
  mode: CalculationMode; // 'PRICE' or 'MCAP'
  entryPrice: number; // USD per token
  entryMcap: number; // USD
  exitPrice: number; // USD per token
  exitMcap: number; // USD
  tokenSupply: number; // total token supply (default 1,000,000,000 for standard Solana tokens)
  fees: FeeStackConfig;
  tokenMeta?: TokenMetadata;
}

export interface ScenarioRow {
  multiple: number;
  label: string;
  targetPrice: number;
  targetMcap: number;
  portfolioValue: number;
  grossProfit: number;
  netProfit: number;
  netRoiPct: number;
}

export interface CalculationResult {
  investedUsd: number;
  investedNative: number;
  tokensReceived: number;
  entryPrice: number;
  entryMcap: number;
  exitPrice: number;
  exitMcap: number;
  exitPortfolioValueUsd: number;
  grossProfitUsd: number;
  grossRoiPct: number;
  totalFeesUsd: number;
  breakdownFees: {
    platformFeeUsd: number;
    slippageCostUsd: number;
    buyTaxUsd: number;
    sellTaxUsd: number;
    gasFeeUsd: number;
  };
  netProfitUsd: number;
  netRoiPct: number;
  breakEvenMultiple: number; // e.g. 1.08x
  breakEvenPrice: number;
  breakEvenMcap: number;
  priceImpactPct: number;
  liquidityUsd?: number;
  scenarios: ScenarioRow[];
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  address: string;
  network: string; // 'solana' | 'ethereum' | 'base' | 'bsc' etc.
  priceUsd: number;
  priceNative: number;
  fdv: number;
  marketCap: number;
  liquidityUsd: number;
  volume24h: number;
  priceChange24h: number;
  pairAddress: string;
  dexId: string;
  iconUrl?: string;
  fetchedAt: number;
}
