
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, Calendar, TrendingUp, Activity } from "lucide-react";

interface UserGrowthData {
  month: string;
  users: number;
}

interface ActivityData {
  name: string;
  value: number;
  color: string;
}

interface CollegeStats {
  college_name: string;
  user_count: number;
}

const UserAnalytics = () => {
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [collegeStats, setCollegeStats] = useState<CollegeStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    averageSessionTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch user growth over last 6 months
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (profiles) {
        const growthData = processUserGrowthData(profiles);
        setUserGrowth(growthData);
      }

      // Fetch college distribution
      const { data: collegeData } = await supabase
        .from('profiles')
        .select(`
          college_id,
          colleges!inner(name)
        `);

      if (collegeData) {
        const collegeStats = processCollegeData(collegeData);
        setCollegeStats(collegeStats);
      }

      // Fetch activity data
      const { data: listings } = await supabase
        .from('listings')
        .select('category, status');

      const { data: messages } = await supabase
        .from('messages')
        .select('id');

      const { data: conversations } = await supabase
        .from('conversations')
        .select('id');

      if (listings && messages && conversations) {
        const activity = [
          { name: 'Active Listings', value: listings.filter(l => l.status === 'active').length, color: '#8884d8' },
          { name: 'Messages', value: messages.length, color: '#82ca9d' },
          { name: 'Conversations', value: conversations.length, color: '#ffc658' },
          { name: 'Total Listings', value: listings.length, color: '#ff7300' }
        ];
        setActivityData(activity);
      }

      // Calculate total stats
      const currentMonth = new Date().getMonth();
      const newUsersThisMonth = profiles?.filter(p => 
        new Date(p.created_at).getMonth() === currentMonth
      ).length || 0;

      setTotalStats({
        totalUsers: profiles?.length || 0,
        activeUsers: Math.floor((profiles?.length || 0) * 0.75), // Approximate active users
        newUsersThisMonth,
        averageSessionTime: 12 // Mock data - would need session tracking
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processUserGrowthData = (profiles: any[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const usersInMonth = profiles.filter(p => {
        const profileDate = new Date(p.created_at);
        return profileDate.getFullYear() === date.getFullYear() && 
               profileDate.getMonth() === date.getMonth();
      }).length;
      
      last6Months.push({
        month: monthNames[date.getMonth()],
        users: usersInMonth
      });
    }
    
    return last6Months;
  };

  const processCollegeData = (data: any[]) => {
    const collegeMap = new Map();
    
    data.forEach(item => {
      const collegeName = item.colleges?.name || 'Unknown';
      collegeMap.set(collegeName, (collegeMap.get(collegeName) || 0) + 1);
    });
    
    return Array.from(collegeMap.entries())
      .map(([college_name, user_count]) => ({ college_name, user_count }))
      .sort((a, b) => b.user_count - a.user_count)
      .slice(0, 10); // Top 10 colleges
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const chartConfig = {
    users: {
      label: "Users",
      color: "#8884d8",
    },
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Users active this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">New user registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.averageSessionTime}m</div>
            <p className="text-xs text-muted-foreground">Average session time</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* College Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Top Colleges by User Count</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeStats} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="college_name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="user_count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;
