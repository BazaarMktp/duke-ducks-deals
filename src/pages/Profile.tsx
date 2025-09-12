
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Settings, Trophy, Target } from "lucide-react";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { Badge } from "./profile/types";
import UserBadges from "@/components/profile/UserBadges";
import VerificationProgress from "@/components/profile/VerificationProgress";
import { useUserVerification } from "@/hooks/useUserVerification";
import { LevelDisplay } from "@/components/gamification/LevelDisplay";
import { AchievementShowcase } from "@/components/gamification/AchievementShowcase";
import { ChallengeDisplay } from "@/components/gamification/ChallengeDisplay";
import { EmailPreferences } from "@/components/gamification/EmailPreferences";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    profile_name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    points: 0,
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const { isVerified } = useUserVerification(user?.id);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBadges();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          profile_name: data.profile_name || "",
          email: data.email || user?.email || "",
          phone_number: data.phone_number || "",
          avatar_url: data.avatar_url || user?.user_metadata?.avatar_url || "",
          points: data.points || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_badges")
        .select("badge_type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast.error("Failed to load badges");
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          profile_name: profile.profile_name,
          phone_number: profile.phone_number,
          avatar_url: profile.avatar_url
        })
        .eq("id", user?.id);
      
      if (error) throw error;

      // Update user metadata
      if (user) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { 
            avatar_url: profile.avatar_url,
            profile_name: profile.profile_name
          }
        });
        
        if (metadataError) throw metadataError;
      }
      
      toast.success("Profile updated successfully");
      // Re-fetch badges in case verification was completed
      fetchBadges();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VerificationProgress profile={profile} isVerified={isVerified} />
      
      <Tabs defaultValue="profile" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="preferences">
            Email Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row flex-wrap justify-between items-start">
              <div className="flex items-center gap-3">
                <CardTitle>Profile Settings</CardTitle>
                <UserBadges badges={badges} inline />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Campus Cred</p>
                <p className="text-2xl font-bold text-blue-600">{profile.points}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <LevelDisplay showDetails={true} />
              
              <ProfilePictureUpload
                currentAvatarUrl={profile.avatar_url}
                profileName={profile.profile_name}
                onAvatarUpdate={handleAvatarUpdate}
              />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile_name">Username</Label>
                  <Input 
                    id="profile_name" 
                    value={profile.profile_name} 
                    onChange={(e) => setProfile({ ...profile, profile_name: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    value={profile.full_name} 
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input 
                    id="phone_number" 
                    value={profile.phone_number || ""} 
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} 
                  />
                </div>
                
                <Button 
                  onClick={handleUpdate} 
                  className="w-full mt-4" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} 
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <UserBadges badges={badges} />
          </div>
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <AchievementShowcase />
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <ChallengeDisplay />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <EmailPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
