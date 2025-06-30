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
  const getTitlePlaceholder = () => {
    if (listingType === 'wanted') {
      switch (category) {
        case 'marketplace':
          return 'Looking for twin mattress in good condition';
        case 'housing':
          return 'Looking for 2-bedroom apartment near campus';
        case 'services':
          return 'Need math tutoring for calculus';
        default:
          return 'What are you looking for?';
      }
    } else {
      switch (category) {
        case 'marketplace':
          return 'Twin Mattress - Like New Condition';
        case 'housing':
          return '2-Bedroom Apartment Available for Spring Semester';
        case 'services':
          return 'Math Tutoring - Calculus & Statistics';
        default:
          return 'Enter title here...';
      }
    }
  };

  const getDescriptionPlaceholder = () => {
    if (listingType === 'wanted') {
      switch (category) {
        case 'marketplace':
          return 'I\'m looking for a twin mattress in good condition for my dorm room. Preferably memory foam or hybrid, no stains or odors. Must be clean and comfortable. Willing to meet on campus or arrange pickup. Budget is flexible for the right mattress.';
        case 'housing':
          return 'Looking for a 2-bedroom apartment or house within walking distance of campus. Need it for the spring semester (January-May). Prefer furnished or partially furnished. Must allow pets (small dog). Budget is flexible for the right place.';
        case 'services':
          return 'I need help with Calculus I - specifically with derivatives and integration. Looking for someone who can meet twice a week, preferably in the evenings. Can meet at the library or virtually. Please mention your experience and availability.';
        default:
          return 'Please provide detailed information about what you\'re looking for, including specifications, preferred condition, timeline, and any other requirements...';
      }
    } else {
      switch (category) {
        case 'marketplace':
          return 'Twin mattress in excellent condition, used for only 6 months. Memory foam with cooling gel layer. No stains, odors, or damage. Always used with mattress protector. Great for dorm rooms or small spaces. Includes mattress protector.';
        case 'housing':
          return 'Beautiful 2-bedroom apartment available for spring semester sublease. Fully furnished with modern appliances. 10-minute walk to campus. Includes utilities (water, electricity, internet). Pet-friendly building with laundry facilities. Available January 1st.';
        case 'services':
          return 'Experienced math tutor offering help with Calculus, Statistics, and Algebra. I\'m a senior math major with 3+ years of tutoring experience. Available weekday evenings and weekends. Can meet at the library, your place, or conduct sessions online.';
        default:
          return 'Describe your listing in detail. Include condition, features, availability, and any important information buyers should know...';
      }
    }
  };

  const getLocationPlaceholder = () => {
    if (listingType === 'wanted') {
      return 'Campus library, dorms, or anywhere on campus';
    }
    return 'North Campus, Student Union, Main Library area';
  };

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
          placeholder={getTitlePlaceholder()}
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
          placeholder={getDescriptionPlaceholder()}
          className={listingType === 'wanted' ? "text-base leading-relaxed" : ""}
        />
        {listingType === 'wanted' && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 The more details you provide, the better responses you'll get from potential sellers!
          </p>
        )}
      </div>

      {/* Images are required for both offers and requests now */}
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
            placeholder={getLocationPlaceholder()}
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
