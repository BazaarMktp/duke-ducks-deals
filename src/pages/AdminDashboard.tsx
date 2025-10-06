import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import UserManagement from "@/components/admin/UserManagement";
import ListingManagement from "@/components/admin/ListingManagement";
import SupportTickets from "@/components/admin/SupportTickets";
import AdminStats from "@/components/admin/AdminStats";
import DonationManagement from "@/components/admin/DonationManagement";
import ReportManagement from "@/components/admin/ReportManagement";
import FeedbackManagement from "@/components/admin/FeedbackManagement";
import { PerformanceAnalytics } from "@/components/admin/PerformanceAnalytics";
import { DealsAnalytics } from "@/components/admin/analytics/DealsAnalytics";
import { AutoFeatureControl } from "@/components/admin/AutoFeatureControl";
import { BusinessAdsManagement } from "@/components/admin/BusinessAdsManagement";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your platform's performance</p>
      </div>
      
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="analytics" className="whitespace-nowrap">Analytics</TabsTrigger>
          <TabsTrigger value="users" className="whitespace-nowrap">Users</TabsTrigger>
          <TabsTrigger value="listings" className="whitespace-nowrap">Listings</TabsTrigger>
          <TabsTrigger value="reports" className="whitespace-nowrap">Reports</TabsTrigger>
          <TabsTrigger value="donations" className="whitespace-nowrap">Donations</TabsTrigger>
          <TabsTrigger value="feedback" className="whitespace-nowrap">Feedback</TabsTrigger>
          <TabsTrigger value="performance" className="whitespace-nowrap">Performance</TabsTrigger>
          <TabsTrigger value="deals" className="whitespace-nowrap">Devils Deals</TabsTrigger>
          <TabsTrigger value="ads" className="whitespace-nowrap">Business Ads</TabsTrigger>
          <TabsTrigger value="featuring" className="whitespace-nowrap">Auto-Feature</TabsTrigger>
          <TabsTrigger value="support" className="whitespace-nowrap">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AdminStats />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="listings">
          <ListingManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportManagement />
        </TabsContent>

        <TabsContent value="donations">
          <DonationManagement />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackManagement />
        </TabsContent>

            <TabsContent value="performance">
              <PerformanceAnalytics />
            </TabsContent>
            
            <TabsContent value="deals">
              <DealsAnalytics />
            </TabsContent>

            <TabsContent value="ads">
              <BusinessAdsManagement />
            </TabsContent>

        <TabsContent value="featuring">
          <AutoFeatureControl />
        </TabsContent>

        <TabsContent value="support">
          <SupportTickets />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;