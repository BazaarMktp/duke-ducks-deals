import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Star } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

interface LevelDisplayProps {
  showDetails?: boolean;
  compact?: boolean;
}

export const LevelDisplay = ({ showDetails = false, compact = false }: LevelDisplayProps) => {
  const { userLevel, getXPForNextLevel, getProgressToNextLevel } = useGamification();

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-gradient-to-r from-primary to-secondary text-white">
          <Star className="h-3 w-3 mr-1" />
          Lvl {userLevel.current_level}
        </Badge>
        <div className="text-sm text-muted-foreground">
          {userLevel.current_xp} XP
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressToNextLevel() * 100;
  const xpToNext = getXPForNextLevel();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-primary to-secondary text-white text-base px-3 py-1"
          >
            <Star className="h-4 w-4 mr-2" />
            Level {userLevel.current_level}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-accent" />
          <span>{userLevel.total_xp} Total XP</span>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {userLevel.current_level + 1}</span>
              <span className="font-medium">{xpToNext} XP needed</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground text-center">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{userLevel.current_xp}</div>
              <div className="text-muted-foreground">Current XP</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-accent">{userLevel.current_level + 1}</div>
              <div className="text-muted-foreground">Next Level</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};