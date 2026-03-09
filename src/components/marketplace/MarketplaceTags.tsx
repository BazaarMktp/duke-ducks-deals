
import { Zap, Refrigerator, Sofa, Palette, BookOpen, Shirt, Laptop } from "lucide-react";
import { MarketplaceListing } from "./types";

export const MARKETPLACE_CATEGORIES = [
  { key: "", label: "All", icon: null },
  { key: "microwave", label: "Microwave", icon: Zap },
  { key: "fridge", label: "Fridge", icon: Refrigerator },
  { key: "furniture", label: "Furniture", icon: Sofa },
  { key: "dorm decor", label: "Dorm Decor", icon: Palette },
  { key: "books", label: "Books", icon: BookOpen },
  { key: "clothes", label: "Clothes", icon: Shirt },
  { key: "technology", label: "Technology", icon: Laptop },
] as const;

interface MarketplaceTagsProps {
  listings: MarketplaceListing[];
  onTagClick: (tag: string) => void;
  currentCategory?: string | null;
}

const MarketplaceTags = ({ onTagClick, currentCategory = null }: MarketplaceTagsProps) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {MARKETPLACE_CATEGORIES.map(({ key, label, icon: Icon }) => {
        const isActive = key === '' ? currentCategory === null : currentCategory === key;
        return (
          <button
            key={key || 'all'}
            onClick={() => onTagClick(key)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default MarketplaceTags;
