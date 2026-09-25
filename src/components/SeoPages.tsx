/**
 * DEGENCALC — SEO Content & Trader Guides
 * Provides dedicated pages, 800+ word comprehensive trader guide, FAQ, and internal linking
 * for AdSense / Coinzilla domain approval and organic search discovery.
 */

import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, ArrowRight, ShieldAlert, Cpu, Percent, Fuel } from 'lucide-react';
import { AdPlacement } from './AdPlacement';

interface SeoPagesProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const SeoPageHeader: React.FC<{
  currentTab: string;
  onSelectTab: (tab: string) => void;
}> = ({ currentTab, onSelectTab }) => {
  if (currentTab === 'calculator') {
    return (
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Memecoin Profit Calculator &amp; Fee Break-Even Terminal
        </h1>
        <p className="text-sm font-mono text-gray-400 mt-1 max-w-3xl">
          Instantly simulate token trades, estimate DexScreener price impact, deduce platform fees &amp; gas, and compute your exact break-even multiple before executing.
        </p>
      </div>
    );
  }

  if (currentTab === 'price-impact') {
    return (
      <div className="mb-6 p-4 rounded-xl bg-[#181E18] border border-[#262E26]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c5f300] font-bold uppercase mb-1">
          <span>TOOL //</span> PRICE IMPACT &amp; SLIPPAGE ANALYZER
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Memecoin Price Impact &amp; Liquidity Depth Calculator
        </h1>
        <p className="text-xs sm:text-sm font-mono text-gray-400 mt-1.5 leading-relaxed">
          How much will your order move the market? On low-liquidity Raydium, Pump.fun, or Uniswap pools, large buys or sells can induce 5% to 40% slippage. Test your trade size against live pool liquidity below.
        </p>
      </div>
    );
  }

  if (currentTab === 'solana') {
    return (
      <div className="mb-6 p-4 rounded-xl bg-[#181E18] border border-[#262E26]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c5f300] font-bold uppercase mb-1">
          <span>TOOL //</span> SOLANA MEMECOIN PNL SUITE
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Solana Memecoin Profit Calculator (SOL &amp; USD)
        </h1>
        <p className="text-xs sm:text-sm font-mono text-gray-400 mt-1.5 leading-relaxed">
          Calibrated specifically for Solana memecoins traded on Raydium CPMM, Pump.fun bonding curves, and Orca Whirlpools. Built-in 0.005 SOL priority fee and 1% DEX routing deductions.
        </p>
      </div>
    );
  }

  return null;
};

