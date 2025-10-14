
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import TransactionMethods from "./TransactionMethods";
import HelpText from "./HelpText";
import { ListingOptimizer } from "@/components/ai/ListingOptimizer";
import { getTitlePlaceholder, getDescriptionPlaceholder, getLocationPlaceholder } from "./utils/placeholderText";

interface PostingFormFieldsProps {
  formData: {
    title: string;
    description: string;
    price: string;
    location: string;
    housingType: string;
    images: string[];
    allowPickup: boolean;
    allowMeetOnCampus: boolean;
    allowDropOff: boolean;
  };
  category: 'marketplace' | 'housing' | 'services';
  listingType: 'offer' | 'wanted';
  onInputChange: (field: string, value: string | boolean) => void;
  onImagesChange: (images: string[]) => void;
  getPricePlaceholder: () => string;
}

const PostingFormFields: React.FC<PostingFormFieldsProps> = ({
  formData,
  category,
  listingType,
  onInputChange,
  onImagesChange,
  getPricePlaceholder
}) => {
  return (
    <>
      <div>
        <Label htmlFor="title" className="text-base font-medium">
          {listingType === 'wanted' ? 'What are you looking for?' : 'Title'} *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          required
          placeholder={getTitlePlaceholder(listingType, category)}
          className={listingType === 'wanted' ? "text-lg py-3" : ""}
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium">
          {listingType === 'wanted' ? 'Detailed description of your needs' : 'Description'} *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          required
          rows={listingType === 'wanted' ? 6 : 4}
          placeholder={getDescriptionPlaceholder(listingType, category)}
          className={listingType === 'wanted' ? "text-base leading-relaxed" : ""}
        />
        {listingType === 'wanted' && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 The more details you provide, the better responses you'll get from potential sellers!
          </p>
        )}
      </div>

      {/* AI Optimization - Optional Suggestions */}
      <ListingOptimizer
        title={formData.title}
        description={formData.description}
        category={category}
        onTitleSuggestion={(newTitle) => onInputChange("title", newTitle)}
        onDescriptionSuggestion={(newDesc) => onInputChange("description", newDesc)}
      />

      <div>
        <Label className="text-base font-medium">Images *</Label>
        <ImageUpload
          images={formData.images}
          onImagesChange={onImagesChange}
          maxImages={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium">
            {getPricePlaceholder()} *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            required
            placeholder={category === 'services' ? '25.00' : category === 'housing' ? '800.00' : '299.99'}
            className={listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium">My Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder={getLocationPlaceholder(listingType)}
            className={listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>
      </div>

      {category === 'marketplace' && listingType === 'offer' && (
        <TransactionMethods
          allowPickup={formData.allowPickup}
          allowMeetOnCampus={formData.allowMeetOnCampus}
          allowDropOff={formData.allowDropOff}
          onInputChange={onInputChange}
        />
      )}

      <HelpText listingType={listingType} />
    </>
  );
};

export default PostingFormFields;
