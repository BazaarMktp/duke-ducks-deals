
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    profile_name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
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
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
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
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
    </div>
  );
};

export default Profile;
