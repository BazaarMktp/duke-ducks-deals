
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Calendar } from "lucide-react";

interface ServiceActionsProps {
  user: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartConversation: () => void;
  isOwner: boolean;
  createdAt: string;
}

const ServiceActions = ({ 
  user, 
  isFavorite, 
  onToggleFavorite, 
  onStartConversation, 
  isOwner,
  createdAt 
}: ServiceActionsProps) => {
  return (
    <div>
      <div className="space-y-3">
        {user && !isOwner && (
          <Button 
            onClick={onStartConversation}
            className="w-full"
            size="lg"
          >
            <MessageCircle size={16} className="mr-2" />
            Contact Now
          </Button>
        )}
        
        {user && (
          <Button
            variant="outline"
            onClick={onToggleFavorite}
            className={`w-full ${isFavorite ? "text-red-500" : ""}`}
          >
            <Heart size={16} className={`mr-2 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-1" />
          Listed on {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ServiceActions;
