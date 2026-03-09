// Utility functions for image optimization

// Cached blur data URL to avoid regenerating on every call
let cachedBlurDataURL: string | null = null;

export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  if (cachedBlurDataURL) return cachedBlurDataURL;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  cachedBlurDataURL = canvas.toDataURL('image/jpeg', 0.1);
  return cachedBlurDataURL;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Multi-step image compression.
 * When scaling down significantly (>2×), we halve iteratively for sharper results
 * instead of a single large resize.
 */
export const compressImage = async (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Calculate target dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Multi-step downscale: halve iteratively until within 2× of target
      let srcCanvas = document.createElement('canvas');
      let srcCtx = srcCanvas.getContext('2d')!;
      srcCanvas.width = img.naturalWidth;
      srcCanvas.height = img.naturalHeight;
      srcCtx.drawImage(img, 0, 0);
      URL.revokeObjectURL(img.src);

      let currentW = img.naturalWidth;
      let currentH = img.naturalHeight;

      while (currentW > width * 2 || currentH > height * 2) {
        const nextW = Math.round(currentW / 2);
        const nextH = Math.round(currentH / 2);
        const stepCanvas = document.createElement('canvas');
        const stepCtx = stepCanvas.getContext('2d')!;
        stepCanvas.width = nextW;
        stepCanvas.height = nextH;
        stepCtx.imageSmoothingEnabled = true;
        stepCtx.imageSmoothingQuality = 'high';
        stepCtx.drawImage(srcCanvas, 0, 0, nextW, nextH);
        srcCanvas = stepCanvas;
        srcCtx = stepCtx;
        currentW = nextW;
        currentH = nextH;
      }

      // Final resize to exact target
      const finalCanvas = document.createElement('canvas');
      const finalCtx = finalCanvas.getContext('2d')!;
      finalCanvas.width = width;
      finalCanvas.height = height;
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      finalCtx.drawImage(srcCanvas, 0, 0, width, height);

      finalCanvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Failed to compress image'))),
        'image/jpeg',
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const createThumbnail = async (file: File, maxSize: number = 400): Promise<Blob> => {
  return compressImage(file, 0.7, maxSize, maxSize);
};
