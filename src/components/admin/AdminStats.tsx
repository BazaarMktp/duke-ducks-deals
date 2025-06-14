
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, MessageSquare, Ban, AlertTriangle, Activity, BarChart } from "lucide-react";
import UserAnalytics from "./analytics/UserAnalytics";
import ListingAnalytics from "./analytics/ListingAnalytics";

interface PlatformStats {
  total_users: number;
  total_listings: number;
  active_listings: number;
  total_conversations: number;
  total_messages: number;
  banned_users: number;
  open_support_tickets: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_platform_stats');
      if (error) throw error;
      setStats(data as unknown as PlatformStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Failed to load statistics</div>;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Listings",
      value: stats.total_listings,
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Active Listings",
      value: stats.active_listings,
      icon: FileText,
      color: "text-emerald-600"
    },
    {
      title: "Conversations",
      value: stats.total_conversations,
      icon: MessageSquare,
      color: "text-purple-600"
    },
    {
      title: "Messages",
      value: stats.total_messages,
      icon: MessageSquare,
      color: "text-indigo-600"
    },
    {
      title: "Banned Users",
      value: stats.banned_users,
      icon: Ban,
      color: "text-red-600"
    },
    {
      title: "Open Support Tickets",
      value: stats.open_support_tickets,
      icon: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            User Analytics
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Listing Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserAnalytics />
        </TabsContent>

        <TabsContent value="listings">
          <ListingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStats;
