/**
 * Image quality analysis utilities for listing uploads.
 * Provides resolution checks and basic blur detection using
 * Laplacian variance on canvas pixel data.
 */

export type QualityLevel = 'low' | 'medium' | 'great';

export interface ImageQualityResult {
  level: QualityLevel;
  score: number; // 0-100
  issues: string[];
}

/** Minimum dimensions for acceptable listing photos */
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const GOOD_WIDTH = 800;
const GOOD_HEIGHT = 800;

/**
 * Analyse a single image for quality (resolution + sharpness).
 * Runs entirely client-side via OffscreenCanvas / HTMLCanvasElement.
 */
export function analyzeImageQuality(file: File): Promise<ImageQualityResult> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const issues: string[] = [];
      let score = 100;

      // --- Resolution check ---
      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        issues.push('Resolution too low – aim for at least 800×800');
        score -= 40;
      } else if (img.width < GOOD_WIDTH || img.height < GOOD_HEIGHT) {
        issues.push('Higher resolution recommended');
        score -= 15;
      }

      // --- File size heuristic (very small files are often low-quality) ---
      if (file.size < 30_000 && img.width >= MIN_WIDTH) {
        issues.push('Image may be heavily compressed');
        score -= 10;
      }

      // --- Blur detection via Laplacian variance ---
      try {
        const variance = computeLaplacianVariance(img);
        if (variance < 50) {
          issues.push('Image appears blurry');
          score -= 35;
        } else if (variance < 150) {
          issues.push('Image could be sharper');
          score -= 10;
        }
      } catch {
        // Canvas may fail on some browsers – skip blur check
      }

      URL.revokeObjectURL(url);

      score = Math.max(0, Math.min(100, score));
      const level: QualityLevel =
        score >= 75 ? 'great' : score >= 45 ? 'medium' : 'low';

      resolve({ level, score, issues });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ level: 'medium', score: 50, issues: ['Could not analyse image'] });
    };

    img.src = url;
  });
}

/**
 * Compute Laplacian variance on a down-sampled version of the image.
 * Higher variance → sharper image.
 */
function computeLaplacianVariance(img: HTMLImageElement): number {
  const MAX_DIM = 200; // down-sample for performance
  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);

  // Convert to grayscale
  const gray = new Float32Array(w * h);
  for (let i = 0; i < gray.length; i++) {
    const off = i * 4;
    gray[i] = 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
  }

  // Apply 3×3 Laplacian kernel [0,1,0; 1,-4,1; 0,1,0]
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const lap =
        gray[idx - w] +
        gray[idx - 1] +
        -4 * gray[idx] +
        gray[idx + 1] +
        gray[idx + w];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  const mean = sum / count;
  return sumSq / count - mean * mean; // variance
}
