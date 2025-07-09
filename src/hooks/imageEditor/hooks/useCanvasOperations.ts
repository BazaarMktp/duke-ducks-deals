import { Canvas as FabricCanvas, Point } from 'fabric';
import { loadAndScaleImage } from '../utils/imageUtils';
import { getCanvasCenter } from '../utils/canvasUtils';

export const useCanvasOperations = () => {
  const handleReset = async (
    fabricCanvas: FabricCanvas | null,
    imageUrl: string,
    resetZoom: () => void,
    resetCropMode: () => void,
    setOriginalImage: (img: any) => void
  ) => {
    if (!fabricCanvas || !imageUrl) return;
    
    console.log('Resetting canvas');
    fabricCanvas.clear();
    resetZoom();
    resetCropMode();
    
    // Reset zoom to 1 using Point constructor
    const center = getCanvasCenter(fabricCanvas);
    fabricCanvas.zoomToPoint(new Point(center.left, center.top), 1);
    
    try {
      const img = await loadAndScaleImage(imageUrl, fabricCanvas);
      setOriginalImage(img);
      console.log('Canvas reset complete');
    } catch (error) {
      console.error('Error reloading image:', error);
    }
  };

  const handleSave = (fabricCanvas: FabricCanvas | null) => {
    if (!fabricCanvas) return;
    
    console.log('Saving canvas');
    const dataURL = fabricCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier: 1,
    });
    return dataURL;
  };

  return {
    handleReset,
    handleSave,
  };
};