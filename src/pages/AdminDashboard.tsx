
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
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

        <TabsContent value="support">
          <SupportTickets />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
