
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { createCanvas, disposeCanvas } from './imageEditor/utils/canvasUtils';
import { loadAndScaleImage } from './imageEditor/utils/imageUtils';
import { useCanvasZoom } from './imageEditor/hooks/useCanvasZoom';
import { useCanvasCrop } from './imageEditor/hooks/useCanvasCrop';
import { useCanvasOperations } from './imageEditor/hooks/useCanvasOperations';

interface UseImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
}

export const useImageEditor = ({ imageUrl, isOpen }: UseImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);

  // Use specialized hooks for different concerns
  const { zoom, handleZoom, handleZoomIn, handleZoomOut, resetZoom } = useCanvasZoom(fabricCanvas);
  const { isCropMode, handleCrop, resetCropMode } = useCanvasCrop(fabricCanvas, originalImage);
  const { handleReset: resetCanvas, handleSave } = useCanvasOperations();

  useEffect(() => {
    if (!canvasRef.current || !isOpen || !imageUrl) return;

    console.log('Initializing canvas with image:', imageUrl);

    // Clean up existing canvas
    disposeCanvas(fabricCanvas);

    const canvas = createCanvas(canvasRef.current);
    setFabricCanvas(canvas);
    setOriginalImage(null);
    resetZoom();
    resetCropMode();

    // Load and scale the image
    loadAndScaleImage(imageUrl, canvas)
      .then((img) => {
        setOriginalImage(img);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });

    return () => {
      disposeCanvas(canvas);
    };
  }, [imageUrl, isOpen]);

  const handleResetWrapper = () => {
    resetCanvas(fabricCanvas, imageUrl, resetZoom, resetCropMode, setOriginalImage);
  };

  return {
    canvasRef,
    fabricCanvas,
    zoom,
    isCropMode,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    handleCrop,
    handleReset: handleResetWrapper,
    handleSave: () => handleSave(fabricCanvas),
  };
};
