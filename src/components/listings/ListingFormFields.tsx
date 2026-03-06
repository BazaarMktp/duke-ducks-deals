import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ImageUpload";
import { Info, ShieldAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTitlePlaceholder, getDescriptionPlaceholder, getLocationPlaceholder } from "../posting/utils/placeholderText";
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
  return (
    <>
      <div>
        <Label htmlFor="title" className="text-base font-medium">
          {formData.listingType === 'wanted' ? 'What are you looking for?' : 'Title'}
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
        <Label htmlFor="description" className="text-base font-medium">
          {formData.listingType === 'wanted' ? 'Detailed description of your needs' : 'Description'}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          rows={formData.listingType === 'wanted' ? 6 : 4}
          placeholder={getDescriptionPlaceholder(formData.listingType, formData.category)}
          className={formData.listingType === 'wanted' ? "text-base leading-relaxed" : ""}
        />
      </div>

      {formData.listingType === 'offer' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Images</Label>

          {/* Real photo warning */}
          <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5">
            <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-semibold text-foreground">Important: The first image must be a real photo of the item you are selling.</span>
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="h-3 w-3" />
                      <span>Why does this matter?</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">This helps buyers trust your listing and reduces scams. Listings with real photos get more responses and sell faster.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            maxImages={5}
          />

          {/* Real photo confirmation checkbox – shown once images are uploaded */}
          {formData.images.length > 0 && (
            <div className="flex items-start space-x-2 rounded-lg border border-border bg-card p-3">
              <Checkbox
                id="realPhotoConfirmed"
                checked={formData.realPhotoConfirmed}
                onCheckedChange={(checked) => handleInputChange("realPhotoConfirmed", checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="realPhotoConfirmed" className="text-sm font-normal leading-snug cursor-pointer">
                I confirm the first image is a real photo of the item I am selling.
              </Label>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium">
            {formData.listingType === 'wanted' ? 'Budget' : 'Price'} {formData.category === 'services' ? '(per hour)' : formData.category === 'housing' ? '(per month)' : ''}
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
            className={formData.listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium">My Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className={formData.listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>
      </div>


      <div className="flex items-center space-x-2">
        <Checkbox
          id="openToNegotiation"
          checked={formData.openToNegotiation}
          onCheckedChange={(checked) => handleInputChange("openToNegotiation", checked as boolean)}
        />
        <Label htmlFor="openToNegotiation" className="text-sm font-normal">
          Open to price negotiation
        </Label>
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
        </div>
      )}

      {formData.listingType === 'wanted' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Info className="h-4 w-4" />
                <span>Tips for better responses</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <ul className="text-sm space-y-1">
                <li>• Be specific about what you're looking for</li>
                <li>• Include your preferred condition (new, used, etc.)</li>
                <li>• Mention your timeline or urgency</li>
                <li>• Add any size, color, or model preferences</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default ListingFormFields;
