
import React from 'react';

interface ImageEditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const ImageEditorCanvas: React.FC<ImageEditorCanvasProps> = ({ canvasRef }) => {
  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
    </div>
  );
};
