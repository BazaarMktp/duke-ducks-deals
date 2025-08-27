
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Duke Students Choose Bazaar</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The trusted marketplace built specifically for Duke University students and campus life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <CardTitle>Easy to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Simple and intuitive interface designed for students</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <CardTitle>Campus Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Connect with verified students from your campus</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-blue-600" size={32} />
              </div>
              <CardTitle>Safe Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Secure transactions within your trusted campus network</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
