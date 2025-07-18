
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { getTitlePlaceholder, getDescriptionPlaceholder, getLocationPlaceholder } from "../posting/utils/placeholderText";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import type { ListingFormData } from '@/hooks/useCreateListing';

interface ListingFormFieldsProps {
  formData: ListingFormData;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleImagesChange: (images: string[]) => void;
}

const ListingFormFields: React.FC<ListingFormFieldsProps> = ({
  formData,
  handleInputChange,
  handleImagesChange
}) => {
  const { generateDescription, loading } = useAIAnalysis();

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category) {
      return;
    }

    const result = await generateDescription(formData.title, formData.category, formData.images);
    if (result?.description) {
      handleInputChange('description', result.description);
    }
  };
  return (
    <>
      <div>
        <Label htmlFor="title" className="text-base font-medium">
          {formData.listingType === 'wanted' ? 'What are you looking for?' : 'Title'} *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
          placeholder={getTitlePlaceholder(formData.listingType, formData.category)}
          className={formData.listingType === 'wanted' ? "text-lg py-3" : ""}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="description" className="text-base font-medium">
            {formData.listingType === 'wanted' ? 'Detailed description of your needs' : 'Description'} *
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={loading || !formData.title || !formData.category}
            className="text-xs"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            AI Generate
          </Button>
        </div>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          rows={formData.listingType === 'wanted' ? 6 : 4}
          placeholder={getDescriptionPlaceholder(formData.listingType, formData.category)}
          className={formData.listingType === 'wanted' ? "text-base leading-relaxed" : ""}
        />
        {formData.listingType === 'wanted' && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 The more details you provide, the better responses you'll get from potential sellers!
          </p>
        )}
      </div>

      <div>
        <Label className="text-base font-medium">Images *</Label>
        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxImages={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium">
            {formData.listingType === 'wanted' ? 'Budget' : 'Price'} {formData.category === 'services' ? '(per hour)' : formData.category === 'housing' ? '(per month)' : ''} *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
            placeholder={formData.category === 'services' ? '25.00' : formData.category === 'housing' ? '800.00' : '299.99'}
            className={formData.listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium">My Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder={getLocationPlaceholder(formData.listingType)}
            className={formData.listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>
      </div>

      {formData.category === 'marketplace' && formData.listingType === 'offer' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Transaction Methods</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowPickup"
                checked={formData.allowPickup}
                onCheckedChange={(checked) => handleInputChange("allowPickup", checked as boolean)}
              />
              <Label htmlFor="allowPickup" className="text-sm font-normal">
                Allow pickup
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowMeetOnCampus"
                checked={formData.allowMeetOnCampus}
                onCheckedChange={(checked) => handleInputChange("allowMeetOnCampus", checked as boolean)}
              />
              <Label htmlFor="allowMeetOnCampus" className="text-sm font-normal">
                Meet on campus
              </Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Select at least one transaction method for your listing
          </p>
        </div>
      )}

      {formData.listingType === 'wanted' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips for better responses:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about what you're looking for</li>
            <li>• Include your preferred condition (new, used, etc.)</li>
            <li>• Mention your timeline or urgency</li>
            <li>• Add any size, color, or model preferences</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default ListingFormFields;
