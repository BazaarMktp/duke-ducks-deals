
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ServicesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ServicesSearch = ({ searchTerm, onSearchChange }: ServicesSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default ServicesSearch;
