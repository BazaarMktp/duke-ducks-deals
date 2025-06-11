
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";

interface HousingActionsProps {
  user: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartConversation: () => void;
  isOwner: boolean;
}

const HousingActions = ({ 
  user, 
  isFavorite, 
  onToggleFavorite, 
  onStartConversation, 
  isOwner 
}: HousingActionsProps) => {
  return (
    <div className="flex gap-3">
      {user && (
        <Button
          variant="outline"
          onClick={onToggleFavorite}
          className={isFavorite ? "text-red-500" : ""}
        >
          <Heart size={16} className={isFavorite ? "fill-current" : ""} />
        </Button>
      )}
      {user && !isOwner && (
        <Button 
          onClick={onStartConversation}
          className="flex-1"
        >
          <MessageCircle size={16} className="mr-2" />
          Contact Now
        </Button>
      )}
    </div>
  );
};

export default HousingActions;
