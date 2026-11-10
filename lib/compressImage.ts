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

  // Detect image type via MIME type or file extension (Windows inputs often leave file.type empty)
  const isImageByName = /\.(jpe?g|png|webp|bmp|tiff|heic|heif)$/i.test(file.name || '');
  const isImageByType = file.type ? file.type.startsWith('image/') : false;
  const isSvgOrGif = file.type === 'image/svg+xml' || file.type === 'image/gif' || /\.(svg|gif)$/i.test(file.name || '');

  // If user selected original, or file is not a compressible image, return as-is
  if (options.preset === 'original' || (!isImageByType && !isImageByName) || isSvgOrGif) {
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
  const targetFormat = options.format || 'image/webp';

  return new Promise((resolve) => {
    // Safety timer: if compression ever hangs, fallback to original file
    let hasResolved = false;
    const safeResolve = (result: CompressionResult) => {
      if (!hasResolved) {
        hasResolved = true;
        resolve(result);
      }
    };

    const timeout = setTimeout(() => {
      safeResolve({
        file,
        originalSize,
        compressedSize: originalSize,
        savingsPercent: 0,
        width: 0,
        height: 0,
      });
    }, 7000);

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

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
        safeResolve({
          file,
          originalSize,
          compressedSize: originalSize,
          savingsPercent: 0,
          width,
          height,
        });
        return;
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export canvas to blob with WebP -> JPEG fallback
      const exportToBlob = (
        format: string,
        callback: (blob: Blob | null, usedFormat: string) => void
      ) => {
        try {
          canvas.toBlob(
            (b) => {
              if (!b && format !== 'image/jpeg') {
                try {
                  canvas.toBlob((fb) => callback(fb, 'image/jpeg'), 'image/jpeg', quality);
                } catch {
                  callback(null, format);
                }
              } else {
                callback(b, format);
              }
            },
            format,
            quality
          );
        } catch {
          if (format !== 'image/jpeg') {
            try {
              canvas.toBlob((fb) => callback(fb, 'image/jpeg'), 'image/jpeg', quality);
            } catch {
              callback(null, format);
            }
          } else {
            callback(null, format);
          }
        }
      };

      exportToBlob(targetFormat, (blob, finalFormat) => {
        if (!blob) {
          safeResolve({
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
          safeResolve({
            file,
            originalSize,
            compressedSize: originalSize,
            savingsPercent: 0,
            width,
            height,
          });
          return;
        }

        const ext = finalFormat === 'image/webp' ? '.webp' : '.jpg';
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const compressedFileName = `${baseName}${ext}`;

        const compressedFile = new File([blob], compressedFileName, {
          type: finalFormat,
          lastModified: Date.now(),
        });

        const savingsPercent = Math.max(
          0,
          Math.round(((originalSize - blob.size) / originalSize) * 100)
        );

        safeResolve({
          file: compressedFile,
          originalSize,
          compressedSize: blob.size,
          savingsPercent,
          width,
          height,
        });
      });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);
      safeResolve({
        file,
        originalSize,
        compressedSize: originalSize,
        savingsPercent: 0,
        width: 0,
        height: 0,
      });
    };

    img.src = objectUrl;
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
