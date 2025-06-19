
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ImageUpload";

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
          {listingType === 'wanted' ? 'What are you looking for?' : 'Title'}
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          required
          placeholder={
            listingType === 'wanted' 
              ? `What ${category} are you looking for?`
              : `Enter ${category} title...`
          }
          className={listingType === 'wanted' ? "text-lg py-3" : ""}
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium">
          {listingType === 'wanted' ? 'Detailed description of your needs' : 'Description'}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          rows={listingType === 'wanted' ? 6 : 4}
          placeholder={
            listingType === 'wanted' 
              ? "Please provide detailed information about what you're looking for, including specifications, preferred condition, timeline, and any other requirements..."
              : "Describe your listing..."
          }
          className={listingType === 'wanted' ? "text-base leading-relaxed" : ""}
        />
        {listingType === 'wanted' && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 The more details you provide, the better responses you'll get from potential sellers!
          </p>
        )}
      </div>

      {/* Only show images for offers, not for requests */}
      {listingType === 'offer' && (
        <ImageUpload
          images={formData.images}
          onImagesChange={onImagesChange}
          maxImages={5}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium">
            {getPricePlaceholder()} {listingType === 'wanted' && '(Optional)'}
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            placeholder="0.00"
            className={listingType === 'wanted' ? "text-lg" : ""}
          />
          {listingType === 'wanted' && (
            <p className="text-sm text-muted-foreground mt-1">
              Enter your budget or leave blank if negotiable
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder={listingType === 'wanted' ? "Where would you like to meet/pickup?" : "Enter location..."}
            className={listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>
      </div>

      {/* Transaction Methods */}
      {category === 'marketplace' && listingType === 'offer' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Transaction Methods</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowPickup"
                checked={formData.allowPickup}
                onCheckedChange={(checked) => onInputChange("allowPickup", checked as boolean)}
              />
              <Label htmlFor="allowPickup" className="text-sm font-normal">
                Allow pickup
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowMeetOnCampus"
                checked={formData.allowMeetOnCampus}
                onCheckedChange={(checked) => onInputChange("allowMeetOnCampus", checked as boolean)}
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

      {/* Additional help text for requests */}
      {listingType === 'wanted' && (
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

      {/* Temporarily disabled - can be re-enabled later */}
      {/* {category === 'housing' && (
        <div>
          <Label htmlFor="housingType">Housing Type</Label>
          <Select onValueChange={(value) => onInputChange("housingType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select housing type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sublease">Sublease</SelectItem>
              <SelectItem value="for_rent">For Rent</SelectItem>
              <SelectItem value="roommate_wanted">Roommate Wanted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )} */}
    </>
  );
};

export default PostingFormFields;
