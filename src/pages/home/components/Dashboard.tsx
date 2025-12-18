import { WelcomeSection } from "./WelcomeSection";
import { QuickActions } from "./QuickActions";
import { FeaturedItems } from "./FeaturedItems";
import { FeaturedRequests } from "./FeaturedRequests";
import { StatsSection } from "./StatsSection";
import { Stats, Listing } from "../types";
import ProfilePictureReminder from "@/components/ProfilePictureReminder";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SemesterCountdown } from "@/components/semester/SemesterCountdown";
import { EndOfSemesterBanner } from "@/components/semester/EndOfSemesterBanner";

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
  const [showEndOfSemesterBanner, setShowEndOfSemesterBanner] = useState(true);

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
    
    // Check if user dismissed the banner
    const bannerDismissed = localStorage.getItem('endOfSemesterBannerDismissed');
    if (bannerDismissed) {
      const dismissedDate = new Date(bannerDismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setShowEndOfSemesterBanner(false);
      }
    }
  }, [user]);

  const handleUploadClick = () => {
    window.location.href = '/profile';
  };

  const handleBannerDismiss = () => {
    localStorage.setItem('endOfSemesterBannerDismissed', new Date().toISOString());
    setShowEndOfSemesterBanner(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeSection user={user} />
      
      {/* Semester Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <SemesterCountdown />
        
        {showEndOfSemesterBanner && (
          <EndOfSemesterBanner onDismiss={handleBannerDismiss} />
        )}
        
        <ProfilePictureReminder
          currentAvatarUrl={profileData?.avatar_url}
          onUploadClick={handleUploadClick}
        />
      </div>
      
      <QuickActions />
      <div className="text-left">
        <FeaturedItems featuredListings={featuredListings} isLoading={isLoading} />
      </div>
      <FeaturedRequests featuredRequests={featuredRequests} />
      <StatsSection stats={stats} />
    </div>
  );
};
