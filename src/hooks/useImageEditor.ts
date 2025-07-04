
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
    if (!canvasRef.current || !isOpen) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#ffffff',
    });

    // Load the image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      img.scale(scale);
      
      // Center the image
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
      });
      
      canvas.add(img);
      canvas.renderAll();
      setOriginalImage(img);
    }).catch((error) => {
      console.error('Error loading image:', error);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [imageUrl, isOpen]);

  const handleZoom = (value: number[]) => {
    if (!fabricCanvas) return;
    const zoomValue = value[0] / 100;
    setZoom(value);
    fabricCanvas.setZoom(zoomValue);
    fabricCanvas.renderAll();
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom[0] + 25, 200);
    handleZoom([newZoom]);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom[0] - 25, 25);
    handleZoom([newZoom]);
  };

  const handleCrop = () => {
    if (!fabricCanvas) return;
    
    if (isCropMode) {
      // Apply crop - export the visible area
      const dataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.9,
        multiplier: 1,
      });
      setIsCropMode(false);
      return dataURL;
    } else {
      setIsCropMode(true);
      fabricCanvas.renderAll();
      return null;
    }
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    setZoom([100]);
    setIsCropMode(false);
    fabricCanvas.setZoom(1);
    
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
      });
      
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
      setOriginalImage(img);
    }).catch((error) => {
      console.error('Error reloading image:', error);
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
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
