import { useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';

export const useCanvasCrop = (
  fabricCanvas: FabricCanvas | null,
  originalImage: FabricImage | null
) => {
  const [isCropMode, setIsCropMode] = useState(false);

  const handleCrop = () => {
    if (!fabricCanvas || !originalImage) return;
    
    console.log('Crop mode:', isCropMode);
    
    if (isCropMode) {
      // Apply crop - export the visible area
      const dataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.9,
        multiplier: 1,
      });
      setIsCropMode(false);
      // Make image selectable again
      originalImage.set({ selectable: true });
      fabricCanvas.renderAll();
      console.log('Crop applied, returning dataURL');
      return dataURL;
    } else {
      setIsCropMode(true);
      // Make image non-selectable in crop mode
      originalImage.set({ selectable: false });
      fabricCanvas.renderAll();
      console.log('Entering crop mode');
      return null;
    }
  };

  const resetCropMode = () => {
    setIsCropMode(false);
  };

  return {
    isCropMode,
    handleCrop,
    resetCropMode,
  };
};