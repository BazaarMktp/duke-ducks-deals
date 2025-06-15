
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useColleges, College } from "@/hooks/useColleges";

interface CollegeSelectorProps {
  selectedCollegeId: string;
  onCollegeChange: (collegeId: string) => void;
  required?: boolean;
}

export const CollegeSelector = ({ selectedCollegeId, onCollegeChange, required = false }: CollegeSelectorProps) => {
  const { colleges, loading } = useColleges();

  return (
    <div>
      <Label htmlFor="college">College/University {required && '*'}</Label>
      <Select value={selectedCollegeId} onValueChange={onCollegeChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Select your college/university" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="" disabled>Loading colleges...</SelectItem>
          ) : (
            colleges.map((college) => (
              <SelectItem key={college.id} value={college.id}>
                <div className="flex items-center gap-2">
                  {college.image_url && (
                    <img 
                      src={college.image_url} 
                      alt={`${college.name} logo`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  {college.name}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
