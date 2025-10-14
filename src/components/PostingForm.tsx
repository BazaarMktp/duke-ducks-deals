
import { Card, CardContent } from "@/components/ui/card";
import { usePostingForm } from "@/hooks/usePostingForm";
import PostingFormHeader from "./posting/PostingFormHeader";
import PostingFormFields from "./posting/PostingFormFields";
import PostingFormActions from "./posting/PostingFormActions";

interface PostingFormProps {
  category: 'marketplace' | 'housing' | 'services';
  onClose: () => void;
  onSuccess: () => void;
  listingType?: 'offer' | 'wanted';
}

const PostingForm: React.FC<PostingFormProps> = ({ 
  category, 
  onClose, 
  onSuccess, 
  listingType = 'offer' 
}) => {
  const {
    formData,
    loading,
    saveAsDefault,
    setSaveAsDefault,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    getFormTitle,
    getPricePlaceholder
  } = usePostingForm({ category, listingType, onSuccess, onClose });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <PostingFormHeader title={getFormTitle()} onClose={onClose} />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PostingFormFields
              formData={formData}
              category={category}
              listingType={listingType}
              onInputChange={handleInputChange}
              onImagesChange={handleImagesChange}
              getPricePlaceholder={getPricePlaceholder}
            />
            <PostingFormActions
              loading={loading}
              listingType={listingType}
              onClose={onClose}
              saveAsDefault={saveAsDefault}
              onSaveAsDefaultChange={setSaveAsDefault}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostingForm;
