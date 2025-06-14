
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { University } from "lucide-react";

interface College {
  id: string;
  name: string;
}

interface CollegeFilterProps {
  colleges: College[];
  selectedCollege: string;
  onCollegeChange: (collegeId: string) => void;
  className?: string;
}

const CollegeFilter = ({
  colleges,
  selectedCollege,
  onCollegeChange,
  className,
}: CollegeFilterProps) => {
  return (
    <div className={className}>
      <Select value={selectedCollege} onValueChange={onCollegeChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <div className="flex items-center">
            <University className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by college" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Colleges</SelectItem>
          {colleges.map((college) => (
            <SelectItem key={college.id} value={college.id}>
              {college.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CollegeFilter;
