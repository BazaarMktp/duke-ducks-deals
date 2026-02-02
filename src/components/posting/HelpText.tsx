import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTextProps {
  listingType: 'offer' | 'wanted';
}

const HelpText: React.FC<HelpTextProps> = ({ listingType }) => {
  if (listingType === 'wanted') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-4 w-4" />
              <span>Tips for better responses</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <ul className="text-sm space-y-1">
              <li>• Be specific about what you're looking for</li>
              <li>• Include your preferred condition (new, used, etc.)</li>
              <li>• Mention your timeline or urgency</li>
              <li>• Add any size, color, or model preferences</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return null;
};

export default HelpText;
