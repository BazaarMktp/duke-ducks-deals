
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, Crop, RotateCcw, Check, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, isOpen, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState([100]);
  const [isCropMode, setIsCropMode] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#ffffff',
    });

    // Load the image
    FabricImage.fromURL(imageUrl).then((img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgWidth = img.width!;
      const imgHeight = img.height!;
      
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      img.scale(scale);
      
      // Center the image
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
      });
      
      canvas.add(img);
      canvas.renderAll();
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
      onSave(dataURL);
      onClose();
    } else {
      setIsCropMode(true);
      // Add crop overlay or visual indicator
      fabricCanvas.renderAll();
    }
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    setZoom([100]);
    setIsCropMode(false);
    
    // Reload the original image
    FabricImage.fromURL(imageUrl).then((img) => {
      const canvasWidth = fabricCanvas.getWidth();
      const canvasHeight = fabricCanvas.getHeight();
      const imgWidth = img.width!;
      const imgHeight = img.height!;
      
      const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      img.scale(scale);
      
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
      });
      
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier: 1,
    });
    onSave(dataURL);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
              >
                <ZoomOut size={16} />
              </Button>
              
              <div className="w-32">
                <Slider
                  value={zoom}
                  onValueChange={handleZoom}
                  min={25}
                  max={200}
                  step={25}
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
              >
                <ZoomIn size={16} />
              </Button>
              
              <span className="text-sm text-gray-600">{zoom[0]}%</span>
            </div>
            
            <Button
              variant={isCropMode ? "default" : "outline"}
              size="sm"
              onClick={handleCrop}
            >
              <Crop size={16} className="mr-1" />
              {isCropMode ? "Apply Crop" : "Crop"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <RotateCcw size={16} className="mr-1" />
              Reset
            </Button>
          </div>
          
          {/* Canvas */}
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              <X size={16} className="mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check size={16} className="mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
