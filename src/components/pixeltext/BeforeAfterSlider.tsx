/**
 * PIXELTEXT — Before/After Split Comparison Slider
 * Allows interactive side-by-side comparison of original vs edited image
 * Includes secure sanitized download buttons (PNG/JPG)
 */

import React, { useState, useRef, useCallback } from 'react';
import { Download, Sliders, Check, FileDown, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalUrl: string;
  editedUrl: string;
  fileName?: string;
}

/**
 * Sanitizes download filename:
 * Strips everything except letters, numbers, dash (-), and underscore (_)
 */
export function sanitizeFilename(name: string, fallback = 'pixeltext_edited'): string {
  // Strip existing file extension
  const withoutExt = name.replace(/\.[^/.]+$/, '');
  // Keep only letters, numbers, dash, and underscore
  const sanitized = withoutExt.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  return sanitized || fallback;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalUrl,
  editedUrl,
  fileName = 'pixeltext_edited',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  // Trigger download with sanitized filename
  const handleDownload = (format: 'png' | 'jpeg') => {
    const cleanBase = sanitizeFilename(fileName);
    const downloadName = `${cleanBase}_edited.${format === 'jpeg' ? 'jpg' : 'png'}`;

    if (format === 'png' && editedUrl.startsWith('data:image/png')) {
      triggerDownload(editedUrl, downloadName);
      return;
    }

    // Convert data URL to target format via Canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const outputDataUrl = canvas.toDataURL(mimeType, 0.95);
      triggerDownload(outputDataUrl, downloadName);
    };
    img.src = editedUrl;
  };

  const triggerDownload = (dataUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(name);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="w-full">
      {/* Slider Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full rounded-2xl overflow-hidden bg-[#121212] border border-[#2A2A2A] select-none cursor-ew-resize min-h-[320px] max-h-[580px] flex items-center justify-center"
      >
        {/* Under layer: Edited Image (Right side) */}
        <img
          src={editedUrl}
          alt="AI Edited Result"
          className="w-full h-full max-h-[580px] object-contain pointer-events-none"
        />

        {/* Top layer: Original Image (Clipped to sliderPosition) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={originalUrl}
            alt="Original Upload"
            className="w-full h-full max-h-[580px] object-contain"
          />
        </div>

        {/* Divider vertical bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#00DDCB] shadow-[0_0_12px_rgba(0,221,203,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#121212] border-2 border-[#00DDCB] flex items-center justify-center text-[#00DDCB] shadow-xl">
            <Sliders className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Badges for Before / After */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-black/75 text-gray-300 backdrop-blur-sm border border-white/10">
            ORIGINAL
          </span>
        </div>
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#00DDCB]/20 text-[#00DDCB] backdrop-blur-sm border border-[#00DDCB]/40">
            AI EDITED
          </span>
        </div>
      </div>

      {/* Slider instructions note */}
      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] font-inter text-[#8A8A8A]">
        <span>← Drag slider horizontally to compare before and after →</span>
      </div>

      {/* Download Bar */}
      <div className="mt-5 p-4 rounded-xl bg-[#121212] border border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00DDCB]" />
            <span className="font-space font-bold text-sm text-white">
              Download Edited Image
            </span>
          </div>
          <p className="text-xs font-inter text-[#8A8A8A] mt-0.5">
            Full resolution • Clean typography • No watermark
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleDownload('png')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#00DDCB] hover:bg-[#00c4b4] text-[#121212] font-space font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 teal-glow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('jpeg')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] hover:border-[#FF7C6B]/50 text-gray-200 hover:text-white font-space font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-[#FF7C6B]" />
            <span>JPG</span>
          </button>
        </div>
      </div>

      {/* Download Confirmation Toast */}
      {downloadSuccess && (
        <div className="mt-3 p-3 rounded-xl bg-[#00DDCB]/10 border border-[#00DDCB]/40 text-[#00DDCB] text-xs font-inter flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 shrink-0" />
          <span>Downloaded <strong>{downloadSuccess}</strong> successfully!</span>
        </div>
      )}
    </div>
  );
};
