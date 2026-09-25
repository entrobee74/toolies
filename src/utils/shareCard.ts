/**
 * DEGENCALC — Canvas 1080x1350 Share Card Generator
 * Pure client-side HTML5 2D Canvas rendering for social sharing (X/Twitter, Telegram, Discord).
 */

import { CalculationResult, CalculatorInputs } from '../types/calculator';
import { formatCompactCurrency, formatTokenPrice, formatRoi, formatNumberWithCommas } from './math';

export async function generateShareCardBlob(
  inputs: CalculatorInputs,
  result: CalculationResult
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Base Background (#111411)
  ctx.fillStyle = '#111411';
  ctx.fillRect(0, 0, 1080, 1350);

  // Cyber Grid background
  ctx.strokeStyle = 'rgba(38, 46, 38, 0.4)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x <= 1080; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1350);
    ctx.stroke();
  }
  for (let y = 0; y <= 1350; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1080, y);
    ctx.stroke();
  }

  // Subtle corner glow
  const gradient = ctx.createRadialGradient(540, 300, 100, 540, 300, 600);
  gradient.addColorStop(0, 'rgba(197, 243, 0, 0.08)');
  gradient.addColorStop(1, 'rgba(17, 20, 17, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1350);

  // Outer terminal border
  ctx.strokeStyle = '#262E26';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 1020, 1290);

  // Corner tech markers
  const markerLen = 30;
  ctx.strokeStyle = '#c5f300';
  ctx.lineWidth = 4;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(30, 30 + markerLen);
  ctx.lineTo(30, 30);
  ctx.lineTo(30 + markerLen, 30);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(1050 - markerLen, 30);
  ctx.lineTo(1050, 30);
  ctx.lineTo(1050, 30 + markerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(30, 1320 - markerLen);
  ctx.lineTo(30, 1320);
  ctx.lineTo(30 + markerLen, 1320);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(1050 - markerLen, 1320);
  ctx.lineTo(1050, 1320);
  ctx.lineTo(1050, 1320 - markerLen);
  ctx.stroke();

  // 2. Header
  // App Title
  ctx.fillStyle = '#c5f300';
  ctx.font = '700 36px "Space Grotesk", sans-serif';
  ctx.fillText('DEGENCALC', 70, 95);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.fillText('// HIGH-VELOCITY POSITION REPORT', 320, 93);

  // LIVE / SIMULATED badge
  ctx.fillStyle = '#181E18';
  ctx.fillRect(840, 65, 170, 42);
  ctx.strokeStyle = '#c5f300';
  ctx.lineWidth = 1;
  ctx.strokeRect(840, 65, 170, 42);

  // Green dot
  ctx.fillStyle = '#c5f300';
  ctx.beginPath();
  ctx.arc(860, 86, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED 100%', 880, 92);

  // Separator
  ctx.strokeStyle = '#262E26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 135);
  ctx.lineTo(1010, 135);
  ctx.stroke();

  // 3. Hero Section — Token & ROI
  const tokenSymbol = inputs.tokenMeta?.symbol || 'MEME';
  const tokenName = inputs.tokenMeta?.name || 'Custom Speculation';
  const isProfit = result.netProfitUsd >= 0;
  const heroColor = isProfit ? '#c5f300' : '#ff4d4d';

  // Token Card Box
  ctx.fillStyle = '#181E18';
  ctx.fillRect(70, 165, 940, 240);
  ctx.strokeStyle = isProfit ? 'rgba(197, 243, 0, 0.4)' : 'rgba(255, 77, 77, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 165, 940, 240);

  // Token Tag
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 18px "Space Grotesk", sans-serif';
  ctx.fillText('SPECULATIVE ASSET', 105, 205);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 48px "Space Grotesk", sans-serif';
  ctx.fillText(`$${tokenSymbol}`, 105, 260);

  ctx.fillStyle = '#6B7280';
  ctx.font = '400 20px "Space Grotesk", sans-serif';
  ctx.fillText(tokenName.length > 25 ? tokenName.slice(0, 25) + '...' : tokenName, 105, 295);

  // Right side of Hero: Net ROI %
  ctx.textAlign = 'right';
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 18px "Space Grotesk", sans-serif';
  ctx.fillText('ESTIMATED NET RETURN', 975, 205);

  ctx.fillStyle = heroColor;
  ctx.font = '800 68px "JetBrains Mono", monospace';
  ctx.fillText(formatRoi(result.netRoiPct), 975, 275);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 24px "JetBrains Mono", monospace';
  const profitPrefix = isProfit ? '+' : '';
  ctx.fillText(`${profitPrefix}${formatCompactCurrency(result.netProfitUsd)} Net PnL`, 975, 320);

  ctx.textAlign = 'left';

  // 4. Metrics Grid (2x2 Box)
  const boxY = 435;
  const boxH = 145;
  const colW = 455;
  const colGap = 30;

  const renderMetricCard = (x: number, y: number, label: string, mainVal: string, subVal: string) => {
    ctx.fillStyle = '#181E18';
    ctx.fillRect(x, y, colW, boxH);
    ctx.strokeStyle = '#262E26';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, colW, boxH);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 15px "Space Grotesk", sans-serif';
    ctx.fillText(label.toUpperCase(), x + 25, y + 36);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    ctx.fillText(mainVal, x + 25, y + 80);

    ctx.fillStyle = '#6B7280';
    ctx.font = '400 18px "JetBrains Mono", monospace';
    ctx.fillText(subVal, x + 25, y + 115);
  };

  // Card 1: Investment
  renderMetricCard(
    70,
    boxY,
    'Initial Capital',
    formatCompactCurrency(result.investedUsd),
    inputs.currency !== 'USD' ? `${result.investedNative.toFixed(3)} ${inputs.currency}` : `${formatNumberWithCommas(result.tokensReceived, 0)} Tokens`
  );

  // Card 2: Exit Value
  renderMetricCard(
    70 + colW + colGap,
    boxY,
    'Exit Stack Value',
    formatCompactCurrency(result.exitPortfolioValueUsd),
    `Gross: +${formatCompactCurrency(result.grossProfitUsd)}`
  );

  // Card 3: Entry vs Exit
  renderMetricCard(
    70,
    boxY + boxH + 20,
    'Price Trajectory',
    `${formatTokenPrice(result.entryPrice)} → ${formatTokenPrice(result.exitPrice)}`,
    `MCap: ${formatCompactCurrency(result.entryMcap)} → ${formatCompactCurrency(result.exitMcap)}`
  );

  // Card 4: Fee Stack Load
  renderMetricCard(
    70 + colW + colGap,
    boxY + boxH + 20,
    'Fee & Tax Stack',
    `-$${result.totalFeesUsd.toFixed(2)} Total`,
    `Slip ${inputs.fees.slippagePct}% | Platform ${inputs.fees.platformFeePct}% | Gas $${inputs.fees.gasFeeUsd}`
  );

  // 5. Aha-Moment Break-Even Banner
  const beY = boxY + boxH * 2 + 55;
  ctx.fillStyle = '#0c0f0c';
  ctx.fillRect(70, beY, 940, 75);
  ctx.strokeStyle = '#c5f300';
  ctx.lineWidth = 1;
  ctx.strokeRect(70, beY, 940, 75);

  ctx.fillStyle = '#c5f300';
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText(`⚡ BREAK-EVEN TARGET: ${result.breakEvenMultiple.toFixed(2)}x MOVE`, 100, beY + 45);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '400 17px "Space Grotesk", sans-serif';
  ctx.fillText(`Requires ${formatTokenPrice(result.breakEvenPrice)} (${formatCompactCurrency(result.breakEvenMcap)}) to absorb all fees`, 480, beY + 45);

  // 6. Scenario Table
  const tableY = beY + 105;
  ctx.fillStyle = '#181E18';
  ctx.fillRect(70, tableY, 940, 310);
  ctx.strokeStyle = '#262E26';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(70, tableY, 940, 310);

  // Table header
  ctx.fillStyle = '#262E26';
  ctx.fillRect(70, tableY, 940, 48);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 15px "Space Grotesk", sans-serif';
  ctx.fillText('TARGET', 100, tableY + 30);
  ctx.fillText('PRICE', 260, tableY + 30);
  ctx.fillText('MARKET CAP', 460, tableY + 30);
  ctx.fillText('PORTFOLIO VALUE', 670, tableY + 30);
  ctx.fillText('NET PROFIT', 880, tableY + 30);

  // Table rows (first 5 scenarios)
  const rowsToShow = result.scenarios.slice(0, 5);
  rowsToShow.forEach((row, i) => {
    const rowY = tableY + 48 + i * 50;

    // Alternate row line
    if (i > 0) {
      ctx.strokeStyle = '#262E26';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, rowY);
      ctx.lineTo(1010, rowY);
      ctx.stroke();
    }

    ctx.fillStyle = '#c5f300';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillText(row.label, 100, rowY + 32);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(formatTokenPrice(row.targetPrice), 260, rowY + 32);
    ctx.fillText(formatCompactCurrency(row.targetMcap), 460, rowY + 32);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText(formatCompactCurrency(row.portfolioValue), 670, rowY + 32);

    ctx.fillStyle = row.netProfit >= 0 ? '#c5f300' : '#ff4d4d';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText(`+${formatCompactCurrency(row.netProfit)}`, 880, rowY + 32);
  });

  // 7. Footer
  ctx.fillStyle = '#6B7280';
  ctx.font = '500 16px "Space Grotesk", sans-serif';
  ctx.fillText('DEGENCALC.COM  •  100% CLIENT-SIDE MEMECOIN TERMINAL', 70, 1265);

  ctx.textAlign = 'right';
  ctx.font = '400 14px "Space Grotesk", sans-serif';
  ctx.fillText('Estimates only. Not financial advice.', 1010, 1265);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image blob'));
      }
    }, 'image/png');
  });
}
