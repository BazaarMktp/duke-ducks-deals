
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";

interface PostingFormFieldsProps {
  formData: {
    title: string;
    description: string;
    price: string;
    location: string;
    housingType: string;
    images: string[];
  };
  category: 'marketplace' | 'housing' | 'services';
  listingType: 'offer' | 'wanted';
  onInputChange: (field: string, value: string) => void;
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
        <Label htmlFor="title">
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
        />
      </div>

      <div>
        <Label htmlFor="description">
          {listingType === 'wanted' ? 'Additional details' : 'Description'}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          rows={4}
          placeholder={
            listingType === 'wanted' 
              ? "Provide more details about what you're looking for..."
              : "Describe your listing..."
          }
        />
      </div>

      <ImageUpload
        images={formData.images}
        onImagesChange={onImagesChange}
        maxImages={5}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">
            {getPricePlaceholder()} {listingType === 'wanted' && '(Optional)'}
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onInputChange("price", e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
            placeholder="Enter location..."
          />
        </div>
      </div>

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
