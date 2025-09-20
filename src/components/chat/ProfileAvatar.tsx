import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  profileName?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  profileName, 
  avatarUrl, 
  size = 'md', 
  showOnline = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatarUrl} alt={profileName} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
          {getInitials(profileName)}
        </AvatarFallback>
      </Avatar>
      {showOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default ProfileAvatar;