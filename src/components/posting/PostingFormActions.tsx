
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface PostingFormActionsProps {
  loading: boolean;
  listingType: 'offer' | 'wanted';
  onClose: () => void;
  saveAsDefault: boolean;
  onSaveAsDefaultChange: (checked: boolean) => void;
}

const PostingFormActions: React.FC<PostingFormActionsProps> = ({
  loading,
  listingType,
  onClose,
  saveAsDefault,
  onSaveAsDefaultChange
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
        <Checkbox 
          id="save-default" 
          checked={saveAsDefault}
          onCheckedChange={onSaveAsDefaultChange}
        />
        <Label 
          htmlFor="save-default" 
          className="text-sm font-normal cursor-pointer flex items-center gap-2"
        >
          <Save className="h-3.5 w-3.5" />
          Save transaction methods and location as my defaults
        </Label>
      </div>
      
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Posting..." : `Post ${listingType === 'wanted' ? 'Request' : 'Listing'}`}
        </Button>
      </div>
    </div>
  );
};

export default PostingFormActions;
