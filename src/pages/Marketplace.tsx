
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Search } from "lucide-react";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];

  // Sample products data
  const products = [
    { id: "1", title: "Calculus Textbook", price: 45, category: "Books", seller: "Sarah M.", image: "/placeholder.svg" },
    { id: "2", title: "Mini Fridge", price: 120, category: "Furniture", seller: "Mike R.", image: "/placeholder.svg" },
    { id: "3", title: "MacBook Pro", price: 800, category: "Electronics", seller: "Emma L.", image: "/placeholder.svg" },
    { id: "4", title: "Winter Jacket", price: 60, category: "Clothing", seller: "Tom W.", image: "/placeholder.svg" },
    { id: "5", title: "Basketball", price: 15, category: "Sports", seller: "Alex K.", image: "/placeholder.svg" },
    { id: "6", title: "Desk Chair", price: 85, category: "Furniture", seller: "Lisa H.", image: "/placeholder.svg" },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button>+ Post Item</Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">by {product.seller}</p>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <p className="text-xl font-bold text-green-600 mb-3">${product.price}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(product.id)}
                  className={favorites.includes(product.id) ? "text-red-500" : ""}
                >
                  <Heart size={16} className={favorites.includes(product.id) ? "fill-current" : ""} />
                </Button>
                <Button size="sm" className="flex-1">
                  <ShoppingCart size={16} className="mr-1" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
