
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ListingSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ListingSearch = ({ searchTerm, onSearchChange }: ListingSearchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Search className="h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default ListingSearch;
