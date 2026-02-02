import { Badge } from "@/components/ui/badge";
import { MarketplaceListing } from "./types";

interface MarketplaceTagsProps {
  listings: MarketplaceListing[];
  onTagClick: (tag: string) => void;
  currentQuery?: string;
}

const MarketplaceTags = ({ listings, onTagClick, currentQuery = '' }: MarketplaceTagsProps) => {
  // Fixed tags that always appear
  const fixedTags = ["microwave", "fridge", "furniture"];
  
  // Generate dynamic tags from AI-validated item_tag field
  const generateDynamicTags = () => {
    const tagCount: { [key: string]: number } = {};
    
    listings.forEach(listing => {
      // Use AI-validated item_tag if available, fall back to text search
      const itemTag = (listing as any).item_tag;
      
      if (itemTag && itemTag !== 'other') {
        tagCount[itemTag] = (tagCount[itemTag] || 0) + 1;
      } else {
        // Fallback to text search for uncategorized items
        const title = listing.title.toLowerCase();
        const keywords = [
          "textbook", "laptop", "chair", "desk", "bed", "couch", 
          "table", "lamp", "tv", "monitor", "keyboard", "mouse"
        ];
        
        keywords.forEach(keyword => {
          if (title.includes(keyword)) {
            tagCount[keyword] = (tagCount[keyword] || 0) + 1;
          }
        });
      }
    });
    
    // Get top 5 dynamic tags
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  };
  
  const dynamicTags = generateDynamicTags();
  
  return (
    <div className="pb-8 mb-8 flex items-center flex-wrap gap-2">
      <p className="text-sm text-muted-foreground">Suggested:</p>
      
      {/* All button */}
      <Badge
        className={`cursor-pointer transition-all px-3 py-1.5 ${
          currentQuery === '' 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-primary/10 bg-muted text-foreground'
        }`}
        onClick={() => onTagClick('')}
      >
        All
      </Badge>
      
      {fixedTags.map(tag => (
        <Badge
          key={tag}
          className={`cursor-pointer transition-all capitalize px-3 py-1.5 ${
            currentQuery.toLowerCase() === tag.toLowerCase()
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-primary/10 bg-muted text-foreground'
          }`}
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
      {dynamicTags.map(tag => (
        <Badge
          key={tag}
          variant="outline"
          className={`cursor-pointer transition-all capitalize px-3 py-1.5 ${
            currentQuery.toLowerCase() === tag.toLowerCase()
              ? 'bg-primary text-primary-foreground border-primary'
              : 'hover:bg-primary/10 text-muted-foreground'
          }`}
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default MarketplaceTags;
