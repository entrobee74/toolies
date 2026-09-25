/**
 * PIXELTEXT — Main Application View
 * Integrated with /api/edit Serverless Endpoint, Gemini 2.5 Flash Image,
 * Before/After Split Slider, and hardened security guards.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Wand2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { UploadZone } from './UploadZone';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CompressionResult } from '../../utils/imageCompressor';
import { AdPlacement } from '../AdPlacement';
import { AAdsUnit } from '../AAdsUnit';

export const PixelTextView: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<CompressionResult | null>(null);
  const [instruction, setInstruction] = useState('');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  // Editing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingEdits, setRemainingEdits] = useState<number | null>(null);

  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const examplePrompts = [
    'Change the main headline to "OPEN 24/7", keep the exact same font and glow',
    'Fix typo: change "reciept" to "receipt", match original font and color',
    'Translate the sign text to Spanish, preserve lighting and texture',
    'Replace the discount text with "SPECIAL OFFER 40% OFF"',
    'Remove the watermark text cleanly without blurring the background',
  ];

  const loadingSteps = [
    'Analyzing image composition & existing font styles...',
    'Matching font family, weight, perspective & lighting...',
    'Rendering modified text into background with Nano Banana...',
    'Finalizing pixels & preparing output...',
  ];

  useEffect(() => {
    if (isProcessing) {
      setLoadingStep(0);
      let step = 0;
      stepTimerRef.current = setInterval(() => {
        step = (step + 1) % loadingSteps.length;
        setLoadingStep(step);
      }, 3000);
    } else {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    }
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isProcessing]);

  const handleImageSelected = (compressed: CompressionResult, suggestedPrompt?: string) => {
    setCurrentImage(compressed);
    setEditedImageUrl(null);
    setErrorMessage(null);
    if (suggestedPrompt) {
      setInstruction(suggestedPrompt);
      setSelectedExample(suggestedPrompt);
    }
  };

  const handleClearImage = () => {
    setCurrentImage(null);
    setEditedImageUrl(null);
    setInstruction('');
    setSelectedExample(null);
    setErrorMessage(null);
  };

  const handleSelectExample = (prompt: string) => {
    setInstruction(prompt);
    setSelectedExample(prompt);
  };

  // Trigger AI Text Edit via /api/edit
  const handleApplyEdit = async () => {
    if (!currentImage) {
      setErrorMessage('Please upload an image first.');
      return;
    }

    const trimmed = instruction.trim();
    if (!trimmed) {
      setErrorMessage('Please provide an instruction for what text to edit or replace.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: currentImage.dataUrl,
          instruction: trimmed,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Specific friendly error messages per status
        if (response.status === 500 && data?.error?.includes('missing the Gemini API key')) {
          setErrorMessage('Tool is not configured yet. Try again shortly.');
        } else if (response.status === 429) {
          setErrorMessage('Daily limit reached (10 edits/day). Try again tomorrow.');
        } else if (response.status === 503) {
          setErrorMessage('Rate limit service is temporarily unavailable. Request failed closed for security.');
        } else if (response.status === 413) {
          setErrorMessage('Image payload exceeds 5MB limit. Please upload a smaller image.');
        } else if (response.status === 403) {
          setErrorMessage('Cross-origin request blocked by same-origin security policy.');
        } else {
          setErrorMessage(data?.error || `Edit request failed (Status ${response.status}).`);
        }
        setIsProcessing(false);
        return;
      }

      if (data && data.editedImage) {
        setEditedImageUrl(data.editedImage);
        if (typeof data.remainingEdits === 'number') {
          setRemainingEdits(data.remainingEdits);
        }
      } else {
        setErrorMessage(data?.error || 'AI did not return an edited image. Please try adjusting your instruction.');
      }
    } catch {
      // Do not log image or instruction data to console
      setErrorMessage('Network error connecting to edit service. Please check your connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full font-inter text-[#F5F5F5]">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-mono text-[#00DDCB] mb-4 teal-glow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED IN-IMAGE TYPOGRAPHY EDITING</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-space font-extrabold text-[#F5F5F5] tracking-tight leading-tight">
          Edit the Text in Any Image —{' '}
          <span className="text-[#00DDCB]">Free, No Signup</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base font-inter text-[#8A8A8A] max-w-2xl mx-auto leading-relaxed">
          Upload an image, type what the text should say, and let AI replace words while preserving the exact font, size, lighting, perspective, and background.
        </p>
      </div>

      {/* Main Tool Container (Front & Center) */}
      <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-7 shadow-2xl relative">
        {/* If result is ready: Show Before/After Slider */}
        {editedImageUrl && currentImage ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00DDCB]/10 border border-[#00DDCB]/40 flex items-center justify-center text-[#00DDCB]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-base text-white">
                    Text Edit Complete!
                  </h3>
                  <p className="text-xs font-inter text-gray-400">
                    Compare original with AI output below
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {remainingEdits !== null && (
                  <span className="text-[11px] font-mono text-[#00DDCB] px-2 py-0.5 rounded bg-[#00DDCB]/10 border border-[#00DDCB]/30 hidden sm:inline">
                    {remainingEdits} edits remaining today
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setEditedImageUrl(null)}
                  className="px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-[#252525] border border-[#2A2A2A] text-xs font-inter font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Edit Again</span>
                </button>
              </div>
            </div>

            {/* Before/After Split Comparison Slider */}
            <BeforeAfterSlider
              originalUrl={currentImage.dataUrl}
              editedUrl={editedImageUrl}
              fileName={currentImage.fileName}
            />

            {/* Bottom action: upload new image */}
            <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex justify-between items-center text-xs text-gray-400">
              <span>Instruction used: "{instruction}"</span>
              <button
                type="button"
                onClick={handleClearImage}
                className="text-[#00DDCB] hover:underline font-space font-bold"
              >
                Upload another image
              </button>
            </div>
          </div>
        ) : (
          /* Normal Tool Flow: Upload -> Instruction -> Run */
          <div>
            {/* Step 1: Upload Zone */}
            <UploadZone
              currentImage={currentImage}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
              isProcessing={isProcessing}
            />

            {/* Step 2: Instruction Input (Appears when image is ready) */}
            {currentImage && (
              <div className="mt-6 pt-6 border-t border-[#2A2A2A] animate-in fade-in duration-300">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-space font-bold uppercase tracking-wider text-[#F5F5F5] flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-[#00DDCB]" />
                    <span>Text Replacement Instruction</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#8A8A8A]">
                    Max 500 chars • Preserves font &amp; style
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={500}
                    disabled={isProcessing}
                    value={instruction}
                    onChange={(e) => {
                      setInstruction(e.target.value);
                      setSelectedExample(null);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder='e.g. "Change the headline to OPEN 24/7, keep the same bold font and neon glow"'
                    className="w-full bg-[#121212] border border-[#2A2A2A] focus:border-[#00DDCB] rounded-xl p-3.5 text-sm font-inter text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00DDCB] transition-all resize-none disabled:opacity-50"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-gray-500">
                    {instruction.length}/500
                  </div>
                </div>

                {/* Example Prompt Chips */}
                <div className="mt-3">
                  <span className="text-[11px] font-space font-semibold text-[#8A8A8A] uppercase tracking-wider block mb-1.5">
                    Quick prompt inspirations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {examplePrompts.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleSelectExample(ex)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-inter transition-all text-left truncate max-w-full ${
                          selectedExample === ex
                            ? 'bg-[#00DDCB] text-[#121212] font-semibold font-space'
                            : 'bg-[#121212] hover:bg-[#252525] border border-[#2A2A2A] text-gray-300 hover:text-white'
                        }`}
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-inter flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#FF7C6B] mt-0.5" />
                    <div className="flex-1">
                      <span className="font-space font-bold block text-white">Action Required</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Processing Overlay / Loading State */}
                {isProcessing && (
                  <div className="mt-4 p-5 rounded-xl bg-[#121212] border border-[#00DDCB]/40 flex flex-col items-center justify-center text-center teal-glow-sm animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-full border-2 border-[#00DDCB] border-t-transparent animate-spin mb-3" />
                    <div className="font-space font-bold text-sm text-white mb-1 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#00DDCB]" />
                      <span>Editing Typography with Gemini Nano Banana</span>
                    </div>
                    <p className="text-xs font-inter text-[#00DDCB] transition-all">
                      {loadingSteps[loadingStep]}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Estimated processing time: 5–15 seconds</span>
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2A2A2A]">
                  <div className="flex items-center gap-2 text-xs font-inter text-[#8A8A8A]">
                    <ShieldCheck className="w-4 h-4 text-[#00DDCB]" />
                    <span>Compressed to {currentImage.width}×{currentImage.height}px • Max 5MB payload</span>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleApplyEdit}
                    className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-space font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isProcessing
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-[#00DDCB] hover:bg-[#00c4b4] text-[#121212] teal-glow'
                    }`}
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{isProcessing ? 'Processing Image...' : 'Apply Text Edit (AI Engine)'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* A-ADS Crypto Display Unit 2456332 */}
      <AAdsUnit />

      {/* Ad Unit Below Tool Results (Reserved slot with 0 CLS) */}
      <AdPlacement slot="leaderboard" className="mt-4" />

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto my-14">
        <div className="text-center mb-8">
          <span className="text-xs font-space font-bold uppercase tracking-wider text-[#00DDCB]">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-space font-bold text-white mt-1">
            How PixelText Edits Text in Photos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#00DDCB]/10 border border-[#00DDCB]/30 flex items-center justify-center text-[#00DDCB] font-space font-black text-lg mb-4">
              01
            </div>
            <h3 className="font-space font-bold text-base text-white mb-1.5">
              Upload Any Image
            </h3>
            <p className="text-xs font-inter text-[#8A8A8A] leading-relaxed">
              Drag and drop, click to browse, or paste directly from your clipboard. The image is compressed in your browser to optimize upload speed.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#00DDCB]/10 border border-[#00DDCB]/30 flex items-center justify-center text-[#00DDCB] font-space font-black text-lg mb-4">
              02
            </div>
            <h3 className="font-space font-bold text-base text-white mb-1.5">
              Type the Replacement
            </h3>
            <p className="text-xs font-inter text-[#8A8A8A] leading-relaxed">
              Specify what words to change or insert. The AI analyzes the font family, thickness, angle, shadows, and surface texture.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#FF7C6B]/10 border border-[#FF7C6B]/30 flex items-center justify-center text-[#FF7C6B] font-space font-black text-lg mb-4">
              03
            </div>
            <h3 className="font-space font-bold text-base text-white mb-1.5">
              Download Flawless Output
            </h3>
            <p className="text-xs font-inter text-[#8A8A8A] leading-relaxed">
              Inspect the result with our interactive before/after split slider, then download watermark-free PNG or JPG files immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Use Cases Section (Required for AdSense & Organic Search) */}
      <section className="max-w-4xl mx-auto my-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-space font-bold uppercase tracking-wider text-[#00DDCB]">
              Real-World Use Cases
            </span>
            <h2 className="text-xl sm:text-2xl font-space font-bold text-white mt-0.5">
              What Traders, Creators &amp; Designers Use PixelText For
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
          <div className="p-4 rounded-xl bg-[#121212] border border-[#2A2A2A]">
            <h4 className="font-space font-bold text-sm text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00DDCB]" />
              Product Packaging &amp; Mockups
            </h4>
            <p className="text-[#8A8A8A] leading-relaxed">
              Update nutrition facts, brand titles, net weights, and slogan typography on existing product mockups without re-rendering in 3D software.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-[#2A2A2A]">
            <h4 className="font-space font-bold text-sm text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00DDCB]" />
              Meme Text Swaps &amp; Social Content
            </h4>
            <p className="text-[#8A8A8A] leading-relaxed">
              Quickly alter viral meme captions, Twitter screenshots, or Discord templates with pristine font replication and zero blur.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-[#2A2A2A]">
            <h4 className="font-space font-bold text-sm text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00DDCB]" />
              Storefront Signs &amp; Billboards
            </h4>
            <p className="text-[#8A8A8A] leading-relaxed">
              Replace business names on real-world storefront photos, outdoor banners, and street signs with realistic perspective and depth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121212] border border-[#2A2A2A]">
            <h4 className="font-space font-bold text-sm text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00DDCB]" />
              Event Flyers &amp; Discount Badges
            </h4>
            <p className="text-[#8A8A8A] leading-relaxed">
              Modify dates, venue addresses, and pricing percentages on existing promotional posters when original PSD project files are lost.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & Zero-Retention Notice */}
      <div className="max-w-4xl mx-auto my-8 p-4 rounded-xl bg-[#121212] border border-[#2A2A2A] flex items-center gap-3 text-xs text-[#8A8A8A]">
        <ShieldCheck className="w-5 h-5 text-[#00DDCB] shrink-0" />
        <div>
          <strong className="text-white block font-space">
            Privacy First Architecture: Processed in memory only
          </strong>
          <span>
            PixelText does not store or log uploaded images. Every file is compressed locally on your device, sent over encrypted SSL, and auto-discards immediately.
          </span>
        </div>
      </div>
    </div>
  );
};
