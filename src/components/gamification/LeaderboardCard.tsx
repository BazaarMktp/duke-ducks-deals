import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardEntry {
  user_id: string;
  profile_name: string;
  avatar_url: string | null;
  current_level: number;
  total_xp: number;
  points: number;
}

export const LeaderboardCard = () => {
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get top 10 users by XP with profiles
      const { data: leaderboard, error } = await supabase
        .from('user_levels')
        .select(`
          user_id,
          current_level,
          total_xp
        `)
        .order('total_xp', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Get profile data separately
      const userIds = leaderboard?.map(entry => entry.user_id) || [];
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, profile_name, avatar_url, points')
        .in('id', userIds);

      if (profileError) throw profileError;

      const formattedData = leaderboard?.map(entry => {
        const profile = profiles?.find(p => p.id === entry.user_id);
        return {
          user_id: entry.user_id,
          profile_name: profile?.profile_name || 'Unknown',
          avatar_url: profile?.avatar_url || null,
          current_level: entry.current_level,
          total_xp: entry.total_xp,
          points: profile?.points || 0
        };
      }) || [];

      setTopUsers(formattedData);

      // Find current user's rank
      if (user) {
        const userIndex = formattedData.findIndex(entry => entry.user_id === user.id);
        if (userIndex !== -1) {
          setUserRank(userIndex + 1);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium w-5 text-center">{position}</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Campus Leaders
          {userRank && (
            <Badge variant="outline" className="ml-auto">
              Your rank: #{userRank}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUsers.length === 0 ? (
          <div className="text-center py-4">
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">No rankings available yet</p>
          </div>
        ) : (
          topUsers.map((entry, index) => {
            const position = index + 1;
            const isCurrentUser = user?.id === entry.user_id;
            
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                } transition-colors`}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(position)}
                </div>
                
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar_url || ''} />
                  <AvatarFallback>
                    {entry.profile_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                    {entry.profile_name}
                    {isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Level {entry.current_level}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-3 w-3 text-accent" />
                    {entry.total_xp.toLocaleString()} XP
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.points} pts
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          Rankings update daily. Keep engaging to climb the leaderboard!
        </div>
      </CardContent>
    </Card>
  );
};