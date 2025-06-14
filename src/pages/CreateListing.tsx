
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateListing } from "@/hooks/useCreateListing";
import CreateListingForm from "@/components/listings/CreateListingForm";

const CreateListing = () => {
  const {
    formData,
    loading,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    navigate,
  } = useCreateListing();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            Create New {formData.listingType === 'wanted' ? 'Request' : 'Listing'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateListingForm
            formData={formData}
            loading={loading}
            handleInputChange={handleInputChange}
            handleImagesChange={handleImagesChange}
            handleSubmit={handleSubmit}
            navigate={navigate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateListing;
