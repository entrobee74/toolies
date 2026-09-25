/**
 * PIXELTEXT — Types & Interfaces
 */

import { CompressionResult } from '../utils/imageCompressor';

export type EditStatus = 'idle' | 'compressing' | 'ready' | 'processing' | 'success' | 'error';

export interface PixelTextState {
  image: CompressionResult | null;
  instruction: string;
  editedImageUrl: string | null;
  status: EditStatus;
  progressPercent: number;
  statusMessage: string;
  errorMessage: string | null;
  dailyUsageCount: number;
  dailyLimit: number;
}

export interface SampleImageItem {
  id: string;
  title: string;
  category: string;
  description: string;
  suggestedPrompt: string;
  thumbnailUrl: string;
  fullDataUrl: string;
}
