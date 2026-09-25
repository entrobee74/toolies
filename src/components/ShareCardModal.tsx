/**
 * DEGENCALC — Share Card Modal
 * Displays high-resolution 1080x1350 trader result card ready for X/Twitter & Telegram posting
 */

import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { CalculatorInputs, CalculationResult } from '../types/calculator';
import { generateShareCardBlob } from '../utils/shareCard';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  result: CalculationResult;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  inputs,
  result,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
      return;
    }

    let isMounted = true;
    setIsGenerating(true);

    generateShareCardBlob(inputs, result)
      .then((generatedBlob) => {
        if (!isMounted) return;
        setBlob(generatedBlob);
        const url = URL.createObjectURL(generatedBlob);
        setImageUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate share card:', err);
      })
      .finally(() => {
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, inputs, result]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!blob) return;
    const symbol = inputs.tokenMeta?.symbol || 'POSITION';
    const filename = `DEGENCALC_${symbol}_${result.netRoiPct >= 0 ? 'WIN' : 'CARD'}.png`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!blob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        handleDownload();
      }
    } catch (err) {
      console.warn('Clipboard write failed, triggering download instead', err);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181E18] border border-[#262E26] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#262E26] flex items-center justify-between bg-[#0c0f0c]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c5f300]"></span>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">
              SHAREABLE TRADER RESULT CARD
            </h3>
            <span className="text-[10px] font-mono text-[#c5f300] bg-[#c5f300]/10 border border-[#c5f300]/30 px-1.5 py-0.5 rounded">
              1080 x 1350 PNG
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#181E18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#111411]">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400 font-mono text-xs">
              <Loader2 className="w-8 h-8 animate-spin text-[#c5f300]" />
              <span>Rendering Cyber Terminal PNG...</span>
            </div>
          ) : imageUrl ? (
            <div className="relative group max-w-sm w-full rounded-xl overflow-hidden border border-[#262E26] shadow-2xl">
              <img
                src={imageUrl}
                alt="DegenCalc Result Card"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          ) : (
            <div className="text-gray-400 font-mono text-xs">
              Could not generate image.
            </div>
          )}

          <p className="text-[11px] font-mono text-gray-500 mt-3 text-center">
            Watermark-free, 1080x1350 high-resolution format optimized for X/Twitter and Telegram channels.
          </p>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 border-t border-[#262E26] bg-[#0c0f0c] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-gray-500 hidden sm:block">
            100% Client-Side Rendered
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              disabled={isGenerating || !blob}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#181E18] hover:bg-[#262E26] border border-[#262E26] text-white text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#c5f300]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating || !blob}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#c5f300] hover:bg-[#afd440] text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 lime-glow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
