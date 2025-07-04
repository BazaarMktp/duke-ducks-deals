
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useImageEditor } from '@/hooks/useImageEditor';
import { ImageEditorToolbar } from './ImageEditor/ImageEditorToolbar';
import { ImageEditorCanvas } from './ImageEditor/ImageEditorCanvas';
import { ImageEditorActions } from './ImageEditor/ImageEditorActions';

interface ImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, isOpen, onClose, onSave }) => {
  const {
    canvasRef,
    zoom,
    isCropMode,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    handleCrop,
    handleReset,
    handleSave,
  } = useImageEditor({ imageUrl, isOpen });

  const onCropClick = () => {
    const dataURL = handleCrop();
    if (dataURL) {
      onSave(dataURL);
      onClose();
    }
  };

  const onSaveClick = () => {
    const dataURL = handleSave();
    if (dataURL) {
      onSave(dataURL);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ImageEditorToolbar
            zoom={zoom}
            isCropMode={isCropMode}
            onZoom={handleZoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onCrop={onCropClick}
            onReset={handleReset}
          />
          
          <ImageEditorCanvas canvasRef={canvasRef} />
          
          <ImageEditorActions
            onCancel={onClose}
            onSave={onSaveClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditor;
