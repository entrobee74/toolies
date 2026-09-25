/**
 * PIXELTEXT — Client-side Image Compression Engine
 * Compresses images to max 1536px longest side before upload using HTML5 Canvas
 * Target format: JPEG / PNG with quality 0.85 per tech specification
 */

export interface CompressionResult {
  file: File;
  blob: Blob;
  dataUrl: string;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  mimeType: string;
  fileName: string;
}

const MAX_LONGEST_SIDE = 1536;
const DEFAULT_QUALITY = 0.85;

export async function compressImageClientSide(file: File): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Unsupported file format. Please upload a PNG, JPEG, or WEBP image.'));
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      // Calculate scale to preserve aspect ratio under 1536px longest side
      const longestSide = Math.max(originalWidth, originalHeight);
      if (longestSide > MAX_LONGEST_SIDE) {
        const scale = MAX_LONGEST_SIDE / longestSide;
        targetWidth = Math.round(originalWidth * scale);
        targetHeight = Math.round(originalHeight * scale);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Canvas 2D context unavailable'));
      }

      // Draw image with smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Determine output mime type (keep PNG if original has transparency, else JPEG)
      const isPng = file.type === 'image/png';
      const outputMime = isPng ? 'image/png' : 'image/jpeg';
      const quality = isPng ? undefined : DEFAULT_QUALITY;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Image compression failed'));
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const compressedFile = new File([blob], file.name, {
              type: outputMime,
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              blob,
              dataUrl,
              originalWidth,
              originalHeight,
              width: targetWidth,
              height: targetHeight,
              originalSizeBytes: file.size,
              compressedSizeBytes: blob.size,
              mimeType: outputMime,
              fileName: file.name,
            });
          };
          reader.onerror = () => reject(new Error('Failed to read compressed image data'));
          reader.readAsDataURL(blob);
        },
        outputMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image. File may be corrupted.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Format bytes to readable string (e.g. 1.4 MB, 450 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
