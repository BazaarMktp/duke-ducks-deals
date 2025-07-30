import { BookOpen, Laptop, Home, Coffee } from "lucide-react";

export const CategoriesSection = () => {
  const categories = [
    {
      icon: BookOpen,
      title: "Textbooks",
      description: "Buy or sell used books and rent digital versions",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
    },
    {
      icon: Laptop,
      title: "Electronics", 
      description: "Laptops, tablets, and gadgets from fellow students",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop"
    },
    {
      icon: Home,
      title: "Dorm Essentials",
      description: "Furniture, decor, and everything you need for your room",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop"
    },
    {
      icon: Coffee,
      title: "Food & Snacks",
      description: "Grab snacks, meal prep, and campus dining deals",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What students are buying
          </h2>
          <p className="text-muted-foreground text-lg">
            Popular items across all campus categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};