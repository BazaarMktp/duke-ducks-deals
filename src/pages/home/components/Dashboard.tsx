
import { WelcomeSection } from "./WelcomeSection";
import { QuickActions } from "./QuickActions";
import { FeaturedItems } from "./FeaturedItems";
import { FeaturedRequests } from "./FeaturedRequests";
import { StatsSection } from "./StatsSection";
import { Stats, Listing } from "../types";
import ProfilePictureReminder from "@/components/ProfilePictureReminder";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  user: any;
  featuredListings: (Listing & { seller?: string })[];
  featuredRequests: (Listing & { requester?: string })[];
  isLoading: boolean;
  stats: Stats;
}

export const Dashboard = ({ 
  user, 
  featuredListings, 
  featuredRequests, 
  isLoading, 
  stats 
}: DashboardProps) => {
  const [profileData, setProfileData] = useState<{ avatar_url?: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      setProfileData(data);
    };

    fetchProfile();
  }, [user]);

  const handleUploadClick = () => {
    // Navigate to profile page where users can upload their avatar
    window.location.href = '/profile';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeSection user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ProfilePictureReminder
          currentAvatarUrl={profileData?.avatar_url}
          onUploadClick={handleUploadClick}
        />
      </div>
      <QuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeaturedItems featuredListings={featuredListings} isLoading={isLoading} />
        <FeaturedRequests featuredRequests={featuredRequests} />
      </div>
      <StatsSection stats={stats} />
    </div>
  );
};
