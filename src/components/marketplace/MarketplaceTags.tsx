import { MarketplaceListing } from "./types";

interface MarketplaceTagsProps {
  listings: MarketplaceListing[];
  onTagClick: (tag: string) => void;
  currentQuery?: string;
}

const MarketplaceTags = ({ listings, onTagClick, currentQuery = '' }: MarketplaceTagsProps) => {
  const fixedTags = ["microwave", "fridge", "furniture"];
  
  const generateDynamicTags = () => {
    const tagCount: { [key: string]: number } = {};
    listings.forEach(listing => {
      const itemTag = (listing as any).item_tag;
      if (itemTag && itemTag !== 'other') {
        tagCount[itemTag] = (tagCount[itemTag] || 0) + 1;
      } else {
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
    return Object.entries(tagCount)
      .filter(([tag]) => !fixedTags.includes(tag))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);
  };
  
  const dynamicTags = generateDynamicTags();
  const allTags = ['', ...fixedTags, ...dynamicTags];
  
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {allTags.map(tag => {
        const isActive = tag === '' ? currentQuery === '' : currentQuery.toLowerCase() === tag.toLowerCase();
        return (
          <button
            key={tag || 'all'}
            onClick={() => onTagClick(tag)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tag === '' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        );
      })}
    </div>
  );
};

export default MarketplaceTags;
