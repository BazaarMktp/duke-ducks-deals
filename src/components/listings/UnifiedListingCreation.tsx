import { useState } from "react";
import { ListingCreationChoice } from "./ListingCreationChoice";
import PostingForm from "@/components/PostingForm";
import { AIListingWorkflow } from "./AIListingWorkflow";

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
  const [workflow, setWorkflow] = useState<'choice' | 'manual' | 'ai'>('choice');

  const handleChoiceSelect = (choice: 'manual' | 'ai') => {
    setWorkflow(choice);
  };

  if (workflow === 'choice') {
    return (
      <ListingCreationChoice
        onChoiceSelect={handleChoiceSelect}
        onClose={onClose}
      />
    );
  }

  if (workflow === 'manual') {
    return (
      <PostingForm
        category={category}
        listingType={listingType}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }

  if (workflow === 'ai') {
    return (
      <AIListingWorkflow
        category={category}
        listingType={listingType}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }

  return null;
};
