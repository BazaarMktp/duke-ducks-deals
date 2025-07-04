
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ImageEditorActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

export const ImageEditorActions: React.FC<ImageEditorActionsProps> = ({
  onCancel,
  onSave,
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>
        <X size={16} className="mr-1" />
        Cancel
      </Button>
      <Button onClick={onSave}>
        <Check size={16} className="mr-1" />
        Save Changes
      </Button>
    </div>
  );
};
