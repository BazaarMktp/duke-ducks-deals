
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Verified } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface VerificationCriteria {
  fullName: boolean;
  profilePicture: boolean;
  phoneNumber: boolean;
  emailVerified: boolean;
}

interface VerificationProgressProps {
  profile: {
    full_name: string;
    avatar_url: string;
    phone_number: string;
    email: string;
  };
  isVerified: boolean;
}

const VerificationProgress = ({ profile, isVerified }: VerificationProgressProps) => {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState<VerificationCriteria>({
    fullName: false,
    profilePicture: false,
    phoneNumber: false,
    emailVerified: false,
  });

  useEffect(() => {
    setCriteria({
      fullName: !!profile.full_name?.trim(),
      profilePicture: !!profile.avatar_url,
      phoneNumber: !!profile.phone_number?.trim(),
      emailVerified: !!user?.email_confirmed_at,
    });
  }, [profile, user]);

  const completedCount = Object.values(criteria).filter(Boolean).length;
  const totalCount = Object.keys(criteria).length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const criteriaItems = [
    {
      key: 'fullName',
      label: 'Complete your full name',
      completed: criteria.fullName,
      description: 'Add your real name to your profile'
    },
    {
      key: 'profilePicture',
      label: 'Upload a profile picture',
      completed: criteria.profilePicture,
      description: 'Add a clear photo of yourself'
    },
    {
      key: 'phoneNumber',
      label: 'Add your phone number',
      completed: criteria.phoneNumber,
      description: 'Verify your contact information'
    },
    {
      key: 'emailVerified',
      label: 'Verify your college email',
      completed: criteria.emailVerified,
      description: 'Confirm your student status'
    },
  ];

  const awardBadge = async () => {
    if (progressPercentage === 100 && !isVerified && user) {
      try {
        const { error } = await supabase
          .from('user_badges')
          .insert({
            user_id: user.id,
            badge_type: 'VERIFIED_BLUE_DEVIL'
          });
        
        if (!error) {
          // Badge awarded successfully - parent component will re-fetch
          console.log('Verified Blue Devil badge awarded!');
        }
      } catch (error) {
        console.error('Error awarding badge:', error);
      }
    }
  };

  useEffect(() => {
    awardBadge();
  }, [progressPercentage, isVerified, user]);

  if (isVerified) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Verified className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Verified Blue Devil</h3>
              <p className="text-sm text-green-600">Your profile is 100% complete and verified!</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 ml-auto">
              <Verified className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Verified className="h-5 w-5 text-blue-600" />
          Get Verified Blue Devil Badge
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Progress: {completedCount}/{totalCount} completed
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Complete all requirements below to earn your Verified Blue Devil badge and show other students you're trustworthy!
          </p>
          {criteriaItems.map((item) => (
            <div key={item.key} className="flex items-start gap-3">
              {item.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${item.completed ? 'text-green-800' : 'text-gray-800'}`}>
                  {item.label}
                </p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationProgress;
