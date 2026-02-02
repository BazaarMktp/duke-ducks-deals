import PostingForm from "@/components/PostingForm";

interface UnifiedListingCreationProps {
  category: 'marketplace' | 'housing' | 'services';
  listingType?: 'offer' | 'wanted';
  onClose: () => void;
  onSuccess: () => void;
}

export const UnifiedListingCreation: React.FC<UnifiedListingCreationProps> = ({
  category,
  listingType = 'offer',
  onClose,
  onSuccess
}) => {
  // Go directly to manual creation - no AI workflow choice
  return (
    <PostingForm
      category={category}
      listingType={listingType}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};
