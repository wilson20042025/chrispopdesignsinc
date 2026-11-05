export type CompressionPreset = 'web' | 'high' | 'compact' | 'original';

export interface CompressionOptions {
  preset?: CompressionPreset;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg';
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  width: number;
  height: number;
}

const PRESET_CONFIGS: Record<Exclude<CompressionPreset, 'original'>, { maxWidth: number; maxHeight: number; quality: number }> = {
  web: {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.82,
  },
  high: {
    maxWidth: 2560,
    maxHeight: 2560,
    quality: 0.88,
  },
  compact: {
    maxWidth: 1280,
    maxHeight: 1280,
    quality: 0.75,
  },
};

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * This runs client-side before upload, reducing a 15MB file down to ~200KB in milliseconds
 * and preventing Vercel's 4.5MB payload limit error.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const originalSize = file.size;

  // If user selected original or file is not an image (e.g. svg, gif), return as-is
  if (
    options.preset === 'original' ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savingsPercent: 0,
      width: 0,
      height: 0,
    };
  }

  const preset = options.preset || 'web';
  const config = PRESET_CONFIGS[preset] || PRESET_CONFIGS.web;

  const maxWidth = options.maxWidth || config.maxWidth;
  const maxHeight = options.maxHeight || config.maxHeight;
  const quality = options.quality !== undefined ? options.quality : config.quality;
  const format = options.format || 'image/webp';

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale down
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If 2d context fails, fallback to original
          resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            savingsPercent: 0,
            width: img.width,
            height: img.height,
          });
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                savingsPercent: 0,
                width,
                height,
              });
              return;
            }

            // If compressed blob is somehow larger than original, keep original
            if (blob.size >= originalSize) {
              resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                savingsPercent: 0,
                width: img.width,
                height: img.height,
              });
              return;
            }

            // Create new File with appropriate extension
            const ext = format === 'image/webp' ? '.webp' : '.jpg';
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const compressedFileName = `${baseName}${ext}`;

            const compressedFile = new File([blob], compressedFileName, {
              type: format,
              lastModified: Date.now(),
            });

            const savingsPercent = Math.max(
              0,
              Math.round(((originalSize - blob.size) / originalSize) * 100)
            );

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: blob.size,
              savingsPercent,
              width,
              height,
            });
          },
          format,
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          savingsPercent: 0,
          width: 0,
          height: 0,
        });
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        savingsPercent: 0,
        width: 0,
        height: 0,
      });
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human readable string (KB, MB).
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
