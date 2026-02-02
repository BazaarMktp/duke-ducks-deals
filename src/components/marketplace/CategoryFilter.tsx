
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CATEGORIES = [
  { id: null, label: "All", icon: "✨" },
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "textbooks", label: "Textbooks", icon: "📚" },
  { id: "furniture", label: "Furniture", icon: "🪑" },
  { id: "dorm", label: "Dorm", icon: "🛏️" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "free", label: "Free Stuff", icon: "🎁" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "appliances", label: "Appliances", icon: "🔌" },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap mb-4">
      <div className="flex gap-2 pb-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.id ?? "all"}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border hover:shadow-md active:scale-95",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};

export default CategoryFilter;
