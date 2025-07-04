
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Crop, RotateCcw } from 'lucide-react';

interface ImageEditorToolbarProps {
  zoom: number[];
  isCropMode: boolean;
  onZoom: (value: number[]) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCrop: () => void;
  onReset: () => void;
}

export const ImageEditorToolbar: React.FC<ImageEditorToolbarProps> = ({
  zoom,
  isCropMode,
  onZoom,
  onZoomIn,
  onZoomOut,
  onCrop,
  onReset,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
        >
          <ZoomOut size={16} />
        </Button>
        
        <div className="w-32">
          <Slider
            value={zoom}
            onValueChange={onZoom}
            min={25}
            max={200}
            step={25}
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
        >
          <ZoomIn size={16} />
        </Button>
        
        <span className="text-sm text-gray-600">{zoom[0]}%</span>
      </div>
      
      <Button
        variant={isCropMode ? "default" : "outline"}
        size="sm"
        onClick={onCrop}
      >
        <Crop size={16} className="mr-1" />
        {isCropMode ? "Apply Crop" : "Crop"}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
      >
        <RotateCcw size={16} className="mr-1" />
        Reset
      </Button>
    </div>
  );
};
