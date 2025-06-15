
import { Verified } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const VerifiedBadge = ({ isVerified, size = 'sm', showText = false }: VerifiedBadgeProps) => {
  if (!isVerified) return null;

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  const badgeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-2.5 py-1'
  };

  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-100 text-blue-800 border-blue-300 ${badgeClasses[size]} inline-flex items-center gap-1`}
    >
      <Verified size={iconSizes[size]} className="text-blue-600" />
      {showText && "Verified"}
    </Badge>
  );
};

export default VerifiedBadge;
