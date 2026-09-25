/**
 * PIXELTEXT — Sample Test Images Generator
 * Provides 1-click test cards with clear text elements ready for AI editing
 */

import { SampleImageItem } from '../types/pixeltext';

function createSampleCanvas(
  title: string,
  subtitle: string,
  badge: string,
  bgColor1: string,
  bgColor2: string,
  textColor: string,
  accentColor: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 1000, 700);
  grad.addColorStop(0, bgColor1);
  grad.addColorStop(1, bgColor2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1000, 700);

  // Subtle geometric grid/shapes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 1000; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 700);
    ctx.stroke();
  }

  // Card container
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.roundRect(80, 80, 840, 540, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.roundRect(80, 80, 840, 540, 24);
  ctx.stroke();

  // Badge pill
  ctx.fillStyle = accentColor;
  ctx.roundRect(140, 140, 220, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#121212';
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.fillText(badge, 170, 172);

  // Big Headline text
  ctx.fillStyle = textColor;
  ctx.font = '900 68px "Space Grotesk", sans-serif';
  ctx.fillText(title, 140, 310);

  // Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '500 32px "Inter", sans-serif';
  ctx.fillText(subtitle, 140, 380);

  // Decorative text details
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '400 22px "Inter", sans-serif';
  ctx.fillText('EST. 2024 • PREMIUM BATCH • CRAFTED WITH CARE', 140, 510);

  return canvas.toDataURL('image/jpeg', 0.9);
}

export function getSampleImages(): SampleImageItem[] {
  // Generate sample images safely in browser
  if (typeof window === 'undefined') return [];

  const sample1 = createSampleCanvas(
    'COFFEE & CO.',
    'ROASTED FRESH IN BROOKLYN',
    'STOREFRONT SIGN',
    '#1c1917',
    '#44403c',
    '#fef08a',
    '#f59e0b'
  );

  const sample2 = createSampleCanvas(
    'FLASH SALE 50% OFF',
    'LIMITED WEEKEND SPECIAL ONLY',
    'PROMO BANNER',
    '#0f172a',
    '#1e1b4b',
    '#38bdf8',
    '#00DDCB'
  );

  const sample3 = createSampleCanvas(
    'PURE MATCHA 100g',
    'CEREMONIAL GRADE GREEN TEA',
    'PRODUCT LABEL',
    '#064e3b',
    '#022c22',
    '#a7f3d0',
    '#34d399'
  );

  const sample4 = createSampleCanvas(
    'WAITING FOR 100X',
    'EVERY DAY LOOKING AT CHARTS',
    'MEME TEMPLATE',
    '#31103f',
    '#1a0628',
    '#f472b6',
    '#FF7C6B'
  );

  return [
    {
      id: 'storefront',
      title: 'Storefront Sign',
      category: 'Signage',
      description: 'Replace "COFFEE & CO." with your own cafe brand name',
      suggestedPrompt: 'Change "COFFEE & CO." to "NEON BAKERY", keep the exact same font and yellow glow.',
      thumbnailUrl: sample1,
      fullDataUrl: sample1,
    },
    {
      id: 'promo',
      title: 'Discount Banner',
      category: 'E-Commerce',
      description: 'Change "FLASH SALE 50% OFF" to "SUMMER CLEARANCE 70% OFF"',
      suggestedPrompt: 'Change "FLASH SALE 50% OFF" to "BLACK FRIDAY SALE", preserve the bold styling.',
      thumbnailUrl: sample2,
      fullDataUrl: sample2,
    },
    {
      id: 'product',
      title: 'Product Packaging',
      category: 'Mockup',
      description: 'Change "PURE MATCHA" to "ORGANIC CHAI SPICE"',
      suggestedPrompt: 'Change "PURE MATCHA 100g" to "ORGANIC CHAI 250g", keeping the clean typography.',
      thumbnailUrl: sample3,
      fullDataUrl: sample3,
    },
    {
      id: 'meme',
      title: 'Meme Template',
      category: 'Social Media',
      description: 'Swap text caption while preserving meme style',
      suggestedPrompt: 'Change "WAITING FOR 100X" to "ME AT 3 AM CHECKING DEXSCREENER".',
      thumbnailUrl: sample4,
      fullDataUrl: sample4,
    },
  ];
}
