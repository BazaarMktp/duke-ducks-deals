import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import VerifiedBadge from "@/components/common/VerifiedBadge";
import { Calendar, Clock, Phone } from "lucide-react";

interface SellerInfoProps {
  profileName: string;
  email?: string;
  phoneNumber?: string;
  createdAt: string;
  avatarUrl?: string;
  fullName?: string;
  isAuthenticated: boolean;
  userId: string;
  listingCreatedAt: string;
  listingType?: string;
  isOwnListing?: boolean;
}

const SellerInfo = ({ 
  profileName, email, phoneNumber, createdAt, avatarUrl, fullName,
  isAuthenticated, userId, listingCreatedAt, listingType = 'offer', isOwnListing = false
}: SellerInfoProps) => {
  const displayName = isAuthenticated && (isOwnListing || email) 
    ? fullName || profileName 
    : profileName;
    
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—';
  
  const listingDate = listingCreatedAt
    ? new Date(listingCreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="rounded-xl border border-border bg-card p-4 mb-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {displayName?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-semibold text-foreground text-sm">{displayName}</h4>
            <VerifiedBadge isVerified={true} />
          </div>
          <p className="text-xs text-muted-foreground">
            <Calendar size={11} className="inline mr-1" />
            Member since {memberSince}
          </p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
        <p><Clock size={11} className="inline mr-1.5" /> Posted {listingDate}</p>
        {isAuthenticated && email && <p className="truncate">{email}</p>}
        {isAuthenticated && phoneNumber && (
          <p><Phone size={11} className="inline mr-1.5" />{phoneNumber}</p>
        )}
      </div>
    </div>
  );
};

export default SellerInfo;
