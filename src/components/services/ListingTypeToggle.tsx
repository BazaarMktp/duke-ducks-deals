import { Button } from "@/components/ui/button";
import { Package, Search, Home, Users } from "lucide-react";

interface ListingTypeToggleProps {
  activeType: 'offer' | 'wanted';
  onTypeChange: (type: 'offer' | 'wanted') => void;
  category?: 'marketplace' | 'housing' | 'services';
}

const ListingTypeToggle = ({ activeType, onTypeChange, category = 'services' }: ListingTypeToggleProps) => {
  const getLabels = () => {
    switch (category) {
      case 'marketplace': return { offer: 'Items', wanted: 'Requests' };
      case 'housing': return { offer: 'Housing', wanted: 'Requests' };
      default: return { offer: 'Services', wanted: 'Requests' };
    }
  };

  const getIcons = () => {
    switch (category) {
      case 'marketplace': return { offer: Package, wanted: Search };
      case 'housing': return { offer: Home, wanted: Search };
      default: return { offer: Users, wanted: Search };
    }
  };

  const labels = getLabels();
  const icons = getIcons();
  const OfferIcon = icons.offer;
  const WantedIcon = icons.wanted;

  return (
    <div className="flex gap-0.5 bg-muted/60 p-0.5 rounded-xl w-fit mx-auto my-4">
      <button
        onClick={() => onTypeChange('offer')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
          activeType === 'offer'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <OfferIcon size={15} />
        {labels.offer}
      </button>
      <button
        onClick={() => onTypeChange('wanted')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${
          activeType === 'wanted'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <WantedIcon size={15} />
        {labels.wanted}
      </button>
    </div>
  );
};

export default ListingTypeToggle;
