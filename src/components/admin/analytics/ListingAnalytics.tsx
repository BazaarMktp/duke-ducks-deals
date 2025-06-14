
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ShoppingCart, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface CategoryData {
  category: string;
  count: number;
  color: string;
}

interface ListingTrend {
  month: string;
  listings: number;
}

interface PriceRange {
  range: string;
  count: number;
}

const ListingAnalytics = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [listingTrends, setListingTrends] = useState<ListingTrend[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalListings: 0,
    activeListings: 0,
    averagePrice: 0,
    listingsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListingAnalytics();
  }, []);

  const fetchListingAnalytics = async () => {
    try {
      setLoading(true);
      
      const { data: listings } = await supabase
        .from('listings')
        .select('category, status, price, created_at');

      if (listings) {
        // Process category data
        const categoryMap = new Map();
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f'];
        
        listings.forEach(listing => {
          const category = listing.category || 'Other';
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const categoryStats = Array.from(categoryMap.entries())
          .map(([category, count], index) => ({
            category,
            count,
            color: colors[index % colors.length]
          }))
          .sort((a, b) => b.count - a.count);

        setCategoryData(categoryStats);

        // Process listing trends
        const trends = processListingTrends(listings);
        setListingTrends(trends);

        // Process price ranges
        const ranges = processPriceRanges(listings);
        setPriceRanges(ranges);

        // Calculate total stats
        const activeListings = listings.filter(l => l.status === 'active').length;
        const currentMonth = new Date().getMonth();
        const listingsThisMonth = listings.filter(l => 
          new Date(l.created_at).getMonth() === currentMonth
        ).length;

        const prices = listings.filter(l => l.price && l.price > 0).map(l => Number(l.price));
        const averagePrice = prices.length > 0 
          ? prices.reduce((sum, price) => sum + price, 0) / prices.length 
          : 0;

        setTotalStats({
          totalListings: listings.length,
          activeListings,
          averagePrice: Math.round(averagePrice),
          listingsThisMonth
        });
      }

    } catch (error) {
      console.error('Error fetching listing analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processListingTrends = (listings: any[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const listingsInMonth = listings.filter(l => {
        const listingDate = new Date(l.created_at);
        return listingDate.getFullYear() === date.getFullYear() && 
               listingDate.getMonth() === date.getMonth();
      }).length;
      
      last6Months.push({
        month: monthNames[date.getMonth()],
        listings: listingsInMonth
      });
    }
    
    return last6Months;
  };

  const processPriceRanges = (listings: any[]) => {
    const ranges = [
      { range: '$0-25', min: 0, max: 25 },
      { range: '$26-50', min: 26, max: 50 },
      { range: '$51-100', min: 51, max: 100 },
      { range: '$101-200', min: 101, max: 200 },
      { range: '$201+', min: 201, max: Infinity }
    ];

    return ranges.map(range => ({
      range: range.range,
      count: listings.filter(l => {
        const price = Number(l.price) || 0;
        return price >= range.min && price <= range.max;
      }).length
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading listing analytics...</div>;
  }

  const chartConfig = {
    listings: {
      label: "Listings",
      color: "#8884d8",
    },
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalListings}</div>
            <p className="text-xs text-muted-foreground">All time listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeListings}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.listingsThisMonth}</div>
            <p className="text-xs text-muted-foreground">New listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.averagePrice}</div>
            <p className="text-xs text-muted-foreground">Average listing price</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Listing Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={listingTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="listings" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Price Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Price Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceRanges}>
                <XAxis dataKey="range" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingAnalytics;
