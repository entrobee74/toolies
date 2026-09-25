/**
 * DEGENCALC — DexScreener Client-Side Integration
 * Direct browser fetch from DexScreener public API (no key required)
 * Includes in-memory 60s cache and preset popular memecoins for quick testing.
 */

import { TokenMetadata } from '../types/calculator';

interface CacheEntry {
  data: TokenMetadata;
  timestamp: number;
}

const CACHE_DURATION_MS = 60 * 1000; // 60 seconds
const tokenCache = new Map<string, CacheEntry>();

export interface PresetToken {
  name: string;
  symbol: string;
  address: string;
  network: string;
  chainLabel: string;
  defaultPrice: number;
  defaultMcap: number;
  defaultLiquidity: number;
}

export const POPULAR_MEMECOINS: PresetToken[] = [
  {
    name: 'dogwifhat',
    symbol: 'WIF',
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    network: 'solana',
    chainLabel: 'SOL',
    defaultPrice: 1.85,
    defaultMcap: 1_850_000_000,
    defaultLiquidity: 45_000_000,
  },
  {
    name: 'Pepe',
    symbol: 'PEPE',
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    network: 'ethereum',
    chainLabel: 'ETH',
    defaultPrice: 0.0000085,
    defaultMcap: 3_570_000_000,
    defaultLiquidity: 75_000_000,
  },
  {
    name: 'Bonk',
    symbol: 'BONK',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    network: 'solana',
    chainLabel: 'SOL',
    defaultPrice: 0.000021,
    defaultMcap: 1_470_000_000,
    defaultLiquidity: 28_000_000,
  },
  {
    name: 'Popcat',
    symbol: 'POPCAT',
    address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
    network: 'solana',
    chainLabel: 'SOL',
    defaultPrice: 0.95,
    defaultMcap: 930_000_000,
    defaultLiquidity: 24_000_000,
  },
  {
    name: 'Fartcoin',
    symbol: 'FARTCOIN',
    address: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
    network: 'solana',
    chainLabel: 'SOL',
    defaultPrice: 0.42,
    defaultMcap: 420_000_000,
    defaultLiquidity: 18_000_000,
  },
];

export async function fetchTokenFromDexScreener(rawAddress: string): Promise<TokenMetadata> {
  const address = rawAddress.trim();
  if (!address) {
    throw new Error('Please enter a contract address');
  }

  // Check cache
  const cached = tokenCache.get(address.toLowerCase());
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  const endpoint = `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(address)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`DexScreener API error: HTTP ${response.status}`);
    }

    const json = await response.json();
    const pairs = json.pairs;

    if (!pairs || !Array.isArray(pairs) || pairs.length === 0) {
      throw new Error('Token not found or no active liquidity pairs found on DexScreener');
    }

    // Sort pairs by highest liquidity in USD
    const sortedPairs = [...pairs].sort((a, b) => {
      const liqA = Number(a.liquidity?.usd || 0);
      const liqB = Number(b.liquidity?.usd || 0);
      return liqB - liqA;
    });

    const bestPair = sortedPairs[0];

    const priceUsd = parseFloat(bestPair.priceUsd || '0');
    const priceNative = parseFloat(bestPair.priceNative || '0');
    const fdv = Number(bestPair.fdv || 0);
    const marketCap = Number(bestPair.marketCap || fdv || 0);
    const liquidityUsd = Number(bestPair.liquidity?.usd || 0);
    const volume24h = Number(bestPair.volume?.h24 || 0);
    const priceChange24h = Number(bestPair.priceChange?.h24 || 0);

    const tokenData: TokenMetadata = {
      name: bestPair.baseToken?.name || 'Unknown Token',
      symbol: bestPair.baseToken?.symbol || 'TOKEN',
      address: bestPair.baseToken?.address || address,
      network: bestPair.chainId || 'solana',
      priceUsd,
      priceNative,
      fdv,
      marketCap,
      liquidityUsd,
      volume24h,
      priceChange24h,
      pairAddress: bestPair.pairAddress || '',
      dexId: bestPair.dexId || 'dex',
      iconUrl: bestPair.info?.imageUrl,
      fetchedAt: Date.now(),
    };

    tokenCache.set(address.toLowerCase(), {
      data: tokenData,
      timestamp: Date.now(),
    });

    return tokenData;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Lookup timed out. Network may be slow.');
    }
    throw new Error(err.message || 'DexScreener lookup failed');
  }
}
