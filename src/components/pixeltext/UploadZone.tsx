/**
 * PIXELTEXT — Upload Zone Component
 * Supports Drag & Drop, Clipboard Paste, File Picker, and 1-Click Sample Presets
 * Automatically triggers client-side canvas compression (max 1536px, quality 0.85)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Clipboard, Image as ImageIcon, CheckCircle, RefreshCw, X, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { compressImageClientSide, CompressionResult, formatBytes } from '../../utils/imageCompressor';
import { getSampleImages } from '../../utils/sampleImages';
import { SampleImageItem } from '../../types/pixeltext';

interface UploadZoneProps {
  currentImage: CompressionResult | null;
  onImageSelected: (compressed: CompressionResult, suggestedPrompt?: string) => void;
  onClearImage: () => void;
  isProcessing?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  currentImage,
  onImageSelected,
  onClearImage,
  isProcessing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [samples, setSamples] = useState<SampleImageItem[]>([]);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSamples(getSampleImages());
  }, []);

  // Global paste handler (Ctrl+V / Cmd+V anywhere on page)
  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      if (isProcessing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            handleFileProcess(blob);
            setPasteNotice('Pasted image from clipboard!');
            setTimeout(() => setPasteNotice(null), 3000);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isProcessing]);

  const handleFileProcess = async (file: File, suggestedPrompt?: string) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsCompressing(true);
      setCompressionProgress(25);
      const timer = setTimeout(() => setCompressionProgress(75), 100);

      const result = await compressImageClientSide(file);
      clearTimeout(timer);
      setCompressionProgress(100);

      setTimeout(() => {
        setIsCompressing(false);
        setCompressionProgress(0);
        onImageSelected(result, suggestedPrompt);
      }, 150);
    } catch (err: any) {
      setIsCompressing(false);
      alert(err.message || 'Failed to compress image.');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Manual paste button using Clipboard API
  const handleManualPaste = async () => {
    try {
      if (!navigator.clipboard?.read) {
        setPasteNotice('Press Ctrl+V or Cmd+V to paste an image');
        setTimeout(() => setPasteNotice(null), 3500);
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], 'clipboard-image.png', { type });
            handleFileProcess(file);
            setPasteNotice('Pasted from clipboard!');
            setTimeout(() => setPasteNotice(null), 2500);
            return;
          }
        }
      }
      setPasteNotice('No image found in clipboard. Copy an image and press Ctrl+V.');
      setTimeout(() => setPasteNotice(null), 3500);
    } catch (err) {
      setPasteNotice('Press Ctrl+V (or Cmd+V) directly to paste.');
      setTimeout(() => setPasteNotice(null), 3500);
    }
  };

  // Load sample image
  const handleSelectSample = async (sample: SampleImageItem) => {
    try {
      setIsCompressing(true);
      const res = await fetch(sample.fullDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${sample.id}-sample.jpg`, { type: 'image/jpeg' });
      handleFileProcess(file, sample.suggestedPrompt);
    } catch (err) {
      setIsCompressing(false);
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {/* Paste notification banner */}
      {pasteNotice && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-[#00DDCB]/10 border border-[#00DDCB]/40 text-[#00DDCB] text-xs font-inter flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Clipboard className="w-4 h-4" />
            <span>{pasteNotice}</span>
          </div>
          <span className="text-[10px] uppercase font-mono opacity-80">Clipboard Ready</span>
        </div>
      )}

      {/* Upload Zone Container */}
      {!currentImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragOver
              ? 'border-[#00DDCB] bg-[#00DDCB]/5 teal-glow scale-[1.008]'
              : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#00DDCB]/60 hover:bg-[#1E1E1E]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Compressing overlay */}
          {isCompressing && (
            <div className="absolute inset-0 bg-[#121212]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 p-6">
              <div className="w-12 h-12 rounded-full border-2 border-[#00DDCB] border-t-transparent animate-spin mb-3" />
              <span className="text-sm font-space font-bold text-white mb-1">
                Optimizing Image for AI (Max 1536px)...
              </span>
              <span className="text-xs font-inter text-[#8A8A8A]">
                Scaling and compressing locally in your browser
              </span>
            </div>
          )}

          {/* Icon badge */}
          <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#2A2A2A] flex items-center justify-center text-[#00DDCB] mb-4 group-hover:scale-105 transition-transform teal-glow-sm">
            <Upload className="w-8 h-8 stroke-[1.8]" />
          </div>

          {/* Main Title & Action */}
          <h3 className="text-lg sm:text-2xl font-space font-bold text-[#F5F5F5] mb-2 tracking-tight">
            Drop an image here, or{' '}
            <span className="text-[#00DDCB] underline decoration-[#00DDCB]/40 hover:decoration-[#00DDCB]">
              browse files
            </span>
          </h3>

          <p className="text-xs sm:text-sm font-inter text-[#8A8A8A] max-w-md mb-6 leading-relaxed">
            Drag &amp; drop, press <kbd className="px-1.5 py-0.5 rounded bg-[#121212] border border-[#2A2A2A] text-xs font-mono text-[#F5F5F5]">Ctrl+V</kbd> to paste, or click to upload.
            Supports PNG, JPG, WEBP.
          </p>

          {/* Quick action buttons inside zone */}
          <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-[#00DDCB] hover:bg-[#00c4b4] text-[#121212] font-space font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 teal-glow-sm"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose Image</span>
            </button>

            <button
              type="button"
              onClick={handleManualPaste}
              className="px-4 py-2.5 rounded-xl bg-[#121212] hover:bg-[#252525] border border-[#2A2A2A] hover:border-[#00DDCB]/40 text-[#F5F5F5] font-inter text-xs font-medium transition-colors flex items-center gap-2"
            >
              <Clipboard className="w-4 h-4 text-[#00DDCB]" />
              <span>Paste from Clipboard</span>
            </button>
          </div>

          {/* Privacy Guarantee callout */}
          <div className="mt-6 pt-5 border-t border-[#2A2A2A]/80 flex items-center gap-2 text-[11px] font-inter text-[#8A8A8A]">
            <ShieldCheck className="w-4 h-4 text-[#00DDCB]" />
            <span>Processed in-memory only. Zero images stored or logged.</span>
          </div>
        </div>
      ) : (
        /* Image Preview & Optimization Summary */
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl bg-[#121212] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={currentImage.dataUrl}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-space font-bold text-white text-sm truncate max-w-[220px]">
                    {currentImage.fileName || 'Uploaded Image'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00DDCB]/10 text-[#00DDCB] border border-[#00DDCB]/30">
                    READY FOR EDIT
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-inter text-[#8A8A8A] mt-1">
                  <span>
                    {currentImage.width} × {currentImage.height}px
                  </span>
                  <span>•</span>
                  <span>{formatBytes(currentImage.compressedSizeBytes)}</span>
                  {currentImage.originalSizeBytes > currentImage.compressedSizeBytes && (
                    <>
                      <span>•</span>
                      <span className="text-[#00DDCB] font-mono text-[11px]">
                        Saved{' '}
                        {Math.round(
                          (1 - currentImage.compressedSizeBytes / currentImage.originalSizeBytes) * 100
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: Change / Replace Image */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#121212] hover:bg-[#252525] border border-[#2A2A2A] text-xs font-inter font-medium text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={onClearImage}
                disabled={isProcessing}
                className="p-2 rounded-xl bg-[#121212] hover:bg-red-950/40 border border-[#2A2A2A] hover:border-red-800 text-[#8A8A8A] hover:text-[#FF7C6B] transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Image Preview Frame */}
          <div className="mt-4 relative rounded-xl overflow-hidden bg-[#121212] border border-[#2A2A2A] max-h-[460px] flex items-center justify-center">
            <img
              src={currentImage.dataUrl}
              alt="Current image preview"
              className="max-h-[460px] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* 1-Click Test Samples Row */}
      {!currentImage && samples.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00DDCB]" />
            <span className="text-xs font-space font-bold uppercase tracking-wider text-[#8A8A8A]">
              Or try with a sample template (1-click test)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {samples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="group p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] hover:border-[#00DDCB]/50 transition-all text-left flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#121212] border border-[#2A2A2A] mb-2 relative">
                  <img
                    src={sample.thumbnailUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-[#00DDCB] backdrop-blur-sm">
                    {sample.category}
                  </span>
                </div>

                <div className="font-space font-bold text-xs text-[#F5F5F5] group-hover:text-[#00DDCB] transition-colors truncate">
                  {sample.title}
                </div>
                <div className="text-[11px] font-inter text-[#8A8A8A] truncate mt-0.5">
                  {sample.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
