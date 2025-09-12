import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAchievements } from "@/hooks/useAchievements";
import { 
  Award, 
  Star, 
  Trophy, 
  Crown, 
  Zap,
  User,
  Store,
  Heart,
  MessageCircle,
  DollarSign,
  HelpingHand,
  Recycle,
  UserCheck
} from "lucide-react";

const getIconForAchievement = (iconName: string | null) => {
  const iconMap = {
    'user-check': UserCheck,
    'store': Store,
    'heart': Heart,
    'message-circle': MessageCircle,
    'dollar-sign': DollarSign,
    'helping-hand': HelpingHand,
    'award': Award,
    'star': Star,
    'recycle': Recycle,
    'crown': Crown
  };
  
  const IconComponent = iconName ? iconMap[iconName as keyof typeof iconMap] : Award;
  return IconComponent || Award;
};

export const AchievementShowcase = () => {
  const { 
    userAchievements, 
    achievements, 
    loading, 
    getRarityColor, 
    getRarityBadgeColor,
    getEarnedAchievements,
    getUnlockedAchievements 
  } = useAchievements();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading achievements...</p>
        </CardContent>
      </Card>
    );
  }

  const earnedAchievements = getEarnedAchievements();
  const unlockedAchievements = getUnlockedAchievements();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements
          <Badge variant="outline" className="ml-auto">
            {earnedAchievements.length} / {achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="earned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earned">
              Earned ({earnedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available ({unlockedAchievements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="mt-4">
            {earnedAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No achievements earned yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start engaging with the community to unlock achievements!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earnedAchievements.map((userAchievement) => {
                  const achievement = userAchievement.achievement;
                  if (!achievement) return null;
                  
                  const IconComponent = getIconForAchievement(achievement.icon_name);
                  
                  return (
                    <TooltipProvider key={achievement.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className={`p-2 rounded-full bg-primary/10 ${getRarityColor(achievement.rarity)}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium truncate">{achievement.name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getRarityBadgeColor(achievement.rarity)}`}
                                >
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {achievement.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Zap className="h-3 w-3 text-accent" />
                                  +{achievement.xp_reward} XP
                                </div>
                                {achievement.points_reward > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="h-3 w-3 text-primary" />
                                    +{achievement.points_reward} pts
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs">
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned: {new Date(userAchievement.earned_at).toLocaleDateString()}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-4">
            {unlockedAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Crown className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">All achievements unlocked!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're a true champion! More achievements coming soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => {
                  const IconComponent = getIconForAchievement(achievement.icon_name);
                  
                  return (
                    <TooltipProvider key={achievement.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors opacity-75">
                            <div className={`p-2 rounded-full bg-muted ${getRarityColor(achievement.rarity)} opacity-60`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium truncate text-muted-foreground">
                                  {achievement.name}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getRarityBadgeColor(achievement.rarity)} opacity-60`}
                                >
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {achievement.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Zap className="h-3 w-3 text-accent opacity-60" />
                                  +{achievement.xp_reward} XP
                                </div>
                                {achievement.points_reward > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="h-3 w-3 text-primary opacity-60" />
                                    +{achievement.points_reward} pts
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs">
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="mt-2 text-xs">
                              <p className="text-muted-foreground">Requirements:</p>
                              {Object.entries(achievement.requirements).map(([key, value]) => (
                                <p key={key} className="text-muted-foreground">
                                  • {key.replace(/_/g, ' ')}: {String(value)}
                                </p>
                              ))}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};