import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown, Coffee, BookOpen, Utensils, Building2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MeetupSpotSelectorProps {
  onSelect: (spot: string) => void;
  disabled?: boolean;
}

interface SpotCategory {
  name: string;
  icon: React.ElementType;
  spots: string[];
}

const spotCategories: SpotCategory[] = [
  {
    name: "Popular Spots",
    icon: Building2,
    spots: ["Bryan Center", "West Union", "The Plaza", "East Campus Quad"],
  },
  {
    name: "Coffee Shops",
    icon: Coffee,
    spots: ["Perk Coffee", "Café @ WU", "Joe Van Gogh", "Ninth Street Espresso"],
  },
  {
    name: "Libraries",
    icon: BookOpen,
    spots: ["Perkins Library", "Rubenstein Library", "Lilly Library", "Bostock Library"],
  },
  {
    name: "Dining",
    icon: Utensils,
    spots: ["Marketplace", "Freeman Center", "Loop Pizza", "Ninth Street"],
  },
];

const MeetupSpotSelector: React.FC<MeetupSpotSelectorProps> = ({ onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Popular Spots");

  const handleSelect = (spot: string) => {
    onSelect(`Let's meet at ${spot}! 📍`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-muted"
          aria-label="Select meetup spot"
        >
          <MapPin size={20} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0" 
        align="start"
        side="top"
      >
        <div className="p-3 border-b border-border">
          <h4 className="font-semibold text-sm">Suggest a Meetup Spot</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick a safe campus location
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {spotCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.name;
            
            return (
              <div key={category.name} className="border-b border-border last:border-0">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "text-muted-foreground transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="pb-2 px-2">
                    {category.spots.map((spot) => (
                      <button
                        key={spot}
                        onClick={() => handleSelect(spot)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {spot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MeetupSpotSelector;
