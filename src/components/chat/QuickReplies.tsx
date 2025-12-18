import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar, Check, HelpCircle } from "lucide-react";

interface QuickRepliesProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

const quickReplies = [
  { text: "Is this still available?", icon: HelpCircle },
  { text: "Can you meet today?", icon: Calendar },
  { text: "What's your lowest price?", icon: DollarSign },
  { text: "Where can we meet up?", icon: MapPin },
  { text: "I'll take it!", icon: Check },
];

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {quickReplies.map((reply, index) => {
        const Icon = reply.icon;
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply.text)}
            disabled={disabled}
            className="h-8 px-3 text-xs rounded-full bg-background hover:bg-muted border-border hover:border-primary/30 transition-all"
            aria-label={`Quick reply: ${reply.text}`}
          >
            <Icon size={14} className="mr-1.5 text-muted-foreground" />
            {reply.text}
          </Button>
        );
      })}
    </div>
  );
};

export default QuickReplies;
