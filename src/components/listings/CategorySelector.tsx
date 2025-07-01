
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  category: string;
  listingType: string;
  onCategoryChange: (value: string) => void;
  onListingTypeChange: (value: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  listingType,
  onCategoryChange,
  onListingTypeChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marketplace">Marketplace</SelectItem>
            {/* Temporarily disabled - can be re-enabled later */}
            {/* <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="services">Services</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="listingType">Type of Listing</Label>
        <Select value={listingType} onValueChange={onListingTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="offer">Offering</SelectItem>
            <SelectItem value="wanted">Looking For</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategorySelector;
