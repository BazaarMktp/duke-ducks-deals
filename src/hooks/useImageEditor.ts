
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';

interface UseImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
}

export const useImageEditor = ({ imageUrl, isOpen }: UseImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState([100]);
  const [isCropMode, setIsCropMode] = useState(false);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !isOpen || !imageUrl) return;

    console.log('Initializing canvas with image:', imageUrl);

    // Dispose of existing canvas if any
    if (fabricCanvas) {
      fabricCanvas.dispose();
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#ffffff',
    });

    // Load the image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      console.log('Image loaded successfully:', img);
      
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      
      console.log('Canvas dimensions:', canvasWidth, canvasHeight);
      console.log('Image dimensions:', imgWidth, imgHeight);
      
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      img.scale(scale);
      
      // Center the image
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
        selectable: true,
      });
      
      canvas.add(img);
      canvas.renderAll();
      setOriginalImage(img);
      console.log('Image added to canvas');
    }).catch((error) => {
      console.error('Error loading image:', error);
    });

    setFabricCanvas(canvas);

    return () => {
      console.log('Disposing canvas');
      canvas.dispose();
    };
  }, [imageUrl, isOpen]); // Removed isCropMode from dependencies

  const handleZoom = (value: number[]) => {
    if (!fabricCanvas || !originalImage) return;
    
    console.log('Applying zoom:', value[0]);
    const zoomValue = value[0] / 100;
    setZoom(value);
    
    // Get the canvas center
    const center = fabricCanvas.getCenter();
    
    // Apply zoom from center
    fabricCanvas.zoomToPoint({ x: center.left, y: center.top }, zoomValue);
    fabricCanvas.renderAll();
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom[0] + 25, 200);
    console.log('Zoom in to:', newZoom);
    handleZoom([newZoom]);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom[0] - 25, 25);
    console.log('Zoom out to:', newZoom);
    handleZoom([newZoom]);
  };

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

  const handleReset = () => {
    if (!fabricCanvas || !imageUrl) return;
    
    console.log('Resetting canvas');
    fabricCanvas.clear();
    setZoom([100]);
    setIsCropMode(false);
    
    // Reset zoom to 1
    const center = fabricCanvas.getCenter();
    fabricCanvas.zoomToPoint({ x: center.left, y: center.top }, 1);
    
    // Reload the original image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      const canvasWidth = fabricCanvas.getWidth();
      const canvasHeight = fabricCanvas.getHeight();
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      img.scale(scale);
      
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
        selectable: true,
      });
      
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
      setOriginalImage(img);
      console.log('Canvas reset complete');
    }).catch((error) => {
      console.error('Error reloading image:', error);
    });
  };

  const handleSave = () => {
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
    canvasRef,
    fabricCanvas,
    zoom,
    isCropMode,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    handleCrop,
    handleReset,
    handleSave,
  };
};
