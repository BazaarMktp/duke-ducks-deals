import { Button } from "@/components/ui/button";

interface PostingFormActionsProps {
  loading: boolean;
  listingType: 'offer' | 'wanted';
  onClose: () => void;
  saveAsDefault?: boolean;
  onSaveAsDefaultChange?: (checked: boolean) => void;
}

const PostingFormActions: React.FC<PostingFormActionsProps> = ({
  loading,
  listingType,
  onClose
}) => {
  return (
    <div className="flex gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onClose} className="flex-1">
        Cancel
      </Button>
      <Button type="submit" disabled={loading} className="flex-1">
        {loading ? "Posting..." : `Post ${listingType === 'wanted' ? 'Request' : 'Listing'}`}
      </Button>
    </div>
  );
};

export default PostingFormActions;
