
import React from 'react';
import { Button } from "@/components/ui/button";
import CategorySelector from "./CategorySelector";
import ListingFormFields from "./ListingFormFields";
import type { ListingFormData } from '@/hooks/useCreateListing';
import type { NavigateFunction } from 'react-router-dom';

interface CreateListingFormProps {
  formData: ListingFormData;
  loading: boolean;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleImagesChange: (images: string[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  navigate: NavigateFunction;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({
  formData,
  loading,
  handleInputChange,
  handleImagesChange,
  handleSubmit,
  navigate,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CategorySelector
        category={formData.category}
        listingType={formData.listingType}
        onCategoryChange={(value) => handleInputChange("category", value)}
        onListingTypeChange={(value) => handleInputChange("listingType", value)}
        title={formData.title}
        description={formData.description}
        images={formData.images}
      />

      <ListingFormFields
        formData={formData}
        handleInputChange={handleInputChange}
        handleImagesChange={handleImagesChange}
      />

      <div className="flex gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/my-listings')} 
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : `Create ${formData.listingType === 'wanted' ? 'Request' : 'Listing'}`}
        </Button>
      </div>
    </form>
  );
};

export default CreateListingForm;
