import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChallenges } from "@/hooks/useChallenges";
import { 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Star, 
  CheckCircle, 
  Timer 
} from "lucide-react";

export const ChallengeDisplay = () => {
  const { 
    challenges, 
    userProgress, 
    loading,
    getChallengeProgress,
    checkChallengeCompletion,
    getChallengeProgressPercentage,
    getDailyChallenges,
    getWeeklyChallenges,
    getMonthlyChallenges,
    getCompletedChallenges
  } = useChallenges();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading challenges...</p>
        </CardContent>
      </Card>
    );
  }

  const renderChallengeCard = (challenge: any, progress: any) => {
    const userProgress = getChallengeProgress(challenge.id);
    const progressData = userProgress?.progress || {};
    const isCompleted = userProgress?.status === 'completed';
    const progressPercentage = getChallengeProgressPercentage(challenge, progressData);

    return (
      <Card key={challenge.id} className={`${isCompleted ? 'border-green-200 bg-green-50/50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Target className="h-5 w-5 text-primary" />
                )}
                {challenge.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
            </div>
            <Badge 
              variant={challenge.challenge_type === 'daily' ? 'default' : 'secondary'}
              className="ml-2"
            >
              {challenge.challenge_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Requirements:</h4>
            {Object.entries(challenge.requirements).map(([key, required]) => {
              const current = (progressData[key] as number) || 0;
              const isComplete = current >= (required as number);
              
              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className={`${isComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`font-medium ${isComplete ? 'text-green-600' : ''}`}>
                    {current} / {String(required)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent" />
                <span>+{challenge.xp_reward} XP</span>
              </div>
              {challenge.points_reward > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-primary" />
                  <span>+{challenge.points_reward} pts</span>
                </div>
              )}
            </div>
            {challenge.ends_at && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" />
                <span>Ends {new Date(challenge.ends_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const dailyChallenges = getDailyChallenges();
  const weeklyChallenges = getWeeklyChallenges();
  const monthlyChallenges = getMonthlyChallenges();
  const completedChallenges = getCompletedChallenges();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Challenges
          <Badge variant="outline" className="ml-auto">
            {completedChallenges.length} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4 space-y-4">
            {dailyChallenges.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No daily challenges available</p>
              </div>
            ) : (
              dailyChallenges.map((challenge) => 
                renderChallengeCard(challenge, getChallengeProgress(challenge.id))
              )
            )}
          </TabsContent>

          <TabsContent value="weekly" className="mt-4 space-y-4">
            {weeklyChallenges.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No weekly challenges available</p>
              </div>
            ) : (
              weeklyChallenges.map((challenge) => 
                renderChallengeCard(challenge, getChallengeProgress(challenge.id))
              )
            )}
          </TabsContent>

          <TabsContent value="monthly" className="mt-4 space-y-4">
            {monthlyChallenges.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No monthly challenges available</p>
              </div>
            ) : (
              monthlyChallenges.map((challenge) => 
                renderChallengeCard(challenge, getChallengeProgress(challenge.id))
              )
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No completed challenges yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete challenges to earn XP and points!
                </p>
              </div>
            ) : (
              completedChallenges.map((userProgress) => 
                userProgress.challenge && renderChallengeCard(userProgress.challenge, userProgress)
              )
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};