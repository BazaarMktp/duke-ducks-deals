import { useState } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
import { getCanvasCenter } from '../utils/canvasUtils';

export const useCanvasZoom = (fabricCanvas: FabricCanvas | null) => {
  const [zoom, setZoom] = useState([100]);

  const handleZoom = (value: number[]) => {
    if (!fabricCanvas) return;
    
    console.log('Applying zoom:', value[0]);
    const zoomValue = value[0] / 100;
    setZoom(value);
    
    // Get the canvas center
    const center = getCanvasCenter(fabricCanvas);
    
    // Apply zoom from center using Point constructor
    fabricCanvas.zoomToPoint(new Point(center.left, center.top), zoomValue);
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

  const resetZoom = () => {
    setZoom([100]);
  };

  return {
    zoom,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
  };
};