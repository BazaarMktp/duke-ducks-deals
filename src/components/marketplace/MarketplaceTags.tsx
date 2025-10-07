import { Badge } from "@/components/ui/badge";
import { MarketplaceListing } from "./types";

interface MarketplaceTagsProps {
  listings: MarketplaceListing[];
  onTagClick: (tag: string) => void;
}

const MarketplaceTags = ({ listings, onTagClick }: MarketplaceTagsProps) => {
  // Fixed tags that always appear
  const fixedTags = ["microwave", "fridge", "furniture"];
  
  // Generate dynamic tags from listings
  const generateDynamicTags = () => {
    const tagCount: { [key: string]: number } = {};
    
    listings.forEach(listing => {
      const title = listing.title.toLowerCase();
      const category = listing.category?.toLowerCase() || "";
      
      // Extract common item types
      const keywords = [
        "textbook", "laptop", "chair", "desk", "bed", "couch", 
        "table", "lamp", "tv", "monitor", "keyboard", "mouse"
      ];
      
      keywords.forEach(keyword => {
        if (title.includes(keyword) || category.includes(keyword)) {
          tagCount[keyword] = (tagCount[keyword] || 0) + 1;
        }
      });
    });
    
    // Get top 5 dynamic tags
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  };
  
  const dynamicTags = generateDynamicTags();
  
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-2">Suggested:</p>
      <div className="flex flex-wrap gap-2">
        {fixedTags.map(tag => (
        <Badge
          key={tag}
          variant="outline"
          className="cursor-pointer hover:bg-primary/10 border-blue-500 text-foreground capitalize px-3 py-1.5 transition-all"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
      {dynamicTags.map(tag => (
        <Badge
          key={tag}
          variant="outline"
          className="cursor-pointer hover:bg-primary/10 text-muted-foreground capitalize px-3 py-1.5 transition-all"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
      </div>
    </div>
  );
};

export default MarketplaceTags;
