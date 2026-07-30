'use client';

import React, { useEffect, useRef, useState } from 'react';

// Bayer 4x4 matrix normalized 0-1
const bayerMatrix = [
  [ 0/16,  8/16,  2/16, 10/16 ],
  [12/16,  4/16, 14/16,  6/16 ],
  [ 3/16, 11/16,  1/16,  9/16 ],
  [15/16,  7/16, 13/16,  5/16 ]
];

const adjustColor = (r: number, g: number, b: number, contrast: number, brightness: number, saturation: number) => {
  const c = contrast / 100;
  let newR = (r - 128) * c + 128 + brightness;
  let newG = (g - 128) * c + 128 + brightness;
  let newB = (b - 128) * c + 128 + brightness;

  const luma = 0.299 * newR + 0.587 * newG + 0.114 * newB;
  const s = saturation / 100;
  newR = luma + s * (newR - luma);
  newG = luma + s * (newG - luma);
  newB = luma + s * (newB - luma);

  return {
    r: Math.max(0, Math.min(255, newR)),
    g: Math.max(0, Math.min(255, newG)),
    b: Math.max(0, Math.min(255, newB))
  };
};

export default function AsciiEffectCanvas({ config, imageUrl }: { config: any, imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => setImageLoaded(img);
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = Date.now();
    let offCanvas: HTMLCanvasElement;
    let offCtx: CanvasRenderingContext2D | null = null;
    let imgData: Uint8ClampedArray;
    let cachedWidth = 0;
    let cachedHeight = 0;

    const resizeAndDraw = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        cachedWidth = width;
        cachedHeight = height;

        // Cache offscreen sampling canvas when resized
        offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          const imgRatio = imageLoaded.width / imageLoaded.height;
          const canvasRatio = width / height;
          let drawW = width, drawH = height, drawX = 0, drawY = 0;

          if (imgRatio > canvasRatio) {
            drawW = height * imgRatio;
            drawX = (width - drawW) / 2;
          } else {
            drawH = width / imgRatio;
            drawY = (height - drawH) / 2;
          }

          offCtx.drawImage(imageLoaded, drawX, drawY, drawW, drawH);
          imgData = offCtx.getImageData(0, 0, width, height).data;
        }
      }

      if (!offCtx || !imgData) return;

      const now = Date.now();
      const elapsed = now - startTime;

      ctx.fillStyle = config.bgMode === 'none' ? 'transparent' : '#000000';
      ctx.clearRect(0, 0, width, height);
      if (config.bgMode !== 'none') {
         ctx.fillRect(0, 0, width, height);
      }

      const cellSize = config.cellSize || 9;
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);

      const speed = (config.animSpeed?.intensity || 100) / 1000;
      const animIntensity = (config.animIntensity?.intensity || 60) / 100;
      const pulse = config.animStyle === 'pulse' ? (Math.sin(elapsed * 0.002 * speed) * 0.5 + 0.5) * animIntensity : 0;

      if (config.blurAmount > 0) {
        ctx.filter = `blur(${config.blurAmount / 10}px)`;
      } else {
        ctx.filter = 'none';
      }

      // Pre-calculate density threshold
      const densityThreshold = config.density / 100;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * cellSize;
          const py = y * cellSize;

          const cx = Math.floor(px + cellSize / 2);
          const cy = Math.floor(py + cellSize / 2);
          
          if (cx >= width || cy >= height) continue;
          
          const idx = (cy * width + cx) * 4;
          let r = imgData[idx];
          let g = imgData[idx + 1];
          let b = imgData[idx + 2];

          const adj = adjustColor(r, g, b, config.contrast, config.brightness, config.saturation);
          r = adj.r; g = adj.g; b = adj.b;

          const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          let invertLuma = config.invert ? 1 - luma : luma;
          
          if (config.animated) {
             invertLuma = Math.max(0, Math.min(1, invertLuma + pulse - (animIntensity / 2)));
          }

          if (config.renderMode === 'dither') {
            const bayerVal = bayerMatrix[x % 4][y % 4];
            
            if (invertLuma > bayerVal) {
               // Use density as a probability check per cell, or combined with luminance
               if (invertLuma > (1 - densityThreshold)) {
                 ctx.fillStyle = config.tint || `rgb(${r},${g},${b})`;
                 const drawSize = cellSize * (config.coverage / 100);
                 const offset = (cellSize - drawSize) / 2;
                 ctx.fillRect(px + offset, py + offset, drawSize, drawSize);
               }
            }
          } else {
             ctx.fillStyle = config.tint || `rgb(${r},${g},${b})`;
             const drawSize = cellSize * invertLuma * (config.coverage / 100);
             const offset = (cellSize - drawSize) / 2;
             ctx.fillRect(px + offset, py + offset, drawSize, drawSize);
          }
        }
      }

      if (config.animated) {
        animationFrameId = requestAnimationFrame(resizeAndDraw);
      }
    };

    resizeAndDraw();
    window.addEventListener('resize', resizeAndDraw);

    return () => {
      window.removeEventListener('resize', resizeAndDraw);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [imageLoaded, config]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
      <canvas ref={canvasRef} className="w-full h-full" style={{ mixBlendMode: 'screen', opacity: 0.9 }} />
    </div>
  );
}
