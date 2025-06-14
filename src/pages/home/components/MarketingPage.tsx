import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Gift, Gem, BadgeCheck, Award, HeartHandshake, Recycle } from "lucide-react";
import { categories } from "../constants";
import { Stats } from "../types";

interface MarketingPageProps {
  stats: Stats;
}

export const MarketingPage = ({ stats }: MarketingPageProps) => {
  const statsDisplay = [
    { label: "Active Listings", value: stats.activeListings.toString() },
    { label: "Students", value: stats.totalUsers.toString() },
    { label: "Donations", value: stats.totalDonations.toString() }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('/lovable-uploads/b78b0861-a175-4fd0-835e-08d13103ea11.png')`
          }}
        />
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">Bazaar</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your campus marketplace for buying, selling, housing, services, and donations. 
            Connect with fellow students and make campus life easier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Shopping
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-700 bg-transparent">
                Join Bazaar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for campus life, all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="text-white" size={32} />
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bazaar?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple and intuitive interface designed for students</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Campus Community</h3>
              <p className="text-gray-600">Connect with verified students from your campus</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Give Back</h3>
              <p className="text-gray-600">Donate items to help fellow students in need</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Gem className="text-yellow-400" size={36} />
              Get Rewarded
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn points and unlock cool badges for being an active part of the campus community.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <BadgeCheck className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-800">First Post</h3>
              <p className="text-sm text-gray-500">Make your first listing.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <Award className="h-12 w-12 text-yellow-500 mb-2" />
              <h3 className="font-semibold text-gray-800">Top Trader</h3>
              <p className="text-sm text-gray-500">Complete 10 trades.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <HeartHandshake className="h-12 w-12 text-rose-500 mb-2" />
              <h3 className="font-semibold text-gray-800">Community Helper</h3>
              <p className="text-sm text-gray-500">Help a student in need.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <Recycle className="h-12 w-12 text-lime-500 mb-2" />
              <h3 className="font-semibold text-gray-800">Eco Warrior</h3>
              <p className="text-sm text-gray-500">Donate your used items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students already using Bazaar to simplify their campus experience
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Sign Up Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
