
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface ServicesCategoriesProps {
  categories: string[];
}

const ServicesCategories = ({ categories }: ServicesCategoriesProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Popular Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => (
          <Card key={category} className="p-4 text-center hover:shadow-md cursor-pointer transition-shadow">
            <Users className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium">{category}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesCategories;
