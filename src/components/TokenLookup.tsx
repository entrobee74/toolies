/**
 * DEGENCALC — Token Lookup Component
 * Fetches token data directly from DexScreener public API
 */

import React, { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { TokenMetadata } from '../types/calculator';
import { fetchTokenFromDexScreener, POPULAR_MEMECOINS, PresetToken } from '../services/dexscreener';
import { formatCompactCurrency, formatTokenPrice } from '../utils/math';

interface TokenLookupProps {
  onTokenSelected: (token: TokenMetadata) => void;
  currentToken?: TokenMetadata;
}

export const TokenLookup: React.FC<TokenLookupProps> = ({
  onTokenSelected,
  currentToken,
}) => {
  const [addressInput, setAddressInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  // Live timer for data freshness
  useEffect(() => {
    if (!currentToken?.fetchedAt) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - currentToken.fetchedAt) / 1000);
      setSecondsAgo(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentToken?.fetchedAt]);

  const handleLookup = async (addressToSearch?: string) => {
    const targetAddress = addressToSearch || addressInput;
    if (!targetAddress.trim()) {
      setError('Please paste a contract address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTokenFromDexScreener(targetAddress.trim());
      onTokenSelected(data);
      setSecondsAgo(0);
    } catch (err: any) {
      setError(err.message || 'Token lookup failed. You can still enter prices manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetToken) => {
    setAddressInput(preset.address);
    handleLookup(preset.address);
  };

  return (
    <div className="bg-[#181E18] border border-[#262E26] rounded-xl p-4 sm:p-5">
      {/* Top Bar / Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c5f300]"></span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
            DEXSCREENER TOKEN LOOKUP
          </span>
          <span className="text-[10px] font-mono text-gray-500 uppercase px-1.5 py-0.5 rounded bg-[#0c0f0c] border border-[#262E26]">
            Solana / EVM / Base
          </span>
        </div>

        {currentToken && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#c5f300]/10 border border-[#c5f300]/40 text-[#c5f300] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5f300] animate-ping"></span>
              LIVE DATA
            </span>
            <span className="text-gray-400">
              {secondsAgo < 5 ? 'Just now' : `${secondsAgo}s ago`}
            </span>
          </div>
        )}
      </div>

      {/* Input Group */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={addressInput}
            onChange={(e) => {
              setAddressInput(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLookup();
            }}
            placeholder="Paste Solana or EVM contract address (e.g. EKpQGSJtj... or 0x6982...)"
            className="w-full bg-[#0c0f0c] border border-[#262E26] rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#c5f300] transition-colors"
          />
        </div>

        <button
          onClick={() => handleLookup()}
          disabled={isLoading}
          className="px-5 py-2.5 bg-[#c5f300] hover:bg-[#afd440] disabled:bg-gray-700 text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 lime-glow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Auto-Fill</span>
            </>
          )}
        </button>
      </div>

      {/* Popular Presets */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-mono text-gray-500 mr-1">Trending:</span>
        {POPULAR_MEMECOINS.map((preset) => (
          <button
            key={preset.symbol}
            onClick={() => handleSelectPreset(preset)}
            className="px-2 py-0.5 rounded bg-[#0c0f0c] hover:bg-[#262E26] border border-[#262E26] text-[11px] font-mono text-gray-300 hover:text-[#c5f300] transition-colors flex items-center gap-1"
          >
            <span>${preset.symbol}</span>
            <span className="text-[9px] text-gray-500">({preset.chainLabel})</span>
          </button>
        ))}
      </div>

      {/* Error Fallback Notice */}
      {error && (
        <div className="mt-3 p-3 bg-red-950/40 border border-red-900/60 rounded-lg flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-[#ff4d4d] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#ffb4ab]">Lookup Failed: {error}</p>
            <p className="text-gray-400 mt-0.5">
              No problem! You can type entry price and target exit numbers manually below. The calculator never breaks.
            </p>
          </div>
        </div>
      )}

      {/* Discovered Token Pill Details */}
      {currentToken && !isLoading && (
        <div className="mt-4 pt-3 border-t border-[#262E26] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
          <div className="bg-[#0c0f0c] p-2.5 rounded-lg border border-[#262E26]">
            <span className="text-[10px] text-gray-500 uppercase block">TOKEN</span>
            <div className="font-bold text-white flex items-center gap-1 mt-0.5">
              <span>${currentToken.symbol}</span>
              <span className="text-[10px] text-[#c5f300]">({currentToken.network.toUpperCase()})</span>
            </div>
          </div>

          <div className="bg-[#0c0f0c] p-2.5 rounded-lg border border-[#262E26]">
            <span className="text-[10px] text-gray-500 uppercase block">LIVE PRICE</span>
            <div className="font-bold text-[#c5f300] mt-0.5">
              {formatTokenPrice(currentToken.priceUsd)}
            </div>
          </div>

          <div className="bg-[#0c0f0c] p-2.5 rounded-lg border border-[#262E26]">
            <span className="text-[10px] text-gray-500 uppercase block">MARKET CAP</span>
            <div className="font-bold text-white mt-0.5">
              {formatCompactCurrency(currentToken.marketCap)}
            </div>
          </div>

          <div className="bg-[#0c0f0c] p-2.5 rounded-lg border border-[#262E26]">
            <span className="text-[10px] text-gray-500 uppercase block">POOL LIQUIDITY</span>
            <div className="font-bold text-white mt-0.5">
              {formatCompactCurrency(currentToken.liquidityUsd)}
            </div>
          </div>

          <div className="bg-[#0c0f0c] p-2.5 rounded-lg border border-[#262E26]">
            <span className="text-[10px] text-gray-500 uppercase block">24H VOLUME</span>
            <div className="font-bold text-gray-300 mt-0.5">
              {formatCompactCurrency(currentToken.volume24h)}
            </div>
          </div>

          <div className="bg-[#0c0f0c] p-2.5 rounded-lg border border-[#262E26]">
            <span className="text-[10px] text-gray-500 uppercase block">24H CHANGE</span>
            <div
              className={`font-bold mt-0.5 flex items-center gap-0.5 ${
                currentToken.priceChange24h >= 0 ? 'text-[#c5f300]' : 'text-[#ff4d4d]'
              }`}
            >
              {currentToken.priceChange24h >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{currentToken.priceChange24h.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
