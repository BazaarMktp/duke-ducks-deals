
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { useState, useEffect } from 'react';

interface CategorySelectorProps {
  category: string;
  listingType: string;
  onCategoryChange: (value: string) => void;
  onListingTypeChange: (value: string) => void;
  title?: string;
  description?: string;
  images?: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  listingType,
  onCategoryChange,
  onListingTypeChange,
  title,
  description,
  images,
}) => {
  const { suggestCategory, loading } = useAIAnalysis();
  const [suggestion, setSuggestion] = useState<{ category: string; confidence: number } | null>(null);

  const handleSuggestCategory = async () => {
    if (!title) return;
    
    const result = await suggestCategory(title, description, images);
    if (result) {
      setSuggestion(result);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      onCategoryChange(suggestion.category);
      setSuggestion(null);
    }
  };

  useEffect(() => {
    setSuggestion(null);
  }, [category]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="mb-2">
          <Label htmlFor="category">Category</Label>
        </div>
        
        {suggestion && suggestion.category !== category && (
          <div className="mb-2 p-2 border rounded-md bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">Suggested: </span>
                <Badge variant="secondary">
                  {suggestion.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.round(suggestion.confidence * 100)}% confident
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applySuggestion}
                className="text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        )}
        
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

      <div className="flex flex-col">
        <div className="mb-2">
          <Label htmlFor="listingType">Type of Listing</Label>
        </div>
        <div className="flex-1 flex flex-col justify-end">
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
    </div>
  );
};

export default CategorySelector;
