
import { Award, BadgeCheck, HeartHandshake, Recycle, Verified } from 'lucide-react';
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/pages/profile/types';

const BADGE_INFO = {
  FIRST_POST: {
    title: 'First Post',
    description: 'Awarded for making your first post.',
    icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
  },
  TOP_TRADER: {
    title: 'Top Trader',
    description: 'Awarded for completing 10 successful transactions.',
    icon: <Award className="h-8 w-8 text-yellow-500" />,
  },
  COMMUNITY_HELPER: {
    title: 'Community Helper',
    description: 'Awarded for helping someone with a wanted request.',
    icon: <HeartHandshake className="h-8 w-8 text-rose-500" />,
  },
  ECO_WARRIOR: {
    title: 'Eco Warrior',
    description: 'Awarded for listing 5+ items for free or for donation.',
    icon: <Recycle className="h-8 w-8 text-lime-500" />,
  },
  VERIFIED_BLUE_DEVIL: {
    title: 'Verified Blue Devil',
    description: 'Awarded for completing your profile 100%.',
    icon: <Verified className="h-8 w-8 text-blue-500" />,
  },
};

interface UserBadgesProps {
  badges: Badge[];
}

const UserBadges = ({ badges }: UserBadgesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't earned any badges yet. Keep contributing to the community!</p>
        ) : (
          <TooltipProvider>
            <div className="flex flex-wrap gap-6">
              {badges.map(({ badge_type }) => {
                const badgeInfo = BADGE_INFO[badge_type];
                if (!badgeInfo) return null;

                return (
                  <Tooltip key={badge_type}>
                    <TooltipTrigger className="flex flex-col items-center gap-2 text-center">
                      {badgeInfo.icon}
                      <BadgeUI variant="secondary">{badgeInfo.title}</BadgeUI>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{badgeInfo.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBadges;