export const TraderGuideArticle: React.FC<{ onGoToCalculator: () => void }> = ({ onGoToCalculator }) => {
  return (
    <article className="max-w-4xl mx-auto bg-[#181E18] border border-[#262E26] rounded-2xl p-6 sm:p-10 my-8 text-gray-300 font-sans">
      <div className="flex items-center gap-2 text-xs font-mono text-[#c5f300] uppercase font-bold mb-3">
        <BookOpen className="w-4 h-4" />
        <span>Comprehensive Educational Guide • 800+ Words</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
        How to Calculate Memecoin Profits: The Complete Mathematical Guide to Fees, Slippage &amp; Break-Even Multiples
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400 pb-6 border-b border-[#262E26] mb-8">
        <span>Updated: Current Market Cycle</span>
        <span>•</span>
        <span>Reading Time: 6 min</span>
        <span>•</span>
        <span className="text-[#c5f300]">Category: DeFi Mechanics</span>
      </div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-gray-300">
        <p className="font-medium text-white text-base sm:text-lg">
          In the high-speed world of decentralized memecoin speculation—whether trading on Solana (Raydium, Pump.fun, Meteora), Ethereum (Uniswap v2/v3), or Base (Aerodrome)—calculating your true take-home profit is vastly more complicated than simply subtracting your entry price from your exit price.
        </p>

        <p>
          Novice traders frequently fall into the &quot;Gross Profit Illusion.&quot; They see a token jump 15% and assume they have secured a 15% gain. However, once platform routing fees, slippage tolerance, token contract taxes, priority gas fees, and liquidity pool price impacts are deducted on both the entry and exit transactions, that 15% surge often turns out to be a net loss. This guide details the exact mathematics behind every fee layer and how to use DEGENCALC to verify your true break-even multiple.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#c5f300]" />
          1. The Five Hidden Layers of Trading Friction
        </h2>

        <p>
          Every trade on an automated market maker (AMM) or bonding curve passes through five distinct friction points:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-300 font-mono text-sm">
          <li>
            <strong className="text-white">AMM Platform Liquidity Fee:</strong> Standard decentralized exchanges charge between 0.25% (Raydium standard) to 1.00% (Pump.fun curve fee, Telegram bot routing fees like Trojan, Maestro, or Photon). This is charged twice: once on the buy, and once on the sell.
          </li>
          <li>
            <strong className="text-white">Slippage Tolerance &amp; MEV Execution Drift:</strong> Slippage is the difference between the expected price of a trade and the executed price. In volatile low-liquidity memecoins, traders often set slippage to 1%–5% to guarantee execution. In high-traffic congestion, searchers and MEV bots can sandwich transactions, eroding an additional 0.5%–2% of your stack.
          </li>
          <li>
            <strong className="text-white">Token Smart Contract Taxes:</strong> While most modern Solana SPL tokens carry zero tax, many EVM tokens and older tokens enforce a 1% to 10% buy and sell tax that redirects funds directly to marketing or developer wallets.
          </li>
          <li>
            <strong className="text-white">Network Gas and Priority Bribes:</strong> On Solana, base gas is cheap (~0.000005 SOL), but rapid execution during congestion requires priority fees and Jito tips ranging from 0.005 SOL to 0.05 SOL (~$0.75 to $8.00). On Ethereum mainnet, Uniswap swaps commonly cost $5 to $40 in gas each way.
          </li>
          <li>
            <strong className="text-white">Constant Product Price Impact:</strong> In an AMM pool using the $x \cdot y = k$ invariant, your trade size consumes pool liquidity and shifts the marginal spot price. If you execute a $2,000 swap against a $20,000 liquidity pool, your price impact will exceed 9%, fundamentally degrading your average entry and exit prices.
          </li>
        </ul>

        {/* Mid-content Ad Placement */}
        <AdPlacement slot="in-content" />

        <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 flex items-center gap-2">
          <Percent className="w-5 h-5 text-[#c5f300]" />
          2. The Mathematical Break-Even Formula
        </h2>

        <p>
          Why do you need an exact <strong>Break-Even Multiple</strong>? To discover the exact market move required just to recover your starting principal.
        </p>

        <div className="p-4 rounded-xl bg-[#0c0f0c] border border-[#262E26] font-mono text-xs sm:text-sm text-gray-300">
          <p className="text-[#c5f300] font-bold mb-2">// FORMULA: Break-Even Exit Multiple</p>
          <p>Tokens Received = [Capital × (1 - Fee_buy - Tax_buy)] / [EntryPrice × (1 + Slip_buy)]</p>
          <p className="mt-2">Net Exit Capital = [Tokens × ExitPrice × (1 - Fee_sell - Tax_sell - Slip_sell)] - Gas_roundtrip</p>
          <p className="mt-2 text-white font-bold">Setting Net Exit Capital = Capital yields:</p>
          <p className="text-[#c5f300] font-bold text-sm sm:text-base mt-1">
            Multiple = 1 / [(1 - Fee_total - Tax_total - Slip_total)] + (Gas / Capital)
          </p>
        </div>

        <p>
          For example: If you invest $500 in a token with a 1% platform fee, 1.5% slippage, and 0.005 SOL priority gas, you need a minimum <strong>1.08x (+8.2%)</strong> upward price trajectory just to reach $0 profit. If you trade with a 5% buy/sell token tax, your required break-even immediately leaps to <strong>1.18x (+18%)</strong>!
        </p>

        <h2 className="text-xl sm:text-2xl font-bold text-white pt-4 flex items-center gap-2">
          <Fuel className="w-5 h-5 text-[#c5f300]" />
          3. How to Protect Your Capital When Trading Memecoins
        </h2>

        <ol className="list-decimal pl-6 space-y-2 text-gray-300 font-mono text-sm">
          <li>
            <strong>Check Pool Liquidity Before Sizing:</strong> Never enter a position larger than 2% to 3% of the total liquidity pool size. If the pool has $30,000 in liquidity, trading more than $600 will incur damaging price impact upon entry and exit.
          </li>
          <li>
            <strong>Use Degencalc Before Submitting Swaps:</strong> Paste the contract address into the terminal above to check live market cap, pool depth, and projected scenarios (2x, 5x, 10x, 50x, 100x).
          </li>
          <li>
            <strong>Stage Your Exits:</strong> Rather than dumping your entire token bag in a single transaction that triggers maximum price impact, scale out into strength with limit orders or staged increments.
          </li>
        </ol>

        <div className="pt-6 border-t border-[#262E26] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold">Ready to calculate your position?</div>
            <div className="text-xs font-mono text-gray-400">Launch the 100% free client-side terminal now.</div>
          </div>

          <button
            onClick={onGoToCalculator}
            className="px-6 py-3 rounded-xl bg-[#c5f300] text-black font-bold text-xs uppercase font-mono tracking-wider hover:bg-[#afd440] transition-colors flex items-center gap-2 lime-glow-sm"
          >
            <span>Open Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is DEGENCALC and is it 100% free?',
      a: 'DEGENCALC is an open-access, browser-based memecoin profit and fee calculator. It runs 100% client-side in your browser. There are zero subscription fees, no wallet connections required, and no server-side tracking. It is monetized entirely through privacy-friendly crypto display advertising.',
    },
    {
      q: 'How does the live DexScreener token lookup work?',
      a: 'When you paste a token contract address (Solana SPL token address or EVM 0x contract), your browser makes a direct client-side request to DexScreener’s public API endpoint. The tool extracts the most liquid pair, live USD price, market cap, and pool liquidity, and automatically populates the calculator fields.',
    },
    {
      q: 'Why do I need a 1.08x or 1.15x move just to break even?',
      a: 'Decentralized trading involves multiple fee layers: DEX platform fees (1%), transaction slippage (1%), priority network gas, and token smart contract taxes (if applicable). When you buy and sell, fees are incurred in both directions. The Break-Even Multiple calculates the exact exit threshold required so that your net proceeds match your original capital after every fee has been deducted.',
    },
    {
      q: 'How is Price Impact calculated?',
      a: 'Price impact is estimated based on the constant product automated market maker formula: Impact % ≈ Trade Size / (Pool Liquidity + Trade Size). In low-liquidity memecoins, entering or exiting with large sizes moves the spot price against you, causing severe hidden slippage.',
    },
    {
      q: 'Does DEGENCALC require connecting my crypto wallet?',
      a: 'No! DEGENCALC never asks for your private keys, seed phrases, or wallet connection. All calculations are executed purely as mathematical simulations in your browser.',
    },
    {
      q: 'Can I export shareable cards of my profit projections?',
      a: 'Yes! Click "Generate Share Card" to create a crisp 1080x1350 PNG rendered directly on your device via HTML5 Canvas. It includes token stats, ROI, and projection scenarios with zero watermarks—ready to share on X (Twitter), Telegram, or Discord.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-8 bg-[#181E18] border border-[#262E26] rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-mono text-[#c5f300] uppercase font-bold mb-2">
        <HelpCircle className="w-4 h-4" />
        <span>Frequently Asked Questions</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
        Memecoin Trading &amp; Calculation FAQ
      </h2>

      <div className="space-y-3 font-mono">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-[#262E26] rounded-xl overflow-hidden bg-[#0c0f0c] transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:text-[#c5f300] transition-colors"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#c5f300] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-400 font-sans leading-relaxed border-t border-[#262E26]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
