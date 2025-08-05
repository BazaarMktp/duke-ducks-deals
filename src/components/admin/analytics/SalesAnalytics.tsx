import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ShoppingCart, TrendingUp, ExternalLink } from "lucide-react";

interface SalesData {
  total_sold: number;
  bazaar_sales: number;
  external_sales: number;
  external_platforms: Array<{
    platform: string;
    count: number;
  }>;
}

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      // Get total sold items
      const { data: soldItems, error: soldError } = await supabase
        .from('listings')
        .select('sold_on_bazaar, sold_elsewhere_location')
        .eq('status', 'sold');

      if (soldError) throw soldError;

      const total_sold = soldItems?.length || 0;
      const bazaar_sales = soldItems?.filter(item => item.sold_on_bazaar === true)?.length || 0;
      const external_sales = soldItems?.filter(item => item.sold_on_bazaar === false)?.length || 0;

      // Count external platforms
      const externalPlatforms = soldItems
        ?.filter(item => item.sold_on_bazaar === false && item.sold_elsewhere_location)
        ?.reduce((acc, item) => {
          const platform = item.sold_elsewhere_location?.toLowerCase() || 'unknown';
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

      const external_platforms = Object.entries(externalPlatforms)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 platforms

      setSalesData({
        total_sold,
        bazaar_sales,
        external_sales,
        external_platforms
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading sales analytics...</div>;
  }

  if (!salesData) {
    return <div className="text-center py-8">Failed to load sales data</div>;
  }

  const pieData = [
    { name: 'Bazaar Sales', value: salesData.bazaar_sales, color: '#22c55e' },
    { name: 'External Sales', value: salesData.external_sales, color: '#ef4444' }
  ];

  const conversionRate = salesData.total_sold > 0 
    ? ((salesData.bazaar_sales / salesData.total_sold) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.total_sold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bazaar Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{salesData.bazaar_sales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Sales</CardTitle>
            <ExternalLink className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{salesData.external_sales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bazaar Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
            <p className="text-xs text-gray-500">of total sales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.total_sold > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* External Platforms Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top External Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.external_platforms.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData.external_platforms}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="platform" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No external sales data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAnalytics;