
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Heart } from "lucide-react";

export const QuickActions = () => {
  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <Link to="/create-listing">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center p-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="text-blue-600" size={20} />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors text-base">
                  Create Listing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 text-center text-sm">Post items you're offering</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/create-listing" state={{ listingType: 'wanted' }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center p-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Search className="text-green-600" size={20} />
                </div>
                <CardTitle className="group-hover:text-green-600 transition-colors text-base">
                  Create Request
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 text-center text-sm">Post what you're looking for</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/favorites">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center p-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Heart className="text-purple-600" size={20} />
                </div>
                <CardTitle className="group-hover:text-purple-600 transition-colors text-base">
                  Favorites
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-gray-600 text-center text-sm">View your saved items</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};
