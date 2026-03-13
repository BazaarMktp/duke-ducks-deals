
import { Zap, Refrigerator, Sofa, Palette, BookOpen, Shirt, Laptop } from "lucide-react";
import { MarketplaceListing } from "./types";

export const MARKETPLACE_CATEGORIES = [
  { key: "", label: "All", icon: null },
  { key: "microwave", label: "Microwave", icon: Zap },
  { key: "fridge", label: "Fridge", icon: Refrigerator },
  { key: "furniture", label: "Furniture", icon: Sofa },
  { key: "dorm decor", label: "Decor", icon: Palette },
  { key: "books", label: "Books", icon: BookOpen },
  { key: "clothes", label: "Clothes", icon: Shirt },
  { key: "technology", label: "Tech", icon: Laptop },
] as const;

interface MarketplaceTagsProps {
  listings: MarketplaceListing[];
  onTagClick: (tag: string) => void;
  currentCategory?: string | null;
}

const MarketplaceTags = ({ onTagClick, currentCategory = null }: MarketplaceTagsProps) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
      {MARKETPLACE_CATEGORIES.map(({ key, label, icon: Icon }) => {
        const isActive = key === '' ? currentCategory === null : currentCategory === key;
        return (
          <button
            key={key || 'all'}
            onClick={() => onTagClick(key)}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {Icon && <Icon className="h-3 w-3" />}
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default MarketplaceTags;
