import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  profileName?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showOnline?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  profileName, 
  avatarUrl, 
  size = 'md', 
  showOnline = false 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base'
  };

  const onlineIndicatorSize = {
    xs: 'w-2 h-2 border',
    sm: 'w-2.5 h-2.5 border-[1.5px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2'
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

  // Generate a consistent color based on name
  const getColorFromName = (name?: string) => {
    if (!name) return 'from-primary/20 to-primary/40';
    
    const colors = [
      'from-blue-400/30 to-blue-500/50',
      'from-purple-400/30 to-purple-500/50',
      'from-green-400/30 to-green-500/50',
      'from-orange-400/30 to-orange-500/50',
      'from-pink-400/30 to-pink-500/50',
      'from-teal-400/30 to-teal-500/50',
      'from-indigo-400/30 to-indigo-500/50',
      'from-rose-400/30 to-rose-500/50',
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative flex-shrink-0">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-background`}>
        <AvatarImage src={avatarUrl} alt={profileName} className="object-cover" />
        <AvatarFallback className={`bg-gradient-to-br ${getColorFromName(profileName)} text-foreground font-semibold`}>
          {getInitials(profileName)}
        </AvatarFallback>
      </Avatar>
      {showOnline && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${onlineIndicatorSize[size]} bg-green-500 border-background rounded-full`} />
      )}
    </div>
  );
};

export default ProfileAvatar;
