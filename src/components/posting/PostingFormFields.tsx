import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import TransactionMethods from "./TransactionMethods";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTitlePlaceholder, getDescriptionPlaceholder } from "./utils/placeholderText";

const ITEM_TAG_OPTIONS = [
  { value: "microwave", label: "Microwave" },
  { value: "fridge", label: "Fridge" },
  { value: "furniture", label: "Furniture" },
  { value: "dorm decor", label: "Dorm Decor" },
  { value: "books", label: "Books" },
  { value: "clothes", label: "Clothes" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

interface PostingFormFieldsProps {
  formData: {
    title: string;
    description: string;
    price: string;
    location: string;
    housingType: string;
    itemTag?: string;
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

const FieldInfo = ({ tip }: { tip: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex text-muted-foreground hover:text-foreground transition-colors ml-1.5" aria-label="More info">
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-sm">
        {tip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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
        <Label htmlFor="title" className="text-base font-medium inline-flex items-center">
          {listingType === 'wanted' ? 'What are you looking for?' : 'Title'}
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
        <Label htmlFor="description" className="text-base font-medium inline-flex items-center">
          Description
          <FieldInfo tip={listingType === 'wanted'
            ? "Be specific about condition, size, color, model, and your timeline."
            : "Describe the item's condition, features, and any flaws honestly."
          } />
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
      </div>

      <div>
        <Label className="text-base font-medium inline-flex items-center">
          {listingType === 'offer' ? 'Images' : 'Images'}
          {listingType === 'wanted' && <FieldInfo tip="Optional. Adding a reference image can help sellers understand what you're looking for." />}
          {listingType === 'offer' && <FieldInfo tip="The first image must be a real photo of your item." />}
        </Label>
        <ImageUpload
          images={formData.images}
          onImagesChange={onImagesChange}
          maxImages={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium inline-flex items-center">
            {listingType === 'wanted' ? 'Budget' : getPricePlaceholder()}
            {listingType === 'wanted' && <FieldInfo tip="Optional. Adding a budget helps sellers know your price range." />}
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            required={listingType === 'offer'}
            className={listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium inline-flex items-center">
            Location
            <FieldInfo tip="Optional. Helps nearby students find your listing." />
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
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
    </>
  );
};

export default PostingFormFields;
